import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
  }).format(price)
}

export function calcSavings(original: number, sale: number): number {
  return original - sale
}

export function calcSavingsPercent(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100)
}

export const FREE_SHIPPING_THRESHOLD = 350
export const WHATSAPP_NUMBER = '523122265985'

export function getShippingProgress(total: number): number {
  return Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)
}

export function getShippingMessage(total: number): string {
  const remaining = FREE_SHIPPING_THRESHOLD - total
  if (total >= FREE_SHIPPING_THRESHOLD) return '🎉 ¡Tienes envío gratis!'
  return `Te faltan ${formatPrice(remaining)} para envío gratis`
}
