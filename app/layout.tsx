import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartSidebar from '@/components/layout/CartSidebar'
import FreeShippingBar from '@/components/layout/FreeShippingBar'
import FruitMarquee from '@/components/layout/FruitMarquee'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fruta del Pacífico — Snacks naturales con sabor intenso',
  description:
    'Fruta deshidratada 100% natural, sin conservadores. Snacks premium con sabor intenso: limón, naranja, piña, fresa, mix enchilado y más. Envíos a toda México.',
  keywords: 'fruta deshidratada, snacks saludables, sin conservadores, mix enchilado, México',
  openGraph: {
    title: 'Fruta del Pacífico — Antójate de lo natural',
    description: 'Snacks 100% naturales con sabor intenso. Sin conservadores, sin culpa.',
    siteName: 'Fruta del Pacífico',
    locale: 'es_MX',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-stone-900">
        <FreeShippingBar />
        <Header />
        <FruitMarquee />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartSidebar />
      </body>
    </html>
  )
}
