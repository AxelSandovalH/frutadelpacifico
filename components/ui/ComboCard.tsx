'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Zap, Check } from 'lucide-react'
import { Combo } from '@/types'
import { products as allProducts } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/store/useCart'
import Button from './Button'

interface ComboCardProps {
  combo: Combo
  featured?: boolean
}

export default function ComboCard({ combo, featured }: ComboCardProps) {
  const { addItem } = useCart()
  const [added,    setAdded]    = useState(false)
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const comboProducts = combo.products
    .map(({ productId, quantity }) => ({
      product:  allProducts.find((p) => p.id === productId),
      quantity,
    }))
    .filter((p) => p.product !== undefined)

  function handleAdd() {
    comboProducts.forEach(({ product, quantity }) => {
      if (product) addItem(product, quantity)
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const savingsPercent = Math.round((combo.savings / combo.originalPrice) * 100)

  return (
    <div
      className={[
        'relative rounded-2xl border-2 overflow-hidden flex flex-col',
        'transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        featured
          ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-amber-50 shadow-md shadow-orange-200/50'
          : 'border-stone-100 bg-white hover:border-stone-200',
      ].join(' ')}
    >
      {/* Etiqueta — posicionada fuera de la imagen para evitar overlap */}
      {featured && (
        <div className="absolute top-3 left-3 z-20 bg-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
          ⭐ Más vendido
        </div>
      )}
      <div className={`absolute top-3 ${featured ? 'right-3' : 'right-3 left-auto'} z-20`}>
        {!featured && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {combo.tag}
          </span>
        )}
      </div>

      {/* Imagen */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
        {!imgLoaded && !imgError && <div className="absolute inset-0 skeleton" />}
        {!imgError ? (
          <Image
            src={combo.image}
            alt={combo.name}
            fill
            className={`object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            sizes="(max-width: 640px) 100vw, 25vw"
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgError(true); setImgLoaded(true) }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl select-none">
            {combo.emoji}
          </div>
        )}
        {/* Degradado inferior */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col gap-3 flex-1">

        {/* Título y descripción */}
        <div>
          <h3 className="font-black text-lg text-stone-900 leading-tight">{combo.name}</h3>
          <p className="text-sm text-stone-500 mt-1 leading-relaxed">{combo.description}</p>
        </div>

        {/* Lista de productos incluidos */}
        <ul className="space-y-1.5 bg-stone-50 rounded-xl p-3">
          {comboProducts.map(({ product, quantity }) => (
            <li key={product!.id} className="flex items-center gap-2 text-sm text-stone-700">
              <span className="text-base leading-none">{product!.emoji}</span>
              <span className="flex-1 truncate">
                <span className="font-medium">{quantity > 1 ? `${quantity}x ` : ''}</span>
                {product!.shortName}
              </span>
              <span className="text-stone-400 text-xs font-medium flex-shrink-0">{product!.weight}</span>
            </li>
          ))}
        </ul>

        {/* Precios */}
        <div className="flex items-end gap-2">
          <span className="text-2xl font-black text-stone-900">{formatPrice(combo.price)}</span>
          <span className="text-sm text-stone-400 line-through mb-0.5">{formatPrice(combo.originalPrice)}</span>
          <span className="ml-auto bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0">
            -{savingsPercent}% · Ahorras {formatPrice(combo.savings)}
          </span>
        </div>

        {/* CTA */}
        <Button
          variant={featured ? 'primary' : 'primary'}
          fullWidth
          onClick={handleAdd}
          className="mt-auto"
        >
          {added
            ? <><Check size={16} /> ¡Combo agregado!</>
            : <><Zap size={16} /> Agregar combo</>
          }
        </Button>
      </div>
    </div>
  )
}
