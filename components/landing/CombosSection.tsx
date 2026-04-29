import { combos } from '@/lib/data'
import ComboCard from '@/components/ui/ComboCard'

export default function CombosSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-orange-500 font-bold text-sm uppercase tracking-widest">⚡ Más por menos</span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 mt-2">Combos que te convienen</h2>
          <p className="text-stone-500 text-lg mt-3 max-w-xl mx-auto">
            Arma tu pack y ahorra hasta 20%. Pensados para los que ya saben que van a querer más.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {combos.map((combo, i) => (
            <ComboCard key={combo.id} combo={combo} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
