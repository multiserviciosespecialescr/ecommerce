import { supabase, Product } from '@/lib/supabase'
import { Catalog } from '@/components/Catalog'
import { Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProductosPage() {
  let products: Product[] = []
  let error: string | null = null

  try {
    const { data, error: sbError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (sbError) {
      error = sbError.message
    } else if (data) {
      products = data
    }
  } catch (err: any) {
    error = err.message || 'Error conectando a la base de datos'
  }

  return (
    <div className="w-full min-h-screen bg-[#fafafa]">
      {/* Header secundario simple */}
      <section className="bg-white border-b border-gray-200/60 shadow-sm py-12 px-4 relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Catálogo de Productos
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Explora nuestro catálogo y arma tu pedido con un par de clics.
          </p>
        </div>
      </section>

      {/* Catalog Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20">
        <Catalog initialProducts={products} dbError={error} />
      </section>
    </div>
  )
}
