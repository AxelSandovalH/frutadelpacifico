import { CartItem } from '@/types'
import { formatPrice, WHATSAPP_NUMBER } from '@/lib/utils'

export interface OrderFormData {
  name: string
  phone: string
  address: string
  colonia: string
  city: string
  notes: string
}

export function buildWhatsAppMessage(items: CartItem[], form: OrderFormData, total: number): string {
  const itemLines = items
    .map((item) => `  • ${item.quantity}x ${item.product.shortName} ${item.product.weight} — ${formatPrice(item.product.price * item.quantity)}`)
    .join('\n')

  const address = [form.address, form.colonia, form.city].filter(Boolean).join(', ')

  const message = [
    `¡Hola! Quiero hacer un pedido de Fruta del Pacífico.`,
    ``,
    `*Mi pedido:*`,
    itemLines,
    ``,
    `*Total: ${formatPrice(total)}*`,
    ``,
    `*Datos de entrega:*`,
    `Nombre: ${form.name}`,
    `Telefono: ${form.phone}`,
    `Direccion: ${address}`,
    form.notes ? `Notas: ${form.notes}` : null,
    ``,
    `Gracias.`,
  ]
    .filter((line) => line !== null)
    .join('\n')

  return message
}

export function buildWhatsAppURL(message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}

export function generateOrderLink(items: CartItem[], form: OrderFormData, total: number): string {
  const message = buildWhatsAppMessage(items, form, total)
  return buildWhatsAppURL(message)
}
