"use client"

import Link from 'next/link'
import { Search, ShoppingBag, SendHorizontal } from 'lucide-react'

export default function Home() {
  const handleCustomQuote = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
    if (!phoneNumber) return alert('Número no configurado en entorno')
    
    const msg = encodeURIComponent('Hola, me gustaría consultar por un producto que no muestra el catálogo:\n\n- Descripción:\n- Presupuesto:\n')
    window.open(`https://wa.me/${phoneNumber}?text=${msg}`, '_blank')
  }

  return (
    <div className="w-full bg-white">
      
      {/* Hero Section */}
      <section className="relative px-6 py-32 lg:py-48 flex items-center justify-center text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-black tracking-tighter leading-[1.05] mb-8">
            Simplicidad en cada compra.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light mb-12">
            Explora nuestra colección selecta. Agrega lo que necesitas al carrito y finaliza el pedido instantáneamente por WhatsApp. Sin esperas.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/productos" 
              className="w-full sm:w-auto bg-black text-white px-10 py-4 font-medium text-sm tracking-wide transition-all hover:bg-gray-900 rounded-none border border-black flex items-center justify-center gap-3"
            >
              Ver Colección
            </Link>
            <button 
              onClick={handleCustomQuote}
              className="w-full sm:w-auto text-white px-10 py-4 font-medium text-sm tracking-wide transition-all hover:brightness-110 rounded-none flex items-center justify-center gap-3"
              style={{ backgroundColor: '#007bff' }}
            >
              <Search className="w-4 h-4" />
              Pide lo que no hay aquí
            </button>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="py-32 px-6 lg:px-8 border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-black tracking-tight mb-4">El Proceso.</h2>
            <p className="text-gray-500">Comprar con nosotros es directo y sin fricción.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {/* Step 1 */}
            <div className="flex flex-col">
              <div className="mb-6">
                <ShoppingBag className="w-6 h-6 text-gray-900 stroke-[1.5px]" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-3">01. Selecciona</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-light">
                Navega el catálogo y añade los artículos de tu interés al carrito. No requerimos registro previo.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col">
              <div className="mb-6">
                <SendHorizontal className="w-6 h-6 text-gray-900 stroke-[1.5px]" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-3">02. Envía</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-light">
                Dirígete a tu carrito y finaliza. Tu orden se enviará a nuestro WhatsApp como un resumen claro y estructurado.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col">
              <div className="mb-6">
                <Search className="w-6 h-6 text-gray-900 stroke-[1.5px]" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-3">03. Solicita</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-light">
                Si requieres un artículo que no está listado, consúltalo directamente. Cotizamos pedidos especiales al instante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 px-6 border-t border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-8 tracking-tighter">¿No ves lo que buscas?</h2>
          <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light mb-12">
            Nuestra tienda no tiene todo, <span className="font-semibold text-black">pero lo conseguimos.</span> Escríbenos por WhatsApp con el producto que quieres, su descripción o un presupuesto y te cotizamos al instante.
          </p>
          <button 
            onClick={handleCustomQuote}
            className="text-white px-12 py-5 font-semibold text-sm tracking-wide transition-all hover:brightness-110 rounded-none inline-flex items-center gap-3 shadow-lg"
            style={{ backgroundColor: '#007bff', boxShadow: '0 8px 30px rgba(0,123,255,0.3)' }}
          >
            Cotiza tu pedido por WhatsApp
          </button>
        </div>
      </section>

    </div>
  )
}
