import { Metadata } from 'next'
import { combos } from '@/lib/data'
import ComboCard from '@/components/ui/ComboCard'

export const metadata: Metadata = {
  title: 'Combos — Fruta del Pacífico',
  description: 'Pack energético, botanero, semanal y coctelero. Ahorra hasta 20% con nuestros combos de fruta deshidratada.',
}

export default function CombosPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white py-14 px-4 sm:px-6 text-center">
        <span className="text-orange-400 font-bold text-sm uppercase tracking-widest">⚡ Ahorra más</span>
        <h1 className="text-4xl sm:text-5xl font-black mt-2 mb-3">Nuestros Combos</h1>
        <p className="text-stone-400 text-lg max-w-lg mx-auto">
          Packs pensados para los que ya saben que van a querer más. Ahorra hasta 20% y prueba más sabores.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Value prop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { emoji: '💰', title: 'Hasta 20% de ahorro', desc: 'El combo siempre sale más barato que individual.' },
            { emoji: '🎯', title: 'Curado para ti', desc: 'Combinaciones que prueban bien juntas. Confiamos en el sabor.' },
            { emoji: '🚀', title: 'Un solo pedido', desc: 'Agrega el combo al carrito y pide todo junto por WhatsApp.' },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border border-stone-100 p-5 text-center">
              <div className="text-3xl mb-2">{emoji}</div>
              <h3 className="font-bold text-stone-900">{title}</h3>
              <p className="text-stone-500 text-sm mt-1">{desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {combos.map((combo, i) => (
            <ComboCard key={combo.id} combo={combo} featured={i === 0} />
          ))}
        </div>

        {/* Custom combo CTA */}
        <div className="mt-12 bg-orange-50 border-2 border-orange-200 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">🛠️</div>
          <h3 className="text-2xl font-black text-stone-900">¿Quieres un combo personalizado?</h3>
          <p className="text-stone-500 mt-2 mb-5 max-w-md mx-auto">
            Si quieres armar tu propio pack, escríbenos por WhatsApp y lo cotizamos juntos. Sin problema.
          </p>
          <a
            href="https://wa.me/523122265985?text=Hola!%20Quiero%20armar%20un%20combo%20personalizado%20🌴"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20b858] transition-colors"
          >
            💬 Hablar con nosotros
          </a>
        </div>
      </div>
    </div>
  )
}
