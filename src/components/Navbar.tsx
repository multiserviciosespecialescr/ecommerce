"use client"

import Link from 'next/link'
import { ShoppingBag, Search } from 'lucide-react'
import { useCart } from './CartContext'

export function Navbar() {
  const { totalItems, setIsCartOpen } = useCart()

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-xl border-b border-gray-200/50 supports-[backdrop-filter]:bg-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transform transition-transform group-hover:scale-105 group-hover:rotate-3">
              <span className="text-white font-extrabold text-xl leading-none">V</span>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
              Ventas
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <Link 
              href="/productos" 
              className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors tracking-wide"
            >
              Catálogo
            </Link>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all flex items-center justify-center group"
            >
              <ShoppingBag className="w-6 h-6 transition-transform group-hover:scale-110" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-indigo-600 rounded-full border-2 border-white translate-x-1/4 -translate-y-1/4 shadow-sm">
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
