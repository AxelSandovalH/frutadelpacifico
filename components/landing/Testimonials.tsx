import { testimonials } from '@/lib/data'
import StarRating from '@/components/ui/StarRating'

const AVATAR_GRADIENTS = [
  'from-orange-400 to-red-500',
  'from-green-500 to-emerald-600',
  'from-blue-500 to-indigo-600',
  'from-amber-400 to-orange-500',
  'from-rose-500 to-pink-600',
  'from-teal-500 to-cyan-600',
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-orange-100 text-orange-600 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            Lo que dicen nuestros clientes
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900">
            +500 personas ya son fans 🧡
          </h2>
          <p className="text-stone-500 mt-3 text-lg">No te lo decimos nosotros. Te lo dicen ellos.</p>
        </div>

        {/* Grid de testimoniales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
            >
              {/* Comilla decorativa */}
              <div className="flex items-start justify-between">
                <StarRating rating={t.rating} size="md" />
                <span className="text-4xl leading-none text-orange-200 font-serif select-none">"</span>
              </div>

              {/* Texto */}
              <p className="text-stone-600 text-sm leading-relaxed flex-1 italic">
                {t.text}
              </p>

              {/* Producto referenciado */}
              <div className="bg-orange-50 border border-orange-100 rounded-lg px-3 py-1.5 inline-self">
                <p className="text-[11px] text-orange-500 font-semibold">Compró: {t.product}</p>
              </div>

              {/* Avatar + nombre */}
              <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-stone-900 text-sm leading-tight">{t.name}</p>
                  <p className="text-xs text-stone-400">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA inferior */}
        <div className="mt-12 text-center">
          <p className="text-stone-500 text-sm">
            ¿Ya eres fan?{' '}
            <a
              href="https://wa.me/523122265985"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 font-bold hover:underline"
            >
              Cuéntanos tu experiencia por WhatsApp →
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
