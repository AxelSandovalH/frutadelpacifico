import Image from 'next/image'

const REASONS = [
  {
    emoji: '🌿',
    title: '100% Natural',
    desc:  'Sin conservadores, sin colorantes, sin nada raro. Solo fruta y punto.',
    bg:    'hover:bg-green-50 hover:border-green-200',
  },
  {
    emoji: '⚡',
    title: 'Energía real',
    desc:  'Azúcares naturales que te dan energía sin el crash de los ultraprocesados.',
    bg:    'hover:bg-amber-50 hover:border-amber-200',
  },
  {
    emoji: '🎯',
    title: 'Snack inteligente',
    desc:  'Más fibra, más vitaminas, menos calorías vacías. Comer rico sin arrepentirte.',
    bg:    'hover:bg-blue-50 hover:border-blue-200',
  },
  {
    emoji: '🌶️',
    title: 'Sabor intenso',
    desc:  'Deshidratamos para concentrar el sabor al máximo. Una rebanada y ya lo entenderás.',
    bg:    'hover:bg-red-50 hover:border-red-200',
  },
  {
    emoji: '📦',
    title: 'Frescura garantizada',
    desc:  'Producción por lotes pequeños. Siempre fresca, siempre con su sabor en el punto.',
    bg:    'hover:bg-orange-50 hover:border-orange-200',
  },
  {
    emoji: '🤝',
    title: 'Trato directo',
    desc:  'Pedidos por WhatsApp, respuesta rápida. Sin apps, sin burocracia. Así como debe ser.',
    bg:    'hover:bg-teal-50 hover:border-teal-200',
  },
]

export default function WhyUs() {
  return (
    <section id="por-que" className="bg-white overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[640px]">

        {/* Imagen lateral */}
        <div className="relative h-72 lg:h-auto order-2 lg:order-1">
          <Image
            src="/images/mango.jpg"
            alt="Mango deshidratado Fruta del Pacífico"
            fill
            className="object-cover object-center"
            quality={90}
          />
          {/* Overlay fusión derecha */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/70 hidden lg:block" />
          {/* Gradiente inferior móvil */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent lg:hidden" />

          {/* Badge precio */}
          <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md rounded-2xl px-5 py-4 shadow-xl border border-stone-100">
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Desde</p>
            <p className="text-3xl font-black text-orange-500 leading-none mt-0.5">$50</p>
            <p className="text-xs text-stone-500 mt-1 font-medium">MXN por bolsa de 50g</p>
          </div>
        </div>

        {/* Contenido */}
        <div className="order-1 lg:order-2 py-14 px-6 sm:px-10 lg:px-14 flex flex-col justify-center">
          <span className="inline-block text-orange-500 font-bold text-xs uppercase tracking-widest mb-3">
            ¿Por qué elegirnos?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight">
            No somos solo<br />fruta deshidratada.
          </h2>
          <p className="text-stone-500 text-lg mt-3 mb-10 leading-relaxed">
            Somos tu snack de confianza: natural, honesto, con sabor de verdad.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REASONS.map(({ emoji, title, desc, bg }) => (
              <div
                key={title}
                className={`flex gap-3.5 p-4 rounded-2xl border border-stone-100 ${bg} transition-all duration-250 hover:shadow-sm hover:-translate-y-0.5 cursor-default`}
              >
                <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg flex-shrink-0">
                  {emoji}
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm leading-tight">{title}</h3>
                  <p className="text-stone-500 text-xs mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
