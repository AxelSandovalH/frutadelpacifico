'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '@/store/useCart'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/combos',   label: 'Combos'   },
  { href: '/recetas',  label: 'Recetas'  },
  { href: '/blog',     label: 'Blog'     },
]

export default function Header() {
  const itemCount   = useCart((s) => s.getItemCount())
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white/96 backdrop-blur-md border-b border-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center focus-visible:outline-orange-500" aria-label="Inicio">
          <Image
            src="/logo.png"
            alt="Fruta del Pacífico"
            width={220}
            height={80}
            className="h-14 w-auto object-contain"
            style={{ mixBlendMode: 'multiply' }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5" aria-label="Navegación principal">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative px-4 py-2 rounded-lg text-sm font-semibold text-stone-600 hover:text-[#1a5c2e] hover:bg-green-50 transition-all duration-150 group"
            >
              {label}
              {/* Underline animado */}
              <span className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-[#1a5c2e] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
            </Link>
          ))}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-1.5">

          {/* WhatsApp — solo desktop */}
          <a
            href="https://wa.me/523122265985"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 bg-[#25D366] text-white text-xs font-bold px-3.5 py-2.5 rounded-xl hover:bg-[#1ebe5d] active:scale-95 transition-all duration-150"
          >
            💬 WhatsApp
          </a>

          {/* Carrito */}
          <button
            onClick={() => document.dispatchEvent(new CustomEvent('toggle-cart'))}
            className="relative p-2.5 rounded-xl hover:bg-amber-50 active:scale-95 transition-all duration-150"
            aria-label={`Abrir carrito${itemCount > 0 ? ` (${itemCount} productos)` : ''}`}
          >
            <ShoppingCart size={22} className="text-stone-700" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#d4940a] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center leading-none">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2.5 rounded-xl hover:bg-stone-100 active:scale-95 transition-all duration-150"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {/* Animación suave entre Menu y X */}
            <span className="relative w-[22px] h-[22px] flex items-center justify-center">
              <Menu
                size={22}
                className={cn('absolute transition-all duration-200', open ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100')}
              />
              <X
                size={22}
                className={cn('absolute transition-all duration-200', open ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75')}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile nav — desplegable con animación */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out bg-white border-t border-stone-100',
          open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <nav className="flex flex-col px-4 py-3 gap-0.5" aria-label="Navegación móvil">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="py-3 px-4 rounded-xl text-sm font-semibold text-stone-700 hover:bg-green-50 hover:text-[#1a5c2e] active:bg-green-100 transition-colors"
            >
              {label}
            </Link>
          ))}
          <a
            href="https://wa.me/523122265985"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-2 py-3 px-4 rounded-xl text-sm font-bold bg-[#25D366] text-white text-center hover:bg-[#1ebe5d] active:bg-[#19a851] transition-colors"
          >
            💬 Pedir por WhatsApp
          </a>
        </nav>
      </div>
    </header>
  )
}
