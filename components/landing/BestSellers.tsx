import Link from 'next/link'
import { getBestSellers } from '@/lib/data'
import ProductCard from '@/components/ui/ProductCard'
import Button from '@/components/ui/Button'

export default function BestSellers() {
  const bestsellers = getBestSellers()

  return (
    <section className="py-20 bg-gradient-to-b from-stone-50 to-orange-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 border border-red-100 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
              🔥 Los más pedidos
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight">
              Best Sellers
            </h2>
            <p className="text-stone-500 mt-2">Los favoritos de nuestra comunidad. Nunca fallan.</p>
          </div>
          <Link href="/catalogo" className="flex-shrink-0">
            <Button variant="outline" size="md">Ver catálogo completo →</Button>
          </Link>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Promo strip 3x2 */}
        <div className="mt-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg shadow-orange-500/20">
          <div>
            <p className="font-black text-xl sm:text-2xl">🎁 3x2 en cítricos</p>
            <p className="text-orange-100 text-sm mt-1.5 max-w-sm">
              Compra 3 y el más barato es gratis. ¡Se aplica automáticamente!
            </p>
          </div>
          <Link href="/catalogo?cat=citricos" className="flex-shrink-0">
            <Button variant="secondary" size="lg">Aprovechar oferta</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
