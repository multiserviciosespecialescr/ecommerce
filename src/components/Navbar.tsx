"use client"

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from './CartContext'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const { totalItems, setIsCartOpen } = useCart()
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) return null

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-[#dde8f8] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.png" 
              alt="Lo Buscamos Logo" 
              className="h-11 w-auto object-contain rounded-xl transition-transform group-hover:scale-105 border border-gray-100 shadow-sm"
            />
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-lg tracking-tighter text-gray-900 leading-tight lowercase">
                lobuscamos.com
              </span>
              <span className="text-[9px] text-gray-400 font-bold tracking-widest uppercase leading-none mt-0.5">
                TODO LO QUE BUSCAS, EN UN SOLO LUGAR
              </span>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-8">
            <Link 
              href="/productos" 
              className="hidden sm:block text-sm font-semibold text-gray-500 hover:text-[#007bff] transition-colors"
            >
              Catálogo
            </Link>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-900 transition-all flex items-center justify-center group"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-105 stroke-[1.5px]" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white rounded-full shadow-sm" style={{ backgroundColor: '#007bff' }}>
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
