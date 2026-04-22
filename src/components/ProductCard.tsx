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
    <div className="group flex flex-col h-full bg-white border border-[#dde8f8] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-[#007bff]/10 hover:-translate-y-1 transition-all duration-300">
      
      {/* Image Container */}
      <Link href={`/productos/${product.id}`} className="relative block overflow-hidden aspect-[4/3] bg-[#f8faff]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Sin+Imagen' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">Sin Fotografía</div>
        )}

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.stock <= 0 && (
            <span className="text-[10px] uppercase tracking-widest font-bold text-white bg-red-500 px-3 py-1 rounded-full">
              Agotado
            </span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#007bff] bg-[#e8f3ff] px-3 py-1 rounded-full">
              Poco Stock
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">
        <p className="text-[11px] text-[#007bff] font-semibold uppercase tracking-widest mb-1">{product.category}</p>

        <Link href={`/productos/${product.id}`} className="font-bold text-[#1a1a2e] text-sm mb-1 line-clamp-2 hover:text-[#007bff] transition-colors">
          {product.name}
        </Link>

        {product.description && (
          <p className="text-gray-400 text-xs line-clamp-2 font-light leading-relaxed mb-2">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-[#f0f5ff]">
          <p className="text-[#1a1a2e] font-extrabold text-lg mb-3">₡{product.price.toLocaleString()}</p>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => addItem(product)}
              disabled={product.stock <= 0}
              className={`w-full py-3 text-xs tracking-wider uppercase font-bold rounded-xl transition-all ${
                product.stock <= 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'text-white hover:brightness-110 shadow-sm'
              }`}
              style={product.stock > 0 ? { backgroundColor: '#007bff' } : {}}
            >
              {product.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>

            <button
              onClick={handleInterested}
              className="w-full py-3 text-xs tracking-wider uppercase font-bold rounded-xl border-2 transition-all hover:bg-[#e8f3ff] flex items-center justify-center gap-2"
              style={{ borderColor: '#007bff', color: '#007bff' }}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Pedir por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
