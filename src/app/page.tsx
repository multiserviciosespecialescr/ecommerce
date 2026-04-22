"use client"

import Link from 'next/link'
import { Search, MessageCircle } from 'lucide-react'

export default function Home() {
  const handleCustomQuote = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
    if (!phoneNumber) return alert('Número no configurado en entorno')
    const msg = encodeURIComponent('Hola, quiero pedir un producto personalizado que no encuentro en el catálogo:\n\n- Producto que busco:\n- Presupuesto aproximado:\n\n¡Gracias!')
    window.open(`https://wa.me/${phoneNumber}?text=${msg}`, '_blank')
  }

  return (
    <div className="w-full bg-[#f8faff]">

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center justify-center">

        {/* Background Images — 4 fotos difuminadas */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none select-none">
          <div className="overflow-hidden">
            <img src="/hero_ropa.png" alt="" className="w-full h-full object-cover scale-110 blur-[2px]" />
          </div>
          <div className="overflow-hidden">
            <img src="/hero_electronica.png" alt="" className="w-full h-full object-cover scale-110 blur-[2px]" />
          </div>
          <div className="overflow-hidden">
            <img src="/hero_hogar.png" alt="" className="w-full h-full object-cover scale-110 blur-[2px]" />
          </div>
          <div className="overflow-hidden">
            <img src="/hero_belleza.png" alt="" className="w-full h-full object-cover scale-110 blur-[2px]" />
          </div>
        </div>

        {/* Overlay gradiente azul/blanco */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#007bff]/75 via-[#004fa3]/60 to-[#003080]/80" />

        {/* Contenido centrado */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-white/90 text-xs font-semibold tracking-widest uppercase mb-8">
            ✦ Catálogo de Todo Tipo de Productos
          </div>

          {/* Título */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6 drop-shadow-lg">
            Todo lo que buscas,<br/>
            <span className="text-[#a8d4ff]">en un solo lugar.</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-white/80 text-lg sm:text-xl max-w-xl mx-auto mb-10 font-light leading-relaxed">
            Explora nuestro catálogo. Si no encuentras lo que buscas, nosotros lo conseguimos — cotización por WhatsApp al instante.
          </p>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/productos"
              className="w-full sm:w-auto bg-white text-[#007bff] font-bold px-10 py-4 rounded-xl text-sm tracking-wide hover:bg-[#e8f3ff] transition-all shadow-lg shadow-black/20 flex items-center justify-center gap-2"
            >
              Ver Catálogo
            </Link>
            <button
              onClick={handleCustomQuote}
              className="w-full sm:w-auto border-2 border-white text-white font-bold px-10 py-4 rounded-xl text-sm tracking-wide hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Pide lo que no ves aquí
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-white/60 text-xs font-medium">
            <span>✓ Sin registro necesario</span>
            <span>✓ Pedidos personalizados</span>
            <span>✓ Cotización inmediata por WhatsApp</span>
          </div>
        </div>
      </section>

      {/* ─── CÓMO FUNCIONA ─── */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#007bff] text-xs font-bold tracking-widest uppercase">Simple y rápido</span>
            <h2 className="text-4xl font-extrabold text-[#1a1a2e] tracking-tight mt-3 mb-4">El Proceso.</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Comprar con nosotros es directo y sin fricción. Tres pasos y listo.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Explora', icon: '🛍️', desc: 'Navega el catálogo y añade lo que quieras al carrito. Sin registro previo.' },
              { num: '02', title: 'Finaliza', icon: '📲', desc: 'Tu pedido se envía a nuestro WhatsApp como un resumen claro y detallado.' },
              { num: '03', title: 'Solicita', icon: '💬', desc: '¿No encuentras algo? Escríbenos y cotizamos cualquier producto al instante.' },
            ].map((step) => (
              <div key={step.num} className="bg-[#f8faff] border border-[#dde8f8] rounded-2xl p-8 hover:shadow-md hover:shadow-[#007bff]/10 transition-all">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6" style={{ backgroundColor: '#e8f3ff' }}>
                  {step.icon}
                </div>
                <span className="text-[#007bff] text-xs font-bold tracking-widest">{step.num}</span>
                <h3 className="text-xl font-bold text-[#1a1a2e] mt-1 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="py-24 px-6 bg-[#f8faff] border-t border-[#dde8f8]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[#007bff] to-[#0062cc] rounded-3xl px-10 py-16 shadow-xl shadow-[#007bff]/30">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              ¿No ves lo que buscas?
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Nuestra tienda no tiene todo, <strong className="text-white">pero lo conseguimos.</strong> Escríbenos con el producto, descripción o presupuesto y te cotizamos al instante.
            </p>
            <button
              onClick={handleCustomQuote}
              className="bg-white text-[#007bff] font-bold px-12 py-4 rounded-xl text-sm tracking-wide hover:bg-[#e8f3ff] transition-all shadow-lg inline-flex items-center gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              Cotiza tu pedido por WhatsApp
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}
