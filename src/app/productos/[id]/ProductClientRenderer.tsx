"use client"

import { Product } from '@/lib/supabase'
import { useCart } from '@/components/CartContext'
import { MessageCircle, ShoppingBag } from 'lucide-react'
import { useState } from 'react'

export function ProductClientRenderer({ product }: { product: Product }) {
  const { addItem } = useCart()
  const displayImages = product.images && product.images.length > 0 ? product.images : (product.image_url ? [product.image_url] : [])
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const handleInterested = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
    if (!phoneNumber) return alert('Número de WhatsApp no configurado')

    const message = encodeURIComponent(`Hola, estoy interesado en este artículo:\n*${product.name}*\nPrecio: ₡${product.price.toLocaleString()}\n\n¿Me pueden dar más información?`)
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
      
      {/* Columna Izquierda: Galería de Imágenes */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {/* Imagen Principal */}
        <div className="relative aspect-[4/5] bg-gray-50 flex items-center justify-center border border-gray-100">
          {displayImages[activeImageIndex] ? (
            <img 
              src={displayImages[activeImageIndex]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-opacity duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x1000?text=Sin+Imagen'
              }}
            />
          ) : (
            <span className="text-gray-400">Sin Fotografía</span>
          )}
          {product.stock <= 0 && (
            <div className="absolute top-6 left-6 text-[10px] uppercase tracking-widest font-bold text-white bg-black px-4 py-2">
              Agotado
            </div>
          )}
        </div>
        
        {/* Grilla de Miniaturas */}
        {displayImages.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {displayImages.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative flex-shrink-0 w-24 aspect-[4/5] bg-gray-50 border snap-center transition-all ${
                  idx === activeImageIndex ? 'border-black' : 'border-transparent hover:border-gray-200'
                }`}
              >
                <img src={img} alt={`Vista ${idx + 1}`} className={`w-full h-full object-cover ${idx !== activeImageIndex ? 'opacity-60 hover:opacity-100' : ''}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Columna Derecha: Detalles */}
      <div className="w-full lg:w-1/2 flex flex-col justify-start pt-4 lg:pt-10">
        <div className="mb-2">
          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            {product.category}
          </span>
        </div>
        
        <h1 className="text-3xl lg:text-5xl font-bold text-black tracking-tighter mb-4 leading-none">
          {product.name}
        </h1>
        
        <div className="text-xl lg:text-2xl font-semibold text-black mb-10">
          ₡{product.price.toLocaleString()}
        </div>
        
        {product.description && (
          <div className="mb-12">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">Descripción del Producto</h3>
            <p className="text-gray-600 text-sm font-light leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        )}

        <div className="mb-12 flex items-center text-sm border border-gray-100 p-4">
          <span className="w-32 text-gray-400 font-bold text-[10px] uppercase tracking-widest">Disponibilidad</span>
          <span className={`font-semibold text-xs tracking-widest uppercase ${product.stock > 10 ? 'text-black' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
            {product.stock <= 0 ? 'Sin inventario' : `${product.stock} unidades en almacén`}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-auto border-t border-gray-100 pt-8">
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
            {product.stock <= 0 ? 'Agotado' : 'Añadir a la Bolsa'}
          </button>
          
          <button
            onClick={handleInterested}
            className="flex-1 py-4 text-xs tracking-widest uppercase font-semibold transition-all flex items-center justify-center gap-3 text-white hover:brightness-110"
            style={{ backgroundColor: '#007bff' }}
          >
            <MessageCircle className="w-4 h-4" />
            Pedir o Consultar
          </button>
        </div>
      </div>

    </div>
  )
}
