import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getProductBySlug, products, getProductById } from '@/lib/data'
import ProductDetail from '@/components/product/ProductDetail'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.name} — Fruta del Pacífico`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const related = product.pairsWith
    .map((id) => getProductById(id))
    .filter(Boolean)

  return <ProductDetail product={product} related={related as typeof products} />
}
