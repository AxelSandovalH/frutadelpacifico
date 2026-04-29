'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Zap, ChevronLeft, Minus, Plus, Check } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/store/useCart'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/ui/StarRating'
import ProductCard from '@/components/ui/ProductCard'

interface ProductDetailProps {
  product: Product
  related: Product[]
}

export default function ProductDetail({ product, related }: ProductDetailProps) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)

  function handleAdd() {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const primaryTag = product.tags.find((t) => t !== 'dulce' && t !== 'enchilado') as
    | 'popular' | 'nuevo' | 'recomendado' | undefined

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-stone-400 mb-6">
          <Link href="/catalogo" className="flex items-center gap-1 hover:text-orange-500 transition-colors">
            <ChevronLeft size={16} /> Catálogo
          </Link>
          <span>/</span>
          <span className="text-stone-600">{product.name}</span>
        </div>

        {/* Main grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-14 mb-16">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden shadow-xl">
              {!imgError ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[160px] sm:text-[200px] drop-shadow-lg select-none">
                  {product.emoji}
                </div>
              )}
            </div>
            {primaryTag && (
              <div className="absolute top-4 left-4 z-10">
                <Badge variant={primaryTag} />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <Link
                href={`/catalogo?cat=${product.categorySlug}`}
                className="text-xs font-bold text-orange-500 uppercase tracking-widest hover:underline"
              >
                {product.category}
              </Link>
              <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mt-1 leading-tight">
                {product.name}
              </h1>
              <p className="text-stone-500 text-lg mt-2">{product.description}</p>
            </div>

            <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-stone-900">{formatPrice(product.price)}</span>
              <span className="text-stone-400 text-sm">{product.weight}</span>
            </div>

            {/* 3x2 nudge */}
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-medium">
              🎁 <strong>Oferta 3x2:</strong> Agrega 3 del mismo y el más barato va de regalo.
            </div>

            {/* Qty + Add */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-stone-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-3 hover:bg-stone-100 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="px-5 py-3 font-bold text-lg min-w-[3rem] text-center">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-4 py-3 hover:bg-stone-100 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleAdd}
                className="flex-1"
              >
                {added ? (
                  <><Check size={18} /> ¡Agregado!</>
                ) : (
                  <><ShoppingCart size={18} /> Agregar — {formatPrice(product.price * qty)}</>
                )}
              </Button>
            </div>

            <Link href="/checkout">
              <Button variant="whatsapp" fullWidth size="lg">
                💬 Pedir ahora por WhatsApp
              </Button>
            </Link>

            {/* Long description */}
            <div className="pt-2 border-t border-stone-100">
              <p className="text-stone-600 leading-relaxed">{product.longDescription}</p>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="font-bold text-stone-900 mb-3">✅ Beneficios</h3>
              <ul className="space-y-2">
                {product.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-stone-600">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Ingredients */}
            <div className="bg-stone-50 rounded-xl p-4">
              <h3 className="font-bold text-stone-900 mb-1 text-sm">Ingredientes</h3>
              <p className="text-sm text-stone-500">{product.ingredients}</p>
            </div>
          </div>
        </div>

        {/* Upsell: combina con */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Zap size={20} className="text-orange-500" />
              <h2 className="text-xl font-black text-stone-900">Combina perfecto con...</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
