'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Plus, Check } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/store/useCart'
import Badge from './Badge'
import StarRating from './StarRating'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded]       = useState(false)
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const primaryTag = product.tags.find(
    (t) => t !== 'dulce' && t !== 'enchilado'
  ) as 'popular' | 'nuevo' | 'recomendado' | undefined

  return (
    <Link
      href={`/producto/${product.slug}`}
      className={[
        'group relative bg-white rounded-2xl border border-stone-100 overflow-hidden',
        'hover:shadow-xl hover:-translate-y-1 hover:border-stone-200',
        'active:scale-[0.98] transition-all duration-300 flex flex-col',
        'touch-manipulation',
        className ?? '',
      ].join(' ')}
    >
      {/* Imagen */}
      <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">

        {/* Skeleton mientras carga */}
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 skeleton" />
        )}

        {!imgError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={[
              'object-cover transition-all duration-500',
              imgLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0',
            ].join(' ')}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgError(true); setImgLoaded(true) }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-7xl select-none">
            {product.emoji}
          </div>
        )}

        {/* Gradiente inferior sutil */}
        {!imgError && imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {primaryTag && <Badge variant={primaryTag} />}
          {product.tags.includes('enchilado') && <Badge variant="enchilado" />}
        </div>

        {/* Quick-add — visible on hover (desktop) y en tap (mobile vía active) */}
        <button
          onClick={handleAdd}
          aria-label={`Agregar ${product.name} al carrito`}
          className={[
            'absolute bottom-3 right-3 z-10 p-2.5 rounded-full shadow-lg',
            'border-2 transition-all duration-200',
            'md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0',
            added
              ? 'bg-green-500 border-green-500 text-white scale-110'
              : 'bg-white border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white active:scale-90',
          ].join(' ')}
        >
          {added ? <Check size={16} /> : <Plus size={16} />}
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <div>
          <p className="text-[11px] text-orange-500 font-bold uppercase tracking-wider">
            {product.category}
          </p>
          <h3 className="font-bold text-stone-900 text-sm leading-snug mt-0.5">
            {product.name}
          </h3>
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-stone-50">
          <div>
            <span className="text-lg font-black text-stone-900">{formatPrice(product.price)}</span>
            <span className="text-xs text-stone-400 ml-1 font-medium">{product.weight}</span>
          </div>
          <button
            onClick={handleAdd}
            aria-label={`Agregar ${product.name} al carrito`}
            className={[
              'flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 active:scale-95',
              added
                ? 'bg-green-500 text-white'
                : 'bg-orange-500 text-white hover:bg-orange-600',
            ].join(' ')}
          >
            {added ? (
              <><Check size={13} /> Listo</>
            ) : (
              <><ShoppingCart size={13} /> Agregar</>
            )}
          </button>
        </div>
      </div>
    </Link>
  )
}
