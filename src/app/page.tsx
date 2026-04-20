"use client"

import Link from 'next/link'
import { PackageSearch, ShoppingCart, MessageCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react'

export default function Home() {
  const handleCustomQuote = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
    if (!phoneNumber) return alert('Número no configurado en entorno')
    
    const msg = encodeURIComponent('Hola, me gustaría solicitar una cotización especial para un producto que no muesta el catálogo:\n\n- Qué busco:\n- Detalles o foto (opcional):\n- Mi presupuesto aproximado:\n')
    window.open(`https://wa.me/${phoneNumber}?text=${msg}`, '_blank')
  }

  return (
    <div className="w-full bg-[#fafafa]">
      
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]"></div>
        <div className="mx-auto max-w-5xl text-center relative z-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.05] mb-8">
            Encuéntralo aquí, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600">
              nosotros nos encargamos del resto
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light mb-10">
            Tu tienda de conveniencia personal. Revisa lo que tenemos en stock o pídenos exactamente lo que necesitas y te armamos una cotización de inmediato.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/productos" 
              className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-semibold shadow-xl shadow-gray-900/20 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
            >
              Ver Catálogo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button 
              onClick={handleCustomQuote}
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-8 py-4 rounded-2xl font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <PackageSearch className="w-5 h-5 text-indigo-600" />
              Pedir cotización especial
            </button>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">¿Cómo funciona?</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">Comprar o conseguir lo que buscas nunca fue tan fácil y seguro, todo directamente desde tu celular.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/30 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">1. Explora el Catálogo</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Navega por las categorías y agrega los productos que te interesen al carrito. No necesitas crear cuentas ni poner tarjetas.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/30 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">2. Envía tu Pedido</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Ve a tu carrito y haz clic en "Finalizar". Se abrirá tu WhatsApp automáticamente con un resumen ordenado de tu orden para enviárnoslo.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-200/30 text-center flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Zap className="w-32 h-32 text-indigo-900" />
            </div>
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600 relative z-10">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">3. Lo conseguimos por ti</h3>
            <p className="text-gray-500 leading-relaxed text-sm relative z-10">
              ¿No estaba en el catálogo? <b>Contáctanos</b> con los detalles de lo que buscas e intentaremos conseguirtelo al momento haciendo una cotización en base a tu presupuesto.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gray-900 py-20 px-6 mt-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Encontramos lo que la gente necesita.</h2>
          <p className="text-gray-400 mb-10 text-lg">Si tienes algo específico en mente y quieres una cotización ágil, escríbenos dándole un toque al botón de acá abajo.</p>
          <button 
            onClick={handleCustomQuote}
            className="bg-white hover:bg-gray-100 text-gray-900 px-10 py-4 rounded-full font-bold shadow-xl transition-all transform hover:scale-105"
          >
            Preguntar por WhatsApp
          </button>
        </div>
      </section>

    </div>
  )
}
