"use client"

import { Product } from '@/lib/supabase'
import { useCart } from './CartContext'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const handleInterested = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
    if (!phoneNumber) return alert('Número de WhatsApp no configurado')

    const message = encodeURIComponent(`Hola, estoy interesado en este artículo:\n*${product.name}*\nPrecio: ₡${product.price.toLocaleString()}\n\n¿Me pueden dar más información?`)
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  return (
    <div className="group flex flex-col h-full border border-transparent hover:border-gray-100 p-2 lg:p-4 transition-all duration-300">
      {/* Image Container */}
      <Link href={`/productos/${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-gray-50 mb-4 rounded-none block">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=Sin+Imagen'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">Sin Fotografía</div>
        )}
        
        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.stock <= 0 && (
            <span className="text-[10px] uppercase tracking-widest font-bold text-white bg-black px-3 py-1">
              Agotado
            </span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="text-[10px] uppercase tracking-widest font-bold text-black bg-white/90 backdrop-blur px-3 py-1 border border-black/10">
              Poco Stock
            </span>
          )}
        </div>
      </Link>

      {/* Info Content */}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/productos/${product.id}`} className="font-medium text-black text-sm pr-4 line-clamp-2 hover:underline">
            {product.name}
          </Link>
          <span className="text-sm text-black font-semibold whitespace-nowrap">
            ₡{product.price.toLocaleString()}
          </span>
        </div>
        
        <p className="text-gray-400 text-xs mb-3">{product.category}</p>

        {product.description && (
          <p className="text-gray-500 text-xs line-clamp-2 font-light leading-relaxed mb-4">
            {product.description}
          </p>
        )}
        
        {/* Push buttons to bottom */}
        <div className="mt-auto pt-4 flex flex-col gap-2">
          <button
            onClick={() => addItem(product)}
            disabled={product.stock <= 0}
            className={`w-full py-3.5 text-xs tracking-widest uppercase font-semibold transition-colors rounded-none ${
              product.stock <= 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {product.stock <= 0 ? 'Sin stock' : 'Agregar'}
          </button>
          
          <button
            onClick={handleInterested}
            className="w-full py-3.5 text-xs tracking-widest uppercase font-semibold transition-colors bg-white border border-gray-200 text-black hover:border-black rounded-none flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Consulta
          </button>
        </div>
      </div>
    </div>
  )
}
