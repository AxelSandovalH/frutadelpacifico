'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Product,
  POSUser,
  POSCartItem,
  POSSaleRecord,
  PaymentMethod,
  UserRole,
} from '@/types'
import { COMMISSION_RATE } from '@/lib/utils'

// ⚠️  Cambia estos PINs antes de lanzar en producción
const POS_USERS: (POSUser & { pin: string })[] = [
  { id: 'owner', name: 'Axel',          role: 'owner'         as UserRole, pin: '9170' },
  { id: 'colab', name: 'Colaboradora',  role: 'collaborator'  as UserRole, pin: '1177' },
]

interface POSState {
  // ── Auth ──────────────────────────────────────────────────────────────────
  currentUser: POSUser | null
  login:  (pin: string) => boolean
  logout: () => void

  // ── Cart ──────────────────────────────────────────────────────────────────
  cartItems:     POSCartItem[]
  addToCart:     (product: Product) => void
  removeFromCart:(productId: string) => void
  updateCartQty: (productId: string, quantity: number) => void
  clearCart:     () => void
  getCartTotal:  () => number
  getCartSavings:() => number

  // ── Sales log (persisted locally) ─────────────────────────────────────────
  recentSales: POSSaleRecord[]
  recordSale:  (paymentMethod: PaymentMethod) => POSSaleRecord | null
}

export const usePOS = create<POSState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      cartItems:   [],
      recentSales: [],

      // ── Auth ───────────────────────────────────────────────────────────────
      login: (pin: string) => {
        const found = POS_USERS.find((u) => u.pin === pin)
        if (!found) return false
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { pin: _pin, ...safeUser } = found
        set({ currentUser: safeUser })
        return true
      },

      logout: () => set({ currentUser: null, cartItems: [] }),

      // ── Cart ───────────────────────────────────────────────────────────────
      addToCart: (product: Product) => {
        const items = get().cartItems
        const existing = items.find((i) => i.productId === product.id)
        if (existing) {
          set({
            cartItems: items.map((i) =>
              i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          })
        } else {
          set({ cartItems: [...items, { productId: product.id, product, quantity: 1 }] })
        }
      },

      removeFromCart: (productId: string) => {
        set({ cartItems: get().cartItems.filter((i) => i.productId !== productId) })
      },

      updateCartQty: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
          return
        }
        set({
          cartItems: get().cartItems.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ cartItems: [] }),

      getCartTotal: () =>
        get().cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0),

      getCartSavings: () =>
        get().cartItems.reduce((acc, item) => {
          if (item.quantity >= 3) {
            const free = Math.floor(item.quantity / 3)
            return acc + free * item.product.price
          }
          return acc
        }, 0),

      // ── Record sale ────────────────────────────────────────────────────────
      recordSale: (paymentMethod: PaymentMethod) => {
        const state     = get()
        const { currentUser, cartItems } = state
        if (!currentUser || cartItems.length === 0) return null

        const subtotal   = state.getCartTotal()
        const discount   = state.getCartSavings()
        const total      = subtotal - discount
        const commission =
          currentUser.role === 'collaborator'
            ? Math.round(total * COMMISSION_RATE * 100) / 100
            : 0

        const sale: POSSaleRecord = {
          id:            crypto.randomUUID(),
          userId:        currentUser.id,
          userName:      currentUser.name,
          userRole:      currentUser.role,
          items:         cartItems.map((i) => ({
            productId:   i.productId,
            productName: i.product.name,
            quantity:    i.quantity,
            unitPrice:   i.product.price,
            subtotal:    i.product.price * i.quantity,
          })),
          subtotal,
          discount,
          total,
          paymentMethod,
          commission,
          createdAt: new Date().toISOString(),
        }

        set((s) => ({
          recentSales: [sale, ...s.recentSales].slice(0, 500),
          cartItems:   [],
        }))

        return sale
      },
    }),
    {
      name: 'fruta-pos-v1',
      // Only persist auth + sales log; cart resets on reload (intentional)
      partialize: (state) => ({
        currentUser: state.currentUser,
        recentSales: state.recentSales,
      }),
    }
  )
)
