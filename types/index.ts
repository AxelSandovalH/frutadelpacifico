export interface Category {
  id: string
  name: string
  slug: string
  description: string
}

export interface Product {
  id: string
  slug: string
  name: string
  shortName: string
  description: string
  longDescription: string
  price: number
  comparePrice?: number
  weight: string
  category: string
  categorySlug: string
  tags: ('nuevo' | 'popular' | 'recomendado' | 'enchilado' | 'dulce')[]
  ingredients: string
  benefits: string[]
  image: string
  images: string[]
  inStock: boolean
  rating: number
  reviewCount: number
  emoji: string
  pairsWith: string[]
}

export interface Combo {
  id: string
  slug: string
  name: string
  description: string
  products: { productId: string; quantity: number }[]
  price: number
  originalPrice: number
  savings: number
  savingsPercent: number
  image: string
  emoji: string
  tag: string
}

export interface CartItem {
  productId: string
  product: Product
  quantity: number
  isCombo?: boolean
  comboId?: string
}

export interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
  getSavings: () => number
}

export interface CheckoutForm {
  name: string
  phone: string
  address: string
  colonia: string
  city: string
  notes: string
}

export interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  text: string
  product: string
  avatar: string
}

export interface Recipe {
  id: string
  slug: string
  title: string
  description: string
  prepTime: string
  difficulty: 'Fácil' | 'Media' | 'Difícil'
  ingredients: string[]
  steps: string[]
  image: string
  emoji: string
  category: 'snack' | 'bebida' | 'coctel' | 'platillo'
  products: string[]
}
