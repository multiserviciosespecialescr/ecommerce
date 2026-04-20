"use client"

import { useState, useMemo } from 'react'
import { Product } from '@/lib/supabase'
import { ProductCard } from './ProductCard'
import { PackageOpen, AlertCircle, ShoppingCart } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

interface CatalogProps {
  initialProducts: Product[]
  dbError: string | null
}

export function Catalog({ initialProducts, dbError }: CatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Todos')

  // Usar categorías fijas
  const categories = ['Todos', ...CATEGORIES]

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Todos') return initialProducts
    return initialProducts.filter(p => p.category === activeCategory)
  }, [initialProducts, activeCategory])

  if (dbError) {
    return (
      <div className="bg-red-50/50 border border-red-100 rounded-3xl p-12 text-center shadow-lg shadow-red-100/20 max-w-2xl mx-auto backdrop-blur-sm">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-red-900 mb-3 tracking-tight">Error de Conexión</h3>
        <p className="text-red-700/80 mb-6 font-medium text-lg">{dbError}</p>
        <div className="bg-white rounded-xl p-4 border border-red-100 text-sm text-red-600 text-left overflow-hidden">
          Asegúrate de haber corrido el script en el <b>SQL Editor</b> de Supabase para crear la base de datos.
        </div>
      </div>
    )
  }

  if (initialProducts.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-[2rem] p-16 text-center shadow-2xl shadow-gray-200/40 max-w-3xl mx-auto flex flex-col items-center justify-center transform transition-all hover:scale-[1.01] duration-500 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
        <div className="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mb-6 ring-8 ring-indigo-50/50">
          <PackageOpen className="w-10 h-10 text-indigo-600" />
        </div>
        <h3 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Catálogo en mantenimiento</h3>
        <p className="text-gray-500 text-lg max-w-md mx-auto font-light">
          Estamos actualizando nuestro inventario. Vuelve pronto para descubrir nuestras novedades.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Filtro de Categorías */}
      <div className="bg-white p-2 rounded-2xl shadow-lg shadow-gray-200/40 border border-gray-100 mb-8 inline-flex flex-wrap gap-2 justify-center lg:justify-start w-full lg:w-auto">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeCategory === category
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grilla de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
