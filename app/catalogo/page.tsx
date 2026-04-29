'use client'

import { useState, useMemo } from 'react'
import { products, categories } from '@/lib/data'
import ProductCard from '@/components/ui/ProductCard'
import { Search } from 'lucide-react'

type FilterTag = 'todos' | 'dulce' | 'enchilado' | 'popular' | 'nuevo' | 'recomendado'
type CategorySlug = 'todos' | 'citricos' | 'tropicales' | 'mix-enchilado'

export default function CatalogoPage() {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<FilterTag>('todos')
  const [activeCategory, setActiveCategory] = useState<CategorySlug>('todos')

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      const matchTag = activeTag === 'todos' || p.tags.includes(activeTag as never)
      const matchCat = activeCategory === 'todos' || p.categorySlug === activeCategory
      return matchSearch && matchTag && matchCat
    })
  }, [search, activeTag, activeCategory])

  const tagFilters: { value: FilterTag; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'dulce', label: '🍭 Dulce' },
    { value: 'enchilado', label: '🌶️ Enchilado' },
    { value: 'popular', label: '🔥 Popular' },
    { value: 'nuevo', label: '✨ Nuevo' },
    { value: 'recomendado', label: '⭐ Recomendado' },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-black mb-3">Nuestro Catálogo 🌴</h1>
          <p className="text-orange-100 text-lg max-w-lg mx-auto">
            Fruta deshidratada 100% natural. Sin conservadores, con sabor intenso.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Busca tu fruta favorita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Category filters */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory('todos')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeCategory === 'todos'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-orange-300'
              }`}
            >
              Todas las categorías
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug as CategorySlug)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeCategory === cat.slug
                    ? 'bg-stone-900 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-orange-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tag filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {tagFilters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveTag(value)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeTag === value
                  ? 'bg-orange-500 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-orange-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-stone-400 mb-6">
          {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'} encontrados
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-stone-500 font-medium">No encontramos eso, pero sigue buscando.</p>
          </div>
        )}

        {/* 3x2 promo banner */}
        <div className="mt-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white text-center">
          <h3 className="font-black text-2xl mb-1">🎁 Oferta 3x2</h3>
          <p className="text-orange-100">
            Compra 3 productos del mismo tipo y el más barato va de regalo. ¡Se aplica automáticamente!
          </p>
        </div>
      </div>
    </div>
  )
}
