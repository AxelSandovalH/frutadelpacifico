import React from 'react'

const ITEMS = [
  { emoji: '🍋', label: 'Limón Deshidratado' },
  { emoji: '🍊', label: 'Naranja Natural'     },
  { emoji: '🍍', label: 'Piña Tropical'       },
  { emoji: '🍓', label: 'Fresa Premium'       },
  { emoji: '🌶️', label: 'Mix Enchilado'       },
  { emoji: '🥝', label: 'Kiwi Natural'        },
  { emoji: '🍈', label: 'Guayaba Mexicana'    },
  { emoji: '🍊', label: 'Toronja Fresca'      },
  { emoji: '✨', label: '100% Natural'         },
  { emoji: '🌿', label: 'Sin Conservadores'   },
  { emoji: '⚡', label: 'Energía Natural'     },
  { emoji: '🎯', label: 'Snack Inteligente'   },
  { emoji: '🌴', label: 'Manzanillo · MX'    },
  { emoji: '💚', label: 'Sin Aditivos'        },
]

const TRACK = [...ITEMS, ...ITEMS, ...ITEMS]

export default function FruitMarquee() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#153d1f] via-[#1a5c2e] to-[#153d1f] py-3 border-y-4 border-[#d4940a]">

      {/* Fades en los bordes */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#153d1f] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#153d1f] to-transparent z-10 pointer-events-none" />

      {/* Track animado */}
      <div className="flex animate-marquee whitespace-nowrap will-change-transform">
        {TRACK.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 mx-5 flex-shrink-0"
          >
            <span className="text-xl leading-none" role="img" aria-hidden="true">{item.emoji}</span>
            {/* Texto en blanco puro — máximo contraste sobre verde oscuro */}
            <span className="text-white font-bold text-sm uppercase tracking-widest">
              {item.label}
            </span>
            {/* Separador dorado */}
            <span className="text-[#d4940a] text-xl mx-1 font-light">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
