import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ProductClientRenderer } from './ProductClientRenderer'

// Refrescamos rápido para que si cambia su precio/stock no se quede viejo
export const revalidate = 0

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Fetch de Supabase desde el Servidor
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
        <Link 
          href="/productos"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-16 hover:text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Catálogo
        </Link>
        
        {/* Renderizado Cliente con Botones Interactivos */}
        <ProductClientRenderer product={product} />
      </div>
    </div>
  )
}
