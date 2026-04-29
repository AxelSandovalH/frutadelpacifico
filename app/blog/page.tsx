import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog — Fruta del Pacífico',
  description: 'Guías, beneficios y todo lo que necesitas saber sobre la fruta deshidratada.',
}

const POSTS = [
  {
    slug: 'beneficios-fruta-deshidratada',
    emoji: '🌿',
    category: 'Salud',
    title: '7 beneficios de comer fruta deshidratada que probablemente no conocías',
    excerpt:
      'La fruta deshidratada no es solo un snack conveniente. Tiene propiedades que la hacen superior en muchos aspectos a la fruta fresca. Te contamos todo.',
    readTime: '4 min',
    date: 'Abril 2025',
  },
  {
    slug: 'fruta-deshidratada-vs-snacks-procesados',
    emoji: '🥊',
    category: 'Nutrición',
    title: 'Fruta deshidratada vs. snacks procesados: una comparación honesta',
    excerpt:
      'Chips, gomitas, chocolates... Analizamos el duelo nutricional y el impacto real en tu energía y salud.',
    readTime: '5 min',
    date: 'Marzo 2025',
  },
  {
    slug: 'como-usar-fruta-deshidratada-en-cocteles',
    emoji: '🍹',
    category: 'Estilo de vida',
    title: 'Cómo usar fruta deshidratada para elevar tus cocteles y aguas',
    excerpt:
      'No solo es decorativo. La fruta deshidratada libera su sabor lentamente en el líquido, creando una experiencia que no consigues con fruta fresca.',
    readTime: '3 min',
    date: 'Febrero 2025',
  },
  {
    slug: 'snack-inteligente-que-es',
    emoji: '🧠',
    category: 'Snacking inteligente',
    title: '¿Qué es el "snacking inteligente" y por qué importa?',
    excerpt:
      'El snacking no es el problema. El problema es qué comemos cuando nos da hambre entre comidas. Hablemos de elegir bien.',
    readTime: '4 min',
    date: 'Enero 2025',
  },
]

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="space-y-6">
          {POSTS.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-2xl border border-stone-100 p-6 sm:p-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-start gap-5">
                <div className="text-5xl hidden sm:block">{post.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-stone-400">{post.date} · {post.readTime} de lectura</span>
                  </div>
                  <h2 className="font-black text-xl text-stone-900 leading-snug mb-2">
                    {post.title}
                  </h2>
                  <p className="text-stone-500 text-sm leading-relaxed">{post.excerpt}</p>
                  <p className="text-orange-500 font-semibold text-sm mt-4 cursor-pointer hover:underline">
                    Leer artículo completo →
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-black mb-2">📩 Recibe contenido exclusivo</h3>
          <p className="text-orange-100 mb-5">Recetas nuevas, ofertas y tips de salud. Sin spam, solo lo bueno.</p>
          <a
            href="https://wa.me/523122265985?text=Quiero%20recibir%20contenido%20exclusivo%20de%20Fruta%20del%20Pac%C3%ADfico%20🌴"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-orange-500 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors"
          >
            💬 Unirme por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
