import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/CartContext'
import { CartDrawer } from '@/components/CartDrawer'
import { Navbar } from '@/components/Navbar'
import { GlobalAction } from '@/components/GlobalAction'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lo Buscamos - Catálogo',
  description: 'Catálogo de productos con integración a WhatsApp',
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
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col pt-0`}>
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
