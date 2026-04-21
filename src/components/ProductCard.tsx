"use client"

import { Product } from '@/lib/supabase'
import { useCart } from './CartContext'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  return (
    <div className="group flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-4 rounded-none">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=Sin+Imagen'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">Sin Fotografía</div>
        )}
        
        {/* Hover overlay with button */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <button
            onClick={() => addItem(product)}
            disabled={product.stock <= 0}
            className={`w-full py-3 text-xs tracking-widest uppercase font-semibold transition-transform transform translate-y-4 group-hover:translate-y-0 duration-300 ${
              product.stock <= 0 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-white hover:bg-black text-black hover:text-white'
            }`}
          >
            {product.stock <= 0 ? 'Sin stock' : 'Agregar'}
          </button>
        </div>

        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.stock <= 0 && (
            <span className="text-[10px] uppercase tracking-widest font-bold text-white bg-black px-2 py-1">
              Agotado
            </span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="text-[10px] uppercase tracking-widest font-bold text-black bg-white/90 backdrop-blur px-2 py-1 border border-black/10">
              Poco Stock
            </span>
          )}
        </div>
      </div>

      {/* Info Content */}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-black text-sm pr-4 line-clamp-1">
            {product.name}
          </h3>
          <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
            ₡{product.price.toLocaleString()}
          </span>
        </div>
        
        <p className="text-gray-400 text-xs mb-2">{product.category}</p>

        {product.description && (
          <p className="text-gray-500 text-xs line-clamp-2 mt-auto font-light leading-relaxed">
            {product.description}
          </p>
        )}
      </div>
    </div>
  )
}
