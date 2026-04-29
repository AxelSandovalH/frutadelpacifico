'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/store/useCart'
import { getShippingMessage, FREE_SHIPPING_THRESHOLD, getShippingProgress } from '@/lib/utils'

export default function FreeShippingBar() {
  const [mounted, setMounted] = useState(false)
  const total = useCart((s) => s.getTotal())

  useEffect(() => { setMounted(true) }, [])

  const reached = mounted && total >= FREE_SHIPPING_THRESHOLD
  const progress = mounted ? getShippingProgress(total) : 0

  return (
    <div className={`text-center py-2 px-4 text-xs font-medium transition-colors ${reached ? 'bg-green-500 text-white' : 'bg-stone-900 text-white'}`}>
      {mounted ? getShippingMessage(total) : 'Te faltan $350 para envío gratis'}
      {!reached && (
        <div className="w-48 h-1 bg-white/20 rounded-full mx-auto mt-1 overflow-hidden">
          <div
            className="h-full bg-orange-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
