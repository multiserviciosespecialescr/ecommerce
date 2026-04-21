"use client"

import { Product } from '@/lib/supabase'
import { useCart } from '@/components/CartContext'
import { MessageCircle, ShoppingBag } from 'lucide-react'

export function ProductClientRenderer({ product }: { product: Product }) {
  const { addItem } = useCart()

  const handleInterested = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
    if (!phoneNumber) return alert('Número de WhatsApp no configurado')

    const message = encodeURIComponent(`Hola, estoy interesado en este artículo:\n*${product.name}*\nPrecio: ₡${product.price.toLocaleString()}\n\n¿Me pueden dar más información?`)
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
      
      {/* Columna Izquierda: Imagen */}
      <div className="w-full lg:w-1/2">
        <div className="relative aspect-[4/5] bg-gray-50 flex items-center justify-center p-8">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x1000?text=Sin+Imagen'
              }}
            />
          ) : (
            <span className="text-gray-400">Sin Fotografía</span>
          )}
          {product.stock <= 0 && (
            <div className="absolute top-6 left-6 text-xs uppercase tracking-widest font-bold text-white bg-black px-4 py-2">
              Agotado
            </div>
          )}
        </div>
      </div>

      {/* Columna Derecha: Detalles */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center">
        <div className="mb-2">
          <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            {product.category}
          </span>
        </div>
        
        <h1 className="text-3xl lg:text-5xl font-bold text-black tracking-tight mb-6">
          {product.name}
        </h1>
        
        <div className="text-2xl font-medium text-black mb-10">
          ₡{product.price.toLocaleString()}
        </div>
        
        {product.description && (
          <div className="mb-10">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-4 border-b border-gray-200 pb-2">Descripción del Producto</h3>
            <p className="text-gray-500 font-light leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        )}

        <div className="mb-10 flex text-sm">
          <span className="w-32 text-gray-400 font-medium">Disponibilidad</span>
          <span className={`font-semibold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
            {product.stock <= 0 ? 'Sin unidades en inventario' : `${product.stock} unidades disponibles`}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
          <button
            onClick={() => addItem(product)}
            disabled={product.stock <= 0}
            className={`flex-1 py-4 text-xs tracking-widest uppercase font-semibold transition-colors flex items-center justify-center gap-3 ${
              product.stock <= 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {product.stock <= 0 ? 'Sin stock' : 'Agregar a la cesta'}
          </button>
          
          <button
            onClick={handleInterested}
            className="flex-1 py-4 text-xs tracking-widest uppercase font-semibold transition-colors bg-white border border-gray-200 text-black hover:border-black flex items-center justify-center gap-3"
          >
            <MessageCircle className="w-4 h-4" />
            Vía WhatsApp
          </button>
        </div>
      </div>

    </div>
  )
}
