"use client"

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from './CartContext'

export function Navbar() {
  const { totalItems, setIsCartOpen } = useCart()

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center transition-transform group-hover:scale-95">
              <span className="text-white font-medium text-sm leading-none">V</span>
            </div>
            <span className="font-semibold text-xl tracking-tight text-gray-900">
              Ventas
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-8">
            <Link 
              href="/productos" 
              className="hidden sm:block text-sm font-medium text-gray-500 hover:text-black transition-colors"
            >
              Catálogo
            </Link>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-900 transition-all flex items-center justify-center group"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-105 stroke-[1.5px]" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-black rounded-full shadow-sm">
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
