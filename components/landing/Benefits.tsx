import Image from 'next/image'

const BENEFITS = [
  {
    icon:  '🫀',
    stat:  '+40%',
    label: 'Antioxidantes',
    desc:  'La deshidratación concentra los antioxidantes presentes en la fruta fresca.',
    color: 'from-rose-500/20 to-red-400/10',
  },
  {
    icon:  '🌾',
    stat:  '3x',
    label: 'Más fibra',
    desc:  'Al concentrar la fruta, obtienes más fibra por gramo que en la versión fresca.',
    color: 'from-amber-500/20 to-yellow-400/10',
  },
  {
    icon:  '⚡',
    stat:  '0',
    label: 'Conservadores',
    desc:  'Ninguno. Solo el proceso natural de deshidratación conserva la fruta.',
    color: 'from-sky-500/20 to-blue-400/10',
  },
  {
    icon:  '🎒',
    stat:  '100%',
    label: 'Portable',
    desc:  'No se aplasta, no mancha, no se echa a perder. El snack perfecto para llevar.',
    color: 'from-emerald-500/20 to-green-400/10',
  },
]

export default function Benefits() {
  return (
    <section id="beneficios" className="relative py-24 overflow-hidden">

      {/* Fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/kiwi.jpg"
          alt="Kiwi deshidratado fondo"
          fill
          className="object-cover object-center"
          quality={80}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header de sección */}
        <div className="text-center mb-14">
          <span className="inline-block bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            Ciencia del snack
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            ¿Por qué la fruta<br className="hidden sm:block" /> deshidratada?
          </h2>
          <p className="text-stone-300 text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            No es solo antojo. Hay razones de peso para elegir este snack.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BENEFITS.map(({ icon, stat, label, desc, color }) => (
            <div
              key={label}
              className={`relative bg-gradient-to-br ${color} border border-white/15 rounded-2xl p-7 hover:border-white/30 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 text-white backdrop-blur-sm group overflow-hidden`}
            >
              {/* Glow decorativo */}
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-300" />

              <div className="text-4xl mb-4 relative z-10">{icon}</div>
              <div className="text-4xl font-black text-amber-300 leading-none relative z-10">{stat}</div>
              <div className="font-bold text-white text-lg mt-1 mb-3 relative z-10">{label}</div>
              <p className="text-stone-300 text-sm leading-relaxed relative z-10">{desc}</p>
            </div>
          ))}
        </div>

        {/* Callout inferior */}
        <div className="mt-14 bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center">
          <p className="text-white text-lg sm:text-xl font-semibold leading-relaxed">
            La fruta fresca se echa a perder en días.{' '}
            <strong className="text-amber-300">La deshidratada te espera hasta 12 meses.</strong>
          </p>
          <p className="text-stone-400 text-sm mt-3">
            Sin refrigeración · Sin conservadores · Sin dejar de saber brutal
          </p>
        </div>
      </div>
    </section>
  )
}
