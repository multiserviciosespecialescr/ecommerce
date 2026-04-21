"use client"

import { useState, useMemo } from 'react'
import { Product } from '@/lib/supabase'
import { ProductCard } from './ProductCard'
import { Search, Filter, AlertCircle } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

interface CatalogProps {
  initialProducts: Product[]
  dbError: string | null
}

export function Catalog({ initialProducts, dbError }: CatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Todos')
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  const categories = ['Todos', ...CATEGORIES]

  const maxPossiblePrice = useMemo(() => {
    return initialProducts.length > 0 ? Math.max(...initialProducts.map(p => p.price)) : 100000
  }, [initialProducts])

  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number | null>(null)
  const currentMaxPrice = selectedMaxPrice !== null ? selectedMaxPrice : maxPossiblePrice

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      const matchCategory = activeCategory === 'Todos' || p.category === activeCategory
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.description?.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchPrice = p.price <= currentMaxPrice
      
      return matchCategory && matchSearch && matchPrice
    })
  }, [initialProducts, activeCategory, searchQuery, currentMaxPrice])

  if (dbError) {
    return (
      <div className="border border-red-200 bg-red-50 p-8 text-center max-w-xl mx-auto">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4 stroke-[1.5px]" />
        <h3 className="text-lg font-medium text-red-900 mb-2">Error de conexión</h3>
        <p className="text-red-700 text-sm mb-4">{dbError}</p>
      </div>
    )
  }

  if (initialProducts.length === 0) {
    return (
      <div className="py-32 text-center flex flex-col items-center justify-center">
        <h3 className="text-3xl font-bold text-black mb-4 tracking-tight">Catálogo vacío</h3>
        <p className="text-gray-500 text-sm font-light">
          No hay artículos listados en este momento. Vuelve más tarde.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Filtros Minimalistas */}
      <div className="flex flex-col lg:flex-row gap-6 items-end mb-12 border-b border-gray-100 pb-8">
        
        {/* Buscador */}
        <div className="w-full lg:w-1/3">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Buscar</label>
          <div className="relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 stroke-[2px]" />
            <input 
              type="text" 
              placeholder="Ej. Zapatos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-0 py-2 border-0 border-b border-gray-200 bg-transparent focus:ring-0 focus:border-black outline-none transition-colors text-sm rounded-none"
            />
          </div>
        </div>

        <div className="w-full lg:w-2/3 flex flex-col sm:flex-row gap-6">
          {/* Categoría */}
          <div className="w-full sm:w-1/2">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Categoría</label>
            <div className="relative">
              <select 
                value={activeCategory} 
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full pl-0 pr-8 py-2 border-0 border-b border-gray-200 bg-transparent focus:ring-0 focus:border-black outline-none text-sm appearance-none cursor-pointer rounded-none"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-gray-400">
                 <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Precio */}
          <div className="w-full sm:w-1/2">
            <div className="flex justify-between items-baseline mb-3">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">Ajustar Precio</label>
              <span className="text-xs font-medium text-black tracking-wide">Máx: ₡{currentMaxPrice.toLocaleString()}</span>
            </div>
            <input 
              type="range"
              min="0"
              max={maxPossiblePrice}
              step="1000"
              value={currentMaxPrice}
              onChange={(e) => setSelectedMaxPrice(Number(e.target.value))}
              className="w-full accent-black cursor-pointer h-1 bg-gray-200 rounded-none appearance-none"
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="py-24 text-center text-gray-400">
          <Filter className="w-8 h-8 mx-auto mb-4 stroke-[1px]" />
          <p className="text-sm">No hay coincidencias encontradas.</p>
          <button 
            onClick={() => {
              setSearchQuery('')
              setActiveCategory('Todos')
              setSelectedMaxPrice(null)
            }}
            className="mt-4 text-black text-xs uppercase tracking-widest font-semibold border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
          >
            Restaurar Filtros
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
