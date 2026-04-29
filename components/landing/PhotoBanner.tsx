import Image from 'next/image'
import Link from 'next/link'

export default function PhotoBanner() {
  return (
    <section className="relative h-80 sm:h-96 overflow-hidden flex items-center justify-center">

      {/* Foto sin gradientes */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/pina.jpg"
          alt="Piña deshidratada Fruta del Pacífico"
          fill
          className="object-cover object-center"
          quality={90}
        />
      </div>

      {/* Texto en tarjeta glass centrada */}
      <div className="relative z-10 bg-white/75 backdrop-blur-md rounded-3xl px-10 py-8 text-center shadow-2xl max-w-xl mx-4">
        <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-2">
          Cosechado · Deshidratado · Empacado en Manzanillo
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight mb-5">
          Del Pacífico a tu mesa,{' '}
          <span className="text-orange-500">sin intermediarios</span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/catalogo"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-md text-sm"
          >
            Ver catálogo
          </Link>
          <a
            href="https://wa.me/523122265985"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20b858] text-white font-bold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-md text-sm"
          >
            💬 Pedir ahora
          </a>
        </div>
      </div>
    </section>
  )
}
