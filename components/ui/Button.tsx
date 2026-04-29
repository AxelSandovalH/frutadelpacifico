import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // variants
          variant === 'primary' &&
            'bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98] shadow-md hover:shadow-lg',
          variant === 'secondary' &&
            'bg-amber-400 text-stone-900 hover:bg-amber-500 active:scale-[0.98] shadow-md',
          variant === 'outline' &&
            'border-2 border-orange-500 text-orange-500 hover:bg-orange-50 active:scale-[0.98]',
          variant === 'ghost' &&
            'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
          variant === 'whatsapp' &&
            'bg-[#25D366] text-white hover:bg-[#20b858] active:scale-[0.98] shadow-md hover:shadow-lg',
          // sizes
          size === 'sm' && 'px-3 py-1.5 text-sm',
          size === 'md' && 'px-5 py-2.5 text-sm',
          size === 'lg' && 'px-6 py-3 text-base',
          size === 'xl' && 'px-8 py-4 text-lg',
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
