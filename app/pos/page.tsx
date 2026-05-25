'use client'

import { useState, useEffect } from 'react'
import { products } from '@/lib/data'
import { usePOS }    from '@/store/usePOS'
import { savePOSSale } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import type { PaymentMethod, POSSaleRecord } from '@/types'
import {
  LogOut, ShoppingCart, Minus, Plus, Trash2,
  Check, X, LayoutDashboard, Banknote, Smartphone,
} from 'lucide-react'

type Screen = 'pin' | 'pos' | 'cart' | 'payment' | 'success'

// ── PIN Login ──────────────────────────────────────────────────────────────────
function PinScreen({ onSuccess }: { onSuccess: () => void }) {
  const { login } = usePOS()
  const [pin,   setPin]   = useState('')
  const [shake, setShake] = useState(false)

  function pressDigit(d: string) {
    if (pin.length >= 4) return
    const next = pin + d
    setPin(next)
    if (next.length === 4) {
      if (login(next)) {
        onSuccess()
      } else {
        setShake(true)
        setTimeout(() => { setPin(''); setShake(false) }, 700)
      }
    }
  }

  function backspace() { setPin((p) => p.slice(0, -1)) }

  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8 gap-8 select-none">
      {/* Brand */}
      <div className="text-center">
        <div className="text-5xl mb-3">🌴</div>
        <h1 className="text-2xl font-black text-stone-900">Fruta del Pacífico</h1>
        <p className="text-sm text-stone-400 mt-1 font-medium">Punto de venta</p>
      </div>

      {/* Dots */}
      <div className={`flex gap-5 ${shake ? 'animate-[wiggle_0.4s_ease-in-out]' : ''}`}>
        {[0,1,2,3].map((i) => (
          <div
            key={i}
            className={[
              'w-4 h-4 rounded-full border-2 transition-all duration-150',
              i < pin.length
                ? shake
                  ? 'bg-red-400 border-red-400 scale-110'
                  : 'bg-orange-500 border-orange-500 scale-110'
                : 'border-stone-300',
            ].join(' ')}
          />
        ))}
      </div>

      {shake && <p className="text-red-500 text-sm font-medium -mt-4">PIN incorrecto</p>}

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[260px]">
        {keys.map((key, idx) => (
          <button
            key={idx}
            onClick={() => key === '⌫' ? backspace() : key !== '' ? pressDigit(key) : undefined}
            disabled={key === ''}
            className={[
              'h-16 rounded-2xl text-xl font-bold transition-all duration-100 active:scale-95',
              key === '' ? 'invisible' : '',
              key === '⌫'
                ? 'bg-stone-100 text-stone-500 hover:bg-stone-200 active:bg-stone-300'
                : 'bg-white border border-stone-200 text-stone-900 hover:bg-orange-50 hover:border-orange-300 active:bg-orange-100 shadow-sm',
            ].join(' ')}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Top Bar ────────────────────────────────────────────────────────────────────
function TopBar({ onLogout }: { onLogout: () => void }) {
  const { currentUser } = usePOS()
  return (
    <div className="bg-white border-b border-stone-100 flex items-center justify-between px-4 py-3 flex-shrink-0">
      <div>
        <p className="font-black text-stone-900 text-sm leading-tight">Fruta del Pacífico · POS</p>
        <p className="text-xs text-stone-400 font-medium">
          {currentUser?.name} &middot; {currentUser?.role === 'owner' ? 'Admin' : 'Colaboradora'}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {currentUser?.role === 'owner' && (
          <a
            href="/admin"
            className="p-2.5 rounded-xl bg-stone-100 text-stone-500 hover:bg-orange-50 hover:text-orange-500 transition-colors"
            title="Panel admin"
          >
            <LayoutDashboard size={18} />
          </a>
        )}
        <button
          onClick={onLogout}
          className="p-2.5 rounded-xl bg-stone-100 text-stone-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          title="Salir"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  )
}

// ── Product Grid ───────────────────────────────────────────────────────────────
function ProductGrid() {
  const { cartItems, addToCart } = usePOS()

  function getQty(productId: string) {
    return cartItems.find((i) => i.productId === productId)?.quantity ?? 0
  }

  const inStock = products.filter((p) => p.inStock)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 pb-32">
      {inStock.map((product) => {
        const qty = getQty(product.id)
        return (
          <button
            key={product.id}
            onClick={() => addToCart(product)}
            className={[
              'relative rounded-2xl border-2 p-4 text-left transition-all duration-150 active:scale-[0.97]',
              qty > 0
                ? 'border-orange-400 bg-orange-50 shadow-sm shadow-orange-100'
                : 'border-stone-200 bg-white hover:border-orange-200 hover:bg-orange-50/30',
            ].join(' ')}
          >
            {qty > 0 && (
              <span className="absolute top-2.5 right-2.5 bg-orange-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow">
                {qty}
              </span>
            )}
            <div className="text-3xl mb-2 leading-none">{product.emoji}</div>
            <p className="font-bold text-sm text-stone-900 leading-tight">{product.shortName}</p>
            <p className="text-xs text-stone-400 mt-0.5">{product.weight}</p>
            <p className="text-sm font-black text-orange-500 mt-1.5">{formatPrice(product.price)}</p>
          </button>
        )
      })}
    </div>
  )
}

// ── Cart View ──────────────────────────────────────────────────────────────────
function CartView({ onPay, onClose }: { onPay: () => void; onClose: () => void }) {
  const { cartItems, updateCartQty, getCartTotal, getCartSavings } = usePOS()
  const subtotal    = getCartTotal()
  const savings     = getCartSavings()
  const finalTotal  = subtotal - savings

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
        <h2 className="font-black text-xl text-stone-900 flex items-center gap-2">
          <ShoppingCart size={20} className="text-orange-500" />
          Tu venta
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X size={20} className="text-stone-500" />
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-stone-300">
            <ShoppingCart size={36} className="mb-2" />
            <p className="text-sm">Sin productos</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-3 bg-stone-50 rounded-2xl px-4 py-3"
            >
              <span className="text-2xl leading-none flex-shrink-0">{item.product.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-stone-900 truncate">{item.product.shortName}</p>
                <p className="text-xs text-stone-400">{formatPrice(item.product.price)} c/u</p>
              </div>
              {/* Quantity controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => updateCartQty(item.productId, item.quantity - 1)}
                  className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center active:bg-stone-100 transition-colors"
                >
                  {item.quantity === 1
                    ? <Trash2 size={13} className="text-red-400" />
                    : <Minus size={13} className="text-stone-600" />
                  }
                </button>
                <span className="w-6 text-center font-black text-stone-900 text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateCartQty(item.productId, item.quantity + 1)}
                  className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center active:bg-orange-600 transition-colors"
                >
                  <Plus size={13} />
                </button>
              </div>
              <div className="text-sm font-black text-stone-900 min-w-[52px] text-right flex-shrink-0">
                {formatPrice(item.product.price * item.quantity)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Totals + CTA */}
      {cartItems.length > 0 && (
        <div className="flex-shrink-0 px-5 py-4 border-t border-stone-100 space-y-3">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-stone-500">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between font-semibold text-green-600 bg-green-50 rounded-xl px-3 py-1.5">
                <span>🎉 Descuento 3×2</span>
                <span>−{formatPrice(savings)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-1 border-t border-stone-100">
              <span className="font-black text-xl text-stone-900">Total</span>
              <span className="font-black text-2xl text-orange-500">{formatPrice(finalTotal)}</span>
            </div>
          </div>
          <button
            onClick={onPay}
            className="w-full bg-orange-500 text-white font-black text-lg py-4 rounded-2xl active:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
          >
            Cobrar {formatPrice(finalTotal)} →
          </button>
        </div>
      )}
    </div>
  )
}

// ── Payment Modal ──────────────────────────────────────────────────────────────
function PaymentView({
  total,
  onConfirm,
  onBack,
}: {
  total:     number
  onConfirm: (method: PaymentMethod) => void
  onBack:    () => void
}) {
  const [method,    setMethod]    = useState<PaymentMethod>('efectivo')
  const [billete,   setBillete]   = useState<string>('')

  const BILLS = [20, 50, 100, 200, 500, 1000]

  const billetNum = parseFloat(billete) || 0
  const cambio    = billetNum - total
  const canConfirm = method === 'transferencia' || billetNum >= total

  function selectBill(b: number) {
    setBillete(b.toString())
  }

  function handleCustomInput(val: string) {
    // Solo números
    const clean = val.replace(/[^0-9]/g, '')
    setBillete(clean)
  }

  // Reset billete when switching methods
  function handleMethodChange(m: PaymentMethod) {
    setMethod(m)
    setBillete('')
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-stone-100 transition-colors">
          <X size={20} className="text-stone-500" />
        </button>
        <h2 className="font-black text-xl text-stone-900">Cobrar</h2>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

        {/* Total */}
        <div className="text-center">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Total a cobrar</p>
          <p className="text-5xl font-black text-orange-500">{formatPrice(total)}</p>
        </div>

        {/* Método */}
        <div className="grid grid-cols-2 gap-3">
          {([
            { value: 'efectivo'      as const, label: 'Efectivo',      icon: Banknote   },
            { value: 'transferencia' as const, label: 'Transferencia', icon: Smartphone },
          ]).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleMethodChange(value)}
              className={[
                'flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all active:scale-[0.97]',
                method === value
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-stone-200 bg-white hover:border-orange-200',
              ].join(' ')}
            >
              <div className={[
                'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                method === value ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-400',
              ].join(' ')}>
                <Icon size={20} />
              </div>
              <span className={`text-sm font-bold ${method === value ? 'text-orange-600' : 'text-stone-600'}`}>
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Calculadora de cambio — solo efectivo */}
        {method === 'efectivo' && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">¿Con cuánto paga?</p>

            {/* Billetes rápidos */}
            <div className="grid grid-cols-3 gap-2">
              {BILLS.map((b) => (
                <button
                  key={b}
                  onClick={() => selectBill(b)}
                  className={[
                    'py-3 rounded-xl text-sm font-black border-2 transition-all active:scale-95',
                    billete === b.toString()
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : b >= total
                        ? 'border-stone-200 bg-white text-stone-900 hover:border-stone-400'
                        : 'border-stone-100 bg-stone-50 text-stone-300 cursor-default',
                  ].join(' ')}
                  disabled={b < total}
                >
                  ${b}
                </button>
              ))}
            </div>

            {/* Input manual */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">$</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Otra cantidad..."
                value={billete}
                onChange={(e) => handleCustomInput(e.target.value)}
                className="w-full pl-8 pr-4 py-3.5 rounded-xl border-2 border-stone-200 text-sm font-bold focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>

            {/* Cambio */}
            {billetNum > 0 && (
              <div className={[
                'rounded-2xl px-5 py-4 text-center transition-all',
                cambio >= 0 ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200',
              ].join(' ')}>
                {cambio >= 0 ? (
                  <>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Cambio</p>
                    <p className="text-4xl font-black text-green-600 mt-1">{formatPrice(cambio)}</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-red-500 uppercase tracking-wide">Falta</p>
                    <p className="text-3xl font-black text-red-500 mt-1">{formatPrice(Math.abs(cambio))}</p>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Transferencia — instrucción */}
        {method === 'transferencia' && (
          <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl px-5 py-4 text-center">
            <p className="text-2xl mb-1">📱</p>
            <p className="text-sm font-bold text-blue-700">Confirma el pago antes de dar el producto</p>
            <p className="text-xs text-blue-500 mt-0.5">CoDi · SPEI · Depósito</p>
          </div>
        )}
      </div>

      {/* Botón confirmar */}
      <div className="flex-shrink-0 px-5 pb-6 pt-3 border-t border-stone-100">
        <button
          onClick={() => onConfirm(method)}
          disabled={!canConfirm}
          className={[
            'w-full font-black text-lg py-4 rounded-2xl transition-colors shadow-lg',
            canConfirm
              ? 'bg-stone-900 text-white active:bg-stone-800'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none',
          ].join(' ')}
        >
          {canConfirm ? '✓ Confirmar cobro' : 'Ingresa el billete'}
        </button>
      </div>
    </div>
  )
}

// ── Success Screen ─────────────────────────────────────────────────────────────
function SuccessView({
  sale,
  onNewSale,
  onLogout,
}: {
  sale:      POSSaleRecord
  onNewSale: () => void
  onLogout:  () => void
}) {
  const shortName = (name: string) =>
    name.replace(' Deshidratado', '').replace(' Deshidratada', '').replace(' 50g', '')

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Mini top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100 bg-white flex-shrink-0">
        <p className="font-black text-stone-900 text-sm">Fruta del Pacífico · POS</p>
        <button onClick={onLogout} className="p-2 rounded-xl bg-stone-100 text-stone-500">
          <LogOut size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center gap-6 px-6 py-10 text-center">
        {/* Check icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-lg shadow-green-100">
          <Check size={48} className="text-green-500" strokeWidth={3} />
        </div>

        <div>
          <h2 className="text-3xl font-black text-stone-900">¡Listo!</h2>
          <p className="text-stone-500 mt-1">
            {sale.paymentMethod === 'efectivo' ? '💵 Efectivo' : '📱 Transferencia'}
          </p>
        </div>

        {/* Sale summary */}
        <div className="bg-stone-50 rounded-2xl p-5 w-full max-w-sm space-y-2 text-sm">
          {sale.items.map((item) => (
            <div key={item.productId} className="flex justify-between text-stone-600">
              <span>{item.quantity}× {shortName(item.productName)}</span>
              <span className="font-medium">{formatPrice(item.subtotal)}</span>
            </div>
          ))}

          {sale.discount > 0 && (
            <div className="flex justify-between text-green-600 font-semibold border-t border-stone-200 pt-2">
              <span>🎉 Descuento 3×2</span>
              <span>−{formatPrice(sale.discount)}</span>
            </div>
          )}

          <div className="flex justify-between items-baseline border-t border-stone-200 pt-2">
            <span className="font-black text-xl text-stone-900">Total</span>
            <span className="font-black text-2xl text-orange-500">{formatPrice(sale.total)}</span>
          </div>

          {sale.commission > 0 && (
            <div className="flex justify-between text-green-700 font-bold bg-green-50 rounded-xl px-3 py-2 mt-1">
              <span>Tu comisión (15%)</span>
              <span>{formatPrice(sale.commission)}</span>
            </div>
          )}
        </div>

        <button
          onClick={onNewSale}
          className="w-full max-w-sm bg-orange-500 text-white font-black text-lg py-4 rounded-2xl active:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
        >
          + Nueva venta
        </button>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function POSPage() {
  const [mounted,   setMounted]   = useState(false)
  const [screen,    setScreen]    = useState<Screen>('pin')
  const [lastSale,  setLastSale]  = useState<POSSaleRecord | null>(null)

  const { currentUser, logout, getCartTotal, getCartSavings, cartItems, recordSale } = usePOS()

  useEffect(() => { setMounted(true) }, [])

  // Restore screen state when already logged in
  useEffect(() => {
    if (!mounted) return
    setScreen(currentUser ? 'pos' : 'pin')
  }, [mounted, currentUser])

  function handleLogout() {
    logout()
    setScreen('pin')
    setLastSale(null)
  }

  async function handleConfirmPayment(method: PaymentMethod) {
    const sale = recordSale(method)
    if (!sale) return
    setLastSale(sale)
    savePOSSale(sale).catch(() => {}) // background save, non-blocking
    setScreen('success')
  }

  function handleNewSale() {
    setScreen('pos')
    setLastSale(null)
  }

  const savings    = mounted ? getCartSavings() : 0
  const total      = mounted ? getCartTotal()   : 0
  const finalTotal = total - savings
  const itemCount  = mounted ? cartItems.reduce((a, i) => a + i.quantity, 0) : 0

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-[200] bg-stone-50 flex flex-col overflow-hidden">

      {/* ── PIN ─────────────────────────────────────────────────────────────── */}
      {screen === 'pin' && (
        <PinScreen onSuccess={() => setScreen('pos')} />
      )}

      {/* ── POS ─────────────────────────────────────────────────────────────── */}
      {screen === 'pos' && (
        <>
          <TopBar onLogout={handleLogout} />

          {/* Product grid */}
          <div className="flex-1 overflow-y-auto">
            <ProductGrid />
          </div>

          {/* Bottom bar */}
          <div className="bg-white border-t border-stone-100 px-4 py-4 flex-shrink-0">
            {itemCount === 0 ? (
              <p className="text-center text-stone-400 text-sm py-1 font-medium">
                Toca un producto para agregarlo
              </p>
            ) : (
              <button
                onClick={() => setScreen('cart')}
                className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl flex items-center justify-between px-5 active:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
              >
                <span className="bg-white/25 rounded-xl px-3 py-1 text-sm font-black">
                  {itemCount}
                </span>
                <span className="text-base">Ver carrito</span>
                <span className="text-base">{formatPrice(finalTotal)}</span>
              </button>
            )}
          </div>
        </>
      )}

      {/* ── CART ────────────────────────────────────────────────────────────── */}
      {screen === 'cart' && (
        <>
          <TopBar onLogout={handleLogout} />
          <CartView
            onPay={() => setScreen('payment')}
            onClose={() => setScreen('pos')}
          />
        </>
      )}

      {/* ── PAYMENT ─────────────────────────────────────────────────────────── */}
      {screen === 'payment' && (
        <>
          <TopBar onLogout={handleLogout} />
          <PaymentView
            total={finalTotal}
            onConfirm={handleConfirmPayment}
            onBack={() => setScreen('cart')}
          />
        </>
      )}

      {/* ── SUCCESS ─────────────────────────────────────────────────────────── */}
      {screen === 'success' && lastSale && (
        <SuccessView
          sale={lastSale}
          onNewSale={handleNewSale}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}
