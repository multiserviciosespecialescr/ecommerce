import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/CartContext'
import { CartDrawer } from '@/components/CartDrawer'
import { Navbar } from '@/components/Navbar'
import { GlobalAction } from '@/components/GlobalAction'

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'] })

export const metadata: Metadata = {
  title: 'Estilos Creativos — Productos Personalizados',
  description: 'Tazas, camisas, botellas, llaveros, platos y artículos de decoración personalizados. Haz tu pedido por WhatsApp.',
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${outfit.className} bg-gray-50 min-h-screen flex flex-col pt-0`}>
        <CartProvider>
          <Navbar />
          <main className="flex-1 flex flex-col w-full">
            {children}
          </main>
          <CartDrawer />
          <GlobalAction />
        </CartProvider>
      </body>
    </html>
  )
}
