import Link from 'next/link'
import { recipes } from '@/lib/data'
import Button from '@/components/ui/Button'

export default function RecipesPreview() {
  const preview = recipes.slice(0, 3)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-orange-500 font-bold text-sm uppercase tracking-widest">✨ Más que un snack</span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 mt-1">Recetas con fruta del Pacífico</h2>
            <p className="text-stone-500 mt-2 max-w-lg">
              Cocteles, aguas frescas, yogurt bowls... La fruta deshidratada es más versátil de lo que crees.
            </p>
          </div>
          <Link href="/recetas">
            <Button variant="outline" size="md">Ver todas las recetas →</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {preview.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recetas/${recipe.slug}`}
              className="group bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-orange-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-5xl mb-4">{recipe.emoji}</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-orange-500 uppercase bg-orange-100 px-2 py-0.5 rounded-full">
                  {recipe.category}
                </span>
                <span className="text-xs text-stone-400">{recipe.prepTime}</span>
              </div>
              <h3 className="font-bold text-stone-900 text-lg leading-snug group-hover:text-orange-500 transition-colors">
                {recipe.title}
              </h3>
              <p className="text-stone-500 text-sm mt-2 line-clamp-2">{recipe.description}</p>
              <p className="text-orange-500 text-sm font-semibold mt-4">Ver receta →</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
