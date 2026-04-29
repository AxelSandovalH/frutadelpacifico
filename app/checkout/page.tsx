'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useCart } from '@/store/useCart'
import { formatPrice } from '@/lib/utils'
import { generateOrderLink } from '@/lib/whatsapp'
import { createOrder } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import { CheckoutForm } from '@/types'
import { ShoppingBag, ChevronLeft, Minus, Plus, Trash2, Check, AlertCircle, Loader2 } from 'lucide-react'

const INITIAL_FORM: CheckoutForm = {
  name:    '',
  phone:   '',
  address: '',
  colonia: '',
  city:    '',
  notes:   '',
}

type TouchedFields = Partial<Record<keyof CheckoutForm, boolean>>

function validateField(key: keyof CheckoutForm, value: string): string {
  switch (key) {
    case 'name':
      return value.trim().length < 2 ? 'Tu nombre es necesario' : ''
    case 'phone':
      return value.replace(/\D/g, '').length < 10 ? 'Ingresa un número de 10 dígitos' : ''
    case 'address':
      return value.trim().length < 5 ? 'La dirección es necesaria' : ''
    case 'city':
      return value.trim().length < 2 ? 'La ciudad es necesaria' : ''
    default:
      return ''
  }
}

const REQUIRED_FIELDS: (keyof CheckoutForm)[] = ['name', 'phone', 'address', 'city']

interface FieldProps {
  fieldKey: keyof CheckoutForm
  label:    string
  placeholder: string
  type?:    string
  value:    string
  error?:   string
  touched:  boolean
  onChange: (key: keyof CheckoutForm, value: string) => void
  onBlur:   (key: keyof CheckoutForm) => void
  required?: boolean
}

