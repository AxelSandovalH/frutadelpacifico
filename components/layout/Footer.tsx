import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🌴</span>
            <div>
              <span className="font-black text-white">Fruta del </span>
              <span className="font-black text-orange-400">Pacífico</span>
            </div>
          </div>
          <p className="text-stone-400 text-sm leading-relaxed">
            Antójate de lo natural. Fruta deshidratada 100% pura, sin conservadores, con sabor intenso.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="https://www.instagram.com/frutadelpacifico/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-stone-400 hover:text-orange-400 transition-colors font-bold text-sm">IG</a>
            <a href="https://www.facebook.com/share/1KmsuSgELb/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-stone-400 hover:text-orange-400 transition-colors font-bold text-sm">FB</a>
            <a href="mailto:hola@frutadelpacifico.mx" aria-label="Email" className="text-stone-400 hover:text-orange-400 transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Productos */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider text-stone-300 mb-4">Productos</h4>
          <ul className="space-y-2 text-sm text-stone-400">
            {[
              ['Cítricos', '/catalogo?cat=citricos'],
              ['Tropicales', '/catalogo?cat=tropicales'],
              ['Mix Enchilado', '/catalogo?cat=mix-enchilado'],
              ['Combos', '/combos'],
              ['Best Sellers', '/catalogo?tag=popular'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-orange-400 transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Explora */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider text-stone-300 mb-4">Explora</h4>
          <ul className="space-y-2 text-sm text-stone-400">
            {[
              ['Recetas', '/recetas'],
              ['Blog', '/blog'],
              ['Beneficios', '/#beneficios'],
              ['¿Por qué elegirnos?', '/#por-que'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-orange-400 transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider text-stone-300 mb-4">Pedidos</h4>
          <p className="text-sm text-stone-400 mb-3">¿Preguntas? Escríbenos directo.</p>
          <a
            href="https://wa.me/523122265985"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#20b858] transition-colors"
          >
            💬 WhatsApp
          </a>
          <p className="text-xs text-stone-500 mt-4">Lunes – Sábado, 9am – 7pm</p>
        </div>
      </div>

      <div className="border-t border-stone-800 px-4 sm:px-6 py-5 text-center">
        <p className="text-xs text-stone-500">
          © {new Date().getFullYear()} Fruta del Pacífico · Hecho con 🧡 en México · Todos los derechos reservados
        </p>
      </div>
    </footer>
  )
}
