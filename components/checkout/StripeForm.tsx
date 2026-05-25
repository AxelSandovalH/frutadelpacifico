'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Loader2, ShieldCheck } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface Props {
  total:     number
  onSuccess: () => void
  onError:   (msg: string) => void
}

export function StripeForm({ total, onSuccess, onError }: Props) {
  const stripe   = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [err,     setErr]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setErr('')

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout?paid=true`,
      },
      redirect: 'if_required', // solo redirige si es necesario (3DS)
    })

    if (error) {
      const msg = error.message ?? 'Error procesando el pago'
      setErr(msg)
      onError(msg)
      setLoading(false)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: 'tabs',
          fields: { billingDetails: { name: 'never', email: 'never' } },
        }}
      />

      {err && (
        <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2.5 flex items-start gap-2">
          <span className="mt-0.5 flex-shrink-0">⚠️</span> {err}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={[
          'w-full py-4 rounded-xl font-black text-base transition-all',
          !stripe || loading
            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
            : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98] shadow-lg shadow-orange-200',
        ].join(' ')}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={18} className="animate-spin" />
            Procesando…
          </span>
        ) : (
          `💳 Pagar ${formatPrice(total)}`
        )}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-stone-400">
        <ShieldCheck size={13} className="text-green-500" />
        Pago seguro con cifrado SSL — powered by Stripe
      </p>
    </form>
  )
}
