import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2025-03-31.basil' as any,
})

export async function POST(req: NextRequest) {
  try {
    const { amount, customerName } = (await req.json()) as {
      amount:       number
      customerName: string
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Monto inválido' }, { status: 400 })
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe no configurado' }, { status: 500 })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount:      Math.round(amount * 100), // centavos MXN
      currency:    'mxn',
      automatic_payment_methods: { enabled: true },
      description: 'Pedido — Fruta del Pacífico',
      metadata: {
        customer_name: customerName ?? '',
        source:        'website',
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
