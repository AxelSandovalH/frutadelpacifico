'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, CartState, Product } from '@/types'

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity = 1) => {
        const items = get().items
        const existing = items.find((i) => i.productId === product.id)

        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          })
        } else {
          set({
            items: [...items, { productId: product.id, product, quantity }],
          })
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter((i) => i.productId !== productId) })
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),

      getItemCount: () =>
        get().items.reduce((acc, i) => acc + i.quantity, 0),

      getSavings: () => {
        const items = get().items
        // Descuento 3x2: por cada 3 iguales, 1 gratis
        return items.reduce((acc, item) => {
          if (item.quantity >= 3) {
            const free = Math.floor(item.quantity / 3)
            return acc + free * item.product.price
          }
          return acc
        }, 0)
      },
    }),
    {
      name: 'fruta-del-pacifico-cart',
    }
  )
)
