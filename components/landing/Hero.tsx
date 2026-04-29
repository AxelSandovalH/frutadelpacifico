'use client'

import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Hero() {
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden">

      {/* Foto de fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/pina-hero.jpg"
          alt="Piña deshidratada Fruta del Pacífico"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* Overlay oscuro en mobile para garantizar contraste */}
        <div className="absolute inset-0 bg-black/30 md:bg-black/10" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-10 items-center">

        {/* Copy en tarjeta glassmorphic — mayor opacidad y sombra para contraste */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-7 sm:p-10 shadow-2xl shadow-black/20 border border-white/60">

          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold px-4 py-2 rounded-full mb-6">
            🌿 100% Natural · Sin conservadores · Sin culpa
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 leading-[1.1] tracking-tight">
            Antójate <br />
            <span className="text-orange-500">de lo natural</span>&nbsp;🌴
          </h1>

          <p className="mt-5 text-base sm:text-lg text-stone-600 leading-relaxed max-w-lg">
            Fruta deshidratada con sabor <strong className="text-stone-800">brutal</strong>.
            Piña, kiwi, mix enchilado y más — sin conservadores, pura fruta del Pacífico.
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-5">
            {['🍃 Sin conservadores', '⚡ Energía natural', '🌶️ Mix enchilado', '🌴 Manzanillo MX'].map((tag) => (
              <span
                key={tag}
                className="bg-stone-100 text-stone-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-200"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link href="/catalogo" className="w-full sm:w-auto">
              <Button size="xl" variant="primary" fullWidth>Ver productos 🛍️</Button>
            </Link>
            <Link href="/combos" className="w-full sm:w-auto">
              <Button size="xl" variant="outline" fullWidth>Ver combos ⚡</Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-2">
              {['MG', 'SL', 'RA', 'KP'].map((initials, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: ['#f97316', '#16a34a', '#d4940a', '#ea580c'][i] }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-sm text-stone-600">
              ⭐⭐⭐⭐⭐{' '}
              <span className="font-bold text-stone-800">+500 clientes felices</span>
            </p>
          </div>
        </div>

        {/* Foto circular — solo desktop */}
        <div className="hidden md:flex justify-end">
          <div className="relative w-[400px] h-[400px] lg:w-[440px] lg:h-[440px]">
            {/* Anillo decorativo */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-orange-400/30 to-green-500/20 blur-xl" />

            <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl ring-4 ring-white/70 ring-offset-4 ring-offset-transparent">
              <Image
                src="/images/pina.jpg"
                alt="Piña deshidratada premium"
                fill
                className="object-cover object-center scale-110"
                priority
              />
            </div>

            {/* Floating card — kiwi */}
            <div
              className="absolute -top-3 -left-8 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3"
              style={{ animation: 'bounceSoft 2.8s ease-in-out infinite' }}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden relative flex-shrink-0 bg-amber-50">
                <Image src="/images/kiwi.jpg" alt="Kiwi" fill className="object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900 leading-none">Kiwi Natural</p>
                <p className="text-sm text-orange-500 font-black mt-0.5">$75 MXN</p>
              </div>
            </div>

            {/* Floating card — mix */}
            <div
              className="absolute -bottom-3 -right-8 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3"
              style={{ animation: 'bounceSoft 3.2s ease-in-out infinite 0.6s' }}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden relative flex-shrink-0 bg-red-50">
                <Image src="/images/mango.jpg" alt="Mix enchilado" fill className="object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900 leading-none">Mix Enchilado</p>
                <p className="text-sm text-green-600 font-black mt-0.5">$50 MXN</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Indicador de scroll — visual hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-1">
        <div className="w-5 h-8 rounded-full border-2 border-white/60 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-white/80 rounded-full" style={{ animation: 'bounceSoft 1.8s ease-in-out infinite' }} />
        </div>
      </div>
    </section>
  )
}
