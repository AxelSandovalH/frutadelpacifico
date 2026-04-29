import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { recipes, getProductById } from '@/lib/data'
import ProductCard from '@/components/ui/ProductCard'
import { Clock, ChevronLeft } from 'lucide-react'
import { Product } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const recipe = recipes.find((r) => r.slug === slug)
  if (!recipe) return {}
  return { title: `${recipe.title} — Fruta del Pacífico`, description: recipe.description }
}

export default async function RecetaPage({ params }: Props) {
  const { slug } = await params
  const recipe = recipes.find((r) => r.slug === slug)
  if (!recipe) notFound()

  const usedProducts = recipe.products
    .map((id) => getProductById(id))
    .filter(Boolean) as Product[]

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          href="/recetas"
          className="flex items-center gap-1 text-sm text-stone-400 hover:text-orange-500 mb-6 transition-colors"
        >
          <ChevronLeft size={16} /> Recetas
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 mb-8 text-center border border-orange-100">
          <div className="text-8xl mb-4">{recipe.emoji}</div>
          <span className="text-xs font-bold bg-orange-100 text-orange-600 px-3 py-1 rounded-full uppercase">
            {recipe.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mt-4 mb-3">{recipe.title}</h1>
          <p className="text-stone-600 text-lg">{recipe.description}</p>
          <div className="flex items-center justify-center gap-4 mt-5 text-sm text-stone-500">
            <span className="flex items-center gap-1"><Clock size={15} /> {recipe.prepTime}</span>
            <span>·</span>
            <span>Dificultad: {recipe.difficulty}</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {/* Ingredients */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h2 className="font-black text-xl text-stone-900 mb-4">🛒 Ingredientes</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h2 className="font-black text-xl text-stone-900 mb-4">👨‍🍳 Preparación</h2>
            <ol className="space-y-3">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-stone-700">
                  <span className="w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Products used */}
        {usedProducts.length > 0 && (
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h2 className="font-black text-xl text-stone-900 mb-5">
              🛍️ Productos que necesitas
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {usedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