function FormField({ fieldKey, label, placeholder, type = 'text', value, error, touched, onChange, onBlur, required }: FieldProps) {
  const isValid   = touched && !error && (required ? value.trim().length > 0 : true)
  const hasError  = touched && !!error

  return (
    <div>
      <label htmlFor={fieldKey} className="block text-sm font-semibold text-stone-700 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          id={fieldKey}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          onBlur={() => onBlur(fieldKey)}
          className={[
            'w-full px-4 py-3 pr-10 rounded-xl border text-sm transition-all duration-200',
            'focus:outline-none focus:ring-2',
            hasError
              ? 'border-red-400 bg-red-50 focus:ring-red-300'
              : isValid
                ? 'border-green-400 bg-green-50/50 focus:ring-green-300'
                : 'border-stone-200 bg-stone-50 focus:bg-white focus:ring-orange-400 focus:border-orange-400',
          ].join(' ')}
          aria-describedby={hasError ? `${fieldKey}-error` : undefined}
          aria-invalid={hasError}
        />
        {/* Icono de estado */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {isValid  && <Check    size={16} className="text-green-500" />}
          {hasError && <AlertCircle size={16} className="text-red-400" />}
        </div>
      </div>
      {hasError && (
        <p id={`${fieldKey}-error`} role="alert" className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  )
}

export default function CheckoutPage() {
  const { items, getTotal, getSavings, updateQuantity, removeItem, clearCart } = useCart()
  const [form,    setForm]    = useState<CheckoutForm>(INITIAL_FORM)
  const [touched, setTouched] = useState<TouchedFields>({})
  const [loading, setLoading] = useState(false)

  const total      = getTotal()
  const savings    = getSavings()
  const finalTotal = total - savings

  // Calcula errores sobre el form actual
  const errors: Partial<CheckoutForm> = {}
  for (const key of REQUIRED_FIELDS) {
    const msg = validateField(key, form[key] ?? '')
    if (msg) errors[key] = msg
  }
  const isFormValid = Object.keys(errors).length === 0

  const handleChange = useCallback((key: keyof CheckoutForm, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    // Validar en tiempo real solo si ya fue tocado
    setTouched((t) => ({ ...t, [key]: true }))
  }, [])

  const handleBlur = useCallback((key: keyof CheckoutForm) => {
    setTouched((t) => ({ ...t, [key]: true }))
  }, [])

  async function handleOrder() {
    // Marcar todos los campos como tocados para mostrar errores
    const allTouched: TouchedFields = {}
    for (const key of REQUIRED_FIELDS) allTouched[key] = true
    setTouched(allTouched)

    if (!isFormValid) return

    setLoading(true)
    try {
      await createOrder({
        name:    form.name,
        phone:   form.phone,
        address: `${form.address}, ${form.colonia}`,
        colonia: form.colonia,
        city:    form.city,
        notes:   form.notes,
        total:   finalTotal,
        items:   items.map((i) => ({
          productId:   i.productId,
          productName: i.product.name,
          quantity:    i.quantity,
          unitPrice:   i.product.price,
        })),
      }).catch(() => {})

      const url = generateOrderLink(items, form, finalTotal)
      window.open(url, '_blank')
      clearCart()
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-4 text-center">
        <div className="text-7xl">🛒</div>
        <h2 className="text-2xl font-black text-stone-900">Tu carrito está vacío</h2>
        <p className="text-stone-500">Agrega algunos antojitos antes de ordenar.</p>
        <Link href="/catalogo">
          <Button variant="primary" size="lg">Ver productos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb */}
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-orange-500 mb-6 transition-colors"
        >
          <ChevronLeft size={16} /> Seguir comprando
        </Link>

        <h1 className="text-3xl font-black text-stone-900 mb-8 flex items-center gap-3">
          <ShoppingBag size={28} className="text-orange-500" />
          Finalizar pedido
        </h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">

          {/* ── Formulario ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sm:p-8 space-y-5">
            <h2 className="font-bold text-lg text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
              📍 Datos de entrega
            </h2>

            {([
              { key: 'name' as const,    label: 'Nombre completo',      placeholder: 'Ej: Ana García López',       type: 'text', required: true  },
              { key: 'phone' as const,   label: 'WhatsApp / Teléfono',  placeholder: 'Ej: 6141234567 (10 dígitos)', type: 'tel',  required: true  },
              { key: 'address' as const, label: 'Dirección',            placeholder: 'Calle, número, referencias', type: 'text', required: true  },
              { key: 'colonia' as const, label: 'Colonia',              placeholder: 'Ej: Centro',                 type: 'text', required: false },
              { key: 'city' as const,    label: 'Ciudad',               placeholder: 'Ej: Culiacán, Sinaloa',      type: 'text', required: true  },
            ]).map(({ key, label, placeholder, type, required }) => (
              <FormField
                key={key}
                fieldKey={key}
                label={label}
                placeholder={placeholder}
                type={type}
                value={form[key]}
                error={errors[key]}
                touched={!!touched[key]}
                onChange={handleChange}
                onBlur={handleBlur}
                required={required}
              />
            ))}

            <div>
              <label htmlFor="notes" className="block text-sm font-semibold text-stone-700 mb-1.5">
                Notas adicionales <span className="text-stone-400 font-normal">(opcional)</span>
              </label>
              <textarea
                id="notes"
                placeholder="¿Horario preferido de entrega, instrucciones especiales...?"
                value={form.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white focus:border-orange-400 transition-all duration-200 resize-none"
              />
            </div>
          </div>

          {/* ── Resumen del pedido ── */}
          <div className="space-y-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
              <h2 className="font-bold text-lg text-stone-900 mb-4 pb-3 border-b border-stone-100 flex items-center gap-2">
                🛍️ Tu pedido
              </h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="text-3xl leading-none flex-shrink-0">{item.product.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-900 leading-snug truncate">
                        {item.product.shortName}
                      </p>
                      <p className="text-xs text-stone-400">{item.product.weight}</p>
                    </div>
                    <div className="flex items-center border border-stone-200 rounded-lg text-xs">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-2 py-1.5 hover:bg-stone-100 active:bg-stone-200 transition-colors"
                        aria-label="Reducir cantidad"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="px-2.5 font-bold text-stone-900 min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-2 py-1.5 hover:bg-stone-100 active:bg-stone-200 transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-stone-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-stone-300 hover:text-red-400 active:text-red-600 mt-0.5 transition-colors"
                        aria-label={`Eliminar ${item.product.shortName}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="mt-5 pt-4 border-t border-stone-100 space-y-2.5">
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm bg-green-50 text-green-700 font-semibold rounded-lg px-3 py-2">
                    <span>🎉 Descuento 3x2</span>
                    <span>-{formatPrice(savings)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Envío</span>
                  <span className={finalTotal >= 350 ? 'text-green-600 font-semibold' : 'text-stone-500'}>
                    {finalTotal >= 350 ? '¡Gratis! 🎉' : 'A convenir'}
                  </span>
                </div>
                <div className="flex justify-between font-black text-xl pt-2 border-t border-stone-100">
                  <span className="text-stone-900">Total</span>
                  <span className="text-orange-500">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>

            {/* Botón de envío */}
            <Button
              variant="whatsapp"
              fullWidth
              size="xl"
              onClick={handleOrder}
              disabled={loading}
              className="shadow-lg shadow-green-500/25"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Preparando pedido...</>
              ) : (
                <>💬 Enviar pedido por WhatsApp</>
              )}
            </Button>

            <p className="text-xs text-stone-400 text-center px-2 leading-relaxed">
              Al hacer clic se abrirá WhatsApp con tu pedido listo.
              Nosotros confirmaremos el envío.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
