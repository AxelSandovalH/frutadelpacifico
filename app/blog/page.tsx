import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog — Fruta del Pacífico',
  description: 'Guías, beneficios y todo lo que necesitas saber sobre la fruta deshidratada.',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white py-14 px-4 sm:px-6 text-center">
        <span className="text-stone-400 font-bold text-sm uppercase tracking-widest">Conocimiento</span>
        <h1 className="text-4xl sm:text-5xl font-black mt-2 mb-3">Blog</h1>
        <p className="text-stone-400 text-lg max-w-lg mx-auto">
          Aprende a comer mejor, snackear con cabeza y vivir con más energía.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="text-6xl mb-6">✍️</div>
        <h2 className="text-2xl font-black text-stone-900 mb-3">Próximamente</h2>
        <p className="text-stone-500 max-w-md mx-auto">
          Estamos preparando contenido sobre fruta deshidratada, recetas y tips de vida saludable. Vuelve pronto.
        </p>
      </div>
    </div>
  )
}
