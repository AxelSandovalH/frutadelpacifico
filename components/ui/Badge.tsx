import { cn } from '@/lib/utils'

type BadgeVariant = 'popular' | 'nuevo' | 'recomendado' | 'enchilado' | 'oferta' | 'ahorro'

interface BadgeProps {
  variant: BadgeVariant
  className?: string
}

const configs: Record<BadgeVariant, { label: string; className: string }> = {
  popular:     { label: '🔥 Popular',      className: 'bg-red-500 text-white' },
  nuevo:       { label: '✨ Nuevo',         className: 'bg-blue-500 text-white' },
  recomendado: { label: '⭐ Recomendado',   className: 'bg-amber-500 text-white' },
  enchilado:   { label: '🌶️ Enchilado',    className: 'bg-red-600 text-white' },
  oferta:      { label: '🏷️ Oferta',       className: 'bg-green-500 text-white' },
  ahorro:      { label: '💰 Ahorro',        className: 'bg-emerald-500 text-white' },
}

export default function Badge({ variant, className }: BadgeProps) {
  const { label, className: variantClass } = configs[variant]
  return (
    <span
      className={cn(
        'inline-block px-2 py-0.5 text-xs font-bold rounded-full uppercase tracking-wide',
        variantClass,
        className
      )}
    >
      {label}
    </span>
  )
}
