"use client"

import { Product } from '@/lib/supabase'
import { useCart } from './CartContext'
import { MessageCircle, ShoppingBag } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isCartOpen } = useCart()

  const handleInterested = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
    if (!phoneNumber) return alert('Número de WhatsApp no configurado')

    const message = encodeURIComponent(`Hola, estoy interesado en el producto:\n*${product.name}*\nPrecio: ₡${product.price.toLocaleString()}\n\n¿Tienen disponibilidad?`)
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 transform hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center p-4">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Sin+Imagen'
            }}
          />
        ) : (
          <div className="text-gray-300">Sin Imagen</div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2.5 py-1 rounded-md text-gray-700 shadow-sm">
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
            {product.description}
          </p>
        )}
        
        {!product.description && <div className="flex-1" />}

        <div className="mt-auto">
          <div className="flex justify-between items-baseline mb-4">
            <div className="text-2xl font-black text-indigo-600">
              ₡{product.price.toLocaleString()}
            </div>
            {product.stock <= 0 ? (
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                Agotado
              </span>
            ) : product.stock <= 5 ? (
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                Poco Stock
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => addItem(product)}
              disabled={product.stock <= 0}
              className={`w-full font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                product.stock <= 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {product.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>
            <button
              onClick={handleInterested}
              className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#1EBE5D] font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Estoy interesado
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
