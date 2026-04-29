'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/store/useCart'
import { formatPrice, getShippingMessage, FREE_SHIPPING_THRESHOLD, getShippingProgress } from '@/lib/utils'
import Button from '@/components/ui/Button'

function CartImage({ src, alt, emoji }: { src: string; alt: string; emoji: string }) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-3xl select-none">
        {emoji}
      </div>
    )
  }

  return (
    <>
      {!loaded && <div className="absolute inset-0 skeleton rounded-xl" />}
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        sizes="64px"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </>
  )
}

export default function CartSidebar() {
  const [open, setOpen] = useState(false)
  const { items, removeItem, updateQuantity, getTotal, getItemCount, getSavings } = useCart()

  const total    = getTotal()
  const savings  = getSavings()
  const finalTotal = total - savings
  const progress = getShippingProgress(finalTotal)

  useEffect(() => {
    const toggle = () => setOpen((prev) => !prev)
    document.addEventListener('toggle-cart', toggle)
    return () => document.removeEventListener('toggle-cart', toggle)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Bloquear scroll del body cuando el sidebar está abierto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop con fade */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-orange-500" />
            <h2 className="font-bold text-stone-900">
              Mi carrito{' '}
              {getItemCount() > 0 && (
                <span className="text-orange-500">({getItemCount()})</span>
              )}
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-xl hover:bg-stone-100 active:bg-stone-200 transition-colors"
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {/* Barra de envío gratis */}
        <div className="px-5 py-3 bg-stone-50 border-b border-stone-100">
          <p className="text-xs text-stone-600 text-center mb-2">{getShippingMessage(finalTotal)}</p>
          <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: progress >= 100
                  ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                  : 'linear-gradient(90deg, #f97316, #fbbf24)',
              }}
            />
          </div>
          {progress < 100 && (
            <p className="text-[10px] text-stone-400 text-right mt-1">
              Gratis a partir de {formatPrice(FREE_SHIPPING_THRESHOLD)}
            </p>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-10">
              <div className="text-7xl">🛒</div>
              <div>
                <p className="text-stone-700 font-bold">Tu carrito está vacío</p>
                <p className="text-sm text-stone-400 mt-1">¡Agrega algunos antojitos naturales!</p>
              </div>
              <Link href="/catalogo" onClick={() => setOpen(false)}>
                <Button variant="primary">
                  Ver productos <ArrowRight size={14} className="inline ml-1" />
                </Button>
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex gap-3 group/item">
                {/* Thumbnail con skeleton */}
                <div className="relative w-16 h-16 rounded-xl bg-amber-50 overflow-hidden flex-shrink-0">
                  <CartImage
                    src={item.product.image}
                    alt={item.product.shortName}
                    emoji={item.product.emoji}
                  />
                </div>

                {/* Detalles */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-stone-900 leading-snug truncate">
                    {item.product.shortName}
                  </p>
                  <p className="text-xs text-stone-400">{item.product.weight}</p>
                  <p className="font-bold text-orange-500 text-sm mt-1">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>

                {/* Controles */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-stone-300 hover:text-red-400 active:text-red-600 transition-colors opacity-0 group-hover/item:opacity-100 focus-visible:opacity-100"
                    aria-label={`Eliminar ${item.product.shortName}`}
                  >
                    <Trash2 size={15} />
                  </button>
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden text-sm">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-2 py-1.5 hover:bg-stone-100 active:bg-stone-200 transition-colors"
                      aria-label="Reducir cantidad"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-2.5 font-bold text-stone-900 min-w-[28px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-2 py-1.5 hover:bg-stone-100 active:bg-stone-200 transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer — solo si hay items */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-stone-100 space-y-3 bg-gradient-to-b from-white to-stone-50">
            {savings > 0 && (
              <div className="flex justify-between items-center text-sm bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                <span className="text-green-700 font-semibold">🎉 Descuento 3x2</span>
                <span className="text-green-700 font-bold">-{formatPrice(savings)}</span>
              </div>
            )}

            <div className="flex justify-between items-center font-black text-xl">
              <span className="text-stone-900">Total</span>
              <span className="text-orange-500">{formatPrice(finalTotal)}</span>
            </div>

            <Link href="/checkout" onClick={() => setOpen(false)} className="block">
              <Button variant="whatsapp" fullWidth size="lg">
                💬 Pedir por WhatsApp
              </Button>
            </Link>

            <Link href="/catalogo" onClick={() => setOpen(false)} className="block">
              <button className="w-full py-2.5 text-sm font-semibold text-stone-500 hover:text-stone-700 transition-colors text-center rounded-xl hover:bg-stone-100 active:bg-stone-200">
                + Seguir comprando
              </button>
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
