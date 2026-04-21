"use client"

import { useState, useMemo } from 'react'
import { Product } from '@/lib/supabase'
import { ProductCard } from './ProductCard'
import { PackageOpen, AlertCircle, ShoppingCart, Search, Filter } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

interface CatalogProps {
  initialProducts: Product[]
  dbError: string | null
}

export function Catalog({ initialProducts, dbError }: CatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Todos')
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // Usar categorías fijas
  const categories = ['Todos', ...CATEGORIES]

  // Rango máximo de precios dinámico basado en inventario real
  const maxPossiblePrice = useMemo(() => {
    return initialProducts.length > 0 ? Math.max(...initialProducts.map(p => p.price)) : 100000
  }, [initialProducts])

  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number | null>(null)
  const currentMaxPrice = selectedMaxPrice !== null ? selectedMaxPrice : maxPossiblePrice

  // Filtrar productos
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
      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 lg:p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-10 flex flex-col lg:flex-row gap-5 items-center">
        
        {/* Buscador */}
        <div className="relative w-full lg:w-1/3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 hover:bg-gray-100 focus:bg-white border border-transparent focus:border-indigo-300 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-5 w-full lg:w-2/3">
          {/* Categoría (Select) */}
          <div className="relative w-full sm:w-1/2">
            <select 
              value={activeCategory} 
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full pl-5 pr-10 py-3.5 bg-gray-50 hover:bg-gray-100 focus:bg-white border border-transparent focus:border-indigo-300 rounded-2xl appearance-none focus:ring-4 focus:ring-indigo-100 outline-none font-semibold text-gray-700 transition-all cursor-pointer"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-400">
               <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
            <div className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] uppercase tracking-wider font-bold text-indigo-600 rounded-full shadow-sm border border-indigo-100">
              Categoría
            </div>
          </div>

          {/* Filtro de Precio */}
          <div className="w-full sm:w-1/2 bg-gray-50 rounded-2xl px-5 py-2 border border-transparent hover:border-gray-200 transition-all flex flex-col justify-center relative">
            <div className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] uppercase tracking-wider font-bold text-green-600 rounded-full shadow-sm border border-green-100">
              Precio Máximo
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-gray-700 mb-1 mt-1">
               <span>₡0</span>
               <span className="text-green-600 bg-green-100 px-2.5 py-0.5 rounded-md">₡{currentMaxPrice.toLocaleString()}</span>
            </div>
            <input 
              type="range"
              min="0"
              max={maxPossiblePrice}
              step="1000"
              value={currentMaxPrice}
              onChange={(e) => setSelectedMaxPrice(Number(e.target.value))}
              className="w-full accent-green-500 cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none"
            />
          </div>
        </div>
      </div>

      {/* Resultado Vacio */}
      {filteredProducts.length === 0 && (
        <div className="py-20 text-center text-gray-500">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No hay resultados</h3>
          <p>Intenta ajustar los filtros de búsqueda, categoría o precio.</p>
          <button 
            onClick={() => {
              setSearchQuery('')
              setActiveCategory('Todos')
              setSelectedMaxPrice(null)
            }}
            className="mt-6 text-indigo-600 font-semibold hover:underline"
          >
            Limpiar todos los filtros
          </button>
        </div>
      )}

      {/* Grilla de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
