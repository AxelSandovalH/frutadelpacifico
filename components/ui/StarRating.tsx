import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md'
  className?: string
}

export default function StarRating({ rating, reviewCount, size = 'sm', className }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1)
  const iconSize = size === 'sm' ? 12 : 16

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {stars.map((star) => (
        <Star
          key={star}
          size={iconSize}
          className={star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}
        />
      ))}
      {reviewCount !== undefined && (
        <span className="text-xs text-stone-500 ml-1">({reviewCount})</span>
      )}
    </div>
  )
}
