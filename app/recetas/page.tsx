import { Metadata } from 'next'
import Link from 'next/link'
import { recipes } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Recetas — Fruta del Pacífico',
  description: 'Cocteles, aguas frescas, yogurt bowls y más. Descubre cómo usar la fruta deshidratada más allá del snack.',
}

const categoryLabels = {
  snack: '🥣 Snack',
  bebida: '🥤 Bebida',
  coctel: '🍹 Coctel',
  platillo: '🍽️ Platillo',
}

export default function RecetasPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-14 px-4 sm:px-6 text-center">
        <span className="text-amber-100 font-bold text-sm uppercase tracking-widest">✨ Más que un snack</span>
        <h1 className="text-4xl sm:text-5xl font-black mt-2 mb-3">Recetas</h1>
        <p className="text-amber-100 text-lg max-w-lg mx-auto">
          Cocteles, aguas, bowls y más. La fruta deshidratada eleva cualquier cosa que prepares.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recetas/${recipe.slug}`}
              className="group bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex gap-0"
            >
              <div className="w-32 sm:w-40 bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center text-6xl flex-shrink-0">
                {recipe.emoji}
              </div>
              <div className="p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                    {categoryLabels[recipe.category]}
                  </span>
                  <span className="text-xs text-stone-400">{recipe.prepTime} · {recipe.difficulty}</span>
                </div>
                <h3 className="font-bold text-stone-900 text-lg leading-snug group-hover:text-orange-500 transition-colors">
                  {recipe.title}
                </h3>
                <p className="text-stone-500 text-sm line-clamp-2">{recipe.description}</p>
                <p className="text-orange-500 text-sm font-semibold mt-auto">Ver receta →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
