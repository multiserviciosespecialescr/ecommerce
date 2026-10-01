"use client"

import Link from 'next/link'
import { 
  ShoppingCart, MessageCircle, CheckCircle, Sparkles, Send, Palette, Gift, Heart,
  Coffee, Shirt, Wine, KeyRound, UtensilsCrossed, Frame
} from 'lucide-react'

export default function Home() {
  const handleCustomQuote = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
    if (!phoneNumber) return alert('Número no configurado en entorno')
    const msg = encodeURIComponent('Hola, me gustaría cotizar un producto personalizado:\n\n- Tipo de producto (taza, camisa, botella, etc.):\n- Diseño o idea:\n- Cantidad:\n\n¡Gracias!')
    window.open(`https://wa.me/${phoneNumber}?text=${msg}`, '_blank')
  }

  const handleSalonQuote = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
    if (!phoneNumber) return alert('Número no configurado en entorno')
    const msg = encodeURIComponent('Hola, me interesa información sobre el alquiler de salón:\n\n- Fecha del evento:\n- Tipo de evento:\n- Cantidad de invitados:\n\n¡Gracias!')
    window.open(`https://wa.me/${phoneNumber}?text=${msg}`, '_blank')
  }

  return (
    <div className="w-full bg-white">

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center justify-center">

        {/* Background Image */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <img src="/hero_personalizados.jpg" alt="" className="w-full h-full object-cover scale-105" />
        </div>

        {/* Overlay oscuro con tinte de marca */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d3b4f]/60 via-[#0d3b4f]/70 to-[#092a38]/90" />

        {/* Decorative blurred shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#2abfbf]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#f5a623]/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Contenido centrado */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-white/90 text-xs font-semibold tracking-widest uppercase mb-8 shimmer-badge">
            <Sparkles className="w-3.5 h-3.5 text-[#2abfbf]" /> Productos Personalizados
          </div>

          {/* Título */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-6 drop-shadow-lg">
            Tu estilo,<br/>
            <span className="text-[#2abfbf]">tu creatividad.</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-white/80 text-lg sm:text-xl max-w-xl mx-auto mb-10 font-light leading-relaxed">
            Tazas, camisas, botellas, llaveros, platos y más — todo personalizado a tu gusto. Diseñamos contigo, creamos para ti.
          </p>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/productos"
              className="w-full sm:w-auto bg-white text-[#0d3b4f] font-bold px-10 py-4 rounded-xl text-sm tracking-wide hover:bg-[#e6f2f7] transition-all shadow-lg shadow-black/20 flex items-center justify-center gap-2"
            >
              Ver Catálogo
            </Link>
            <button
              onClick={handleCustomQuote}
              className="w-full sm:w-auto border-2 border-white text-white font-bold px-10 py-4 rounded-xl text-sm tracking-wide hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <Palette className="w-4 h-4" />
              Cotiza tu diseño
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-white/60 text-xs font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Diseños 100% personalizados</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Pedidos por WhatsApp</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Cotización inmediata</span>
          </div>
        </div>
      </section>

      {/* ─── PRODUCTOS DESTACADOS / LO QUE HACEMOS ─── */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#2abfbf] text-xs font-bold tracking-widest uppercase">Lo que hacemos</span>
            <h2 className="text-4xl font-extrabold text-[#0d3b4f] tracking-tight mt-3 mb-4">Productos que hablan de ti.</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Cada pieza es única, diseñada para contar tu historia o la de tu marca.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { Icon: Coffee, title: 'Tazas', desc: 'Con tu foto, frase o logo favorito' },
              { Icon: Shirt, title: 'Camisas', desc: 'Diseños únicos para equipos, eventos o marca personal' },
              { Icon: Wine, title: 'Botellas', desc: 'Termos y botellas grabadas o impresas' },
              { Icon: KeyRound, title: 'Llaveros', desc: 'Acrílico, metal o resina personalizados' },
              { Icon: UtensilsCrossed, title: 'Platos', desc: 'Decorativos o funcionales con diseños exclusivos' },
              { Icon: Frame, title: 'Decoración', desc: 'Cuadros, letreros, adornos y más' },
            ].map((item) => (
              <div key={item.title} className="group bg-white border border-[#d5e5ec] rounded-2xl p-6 hover:shadow-lg hover:shadow-[#0d3b4f]/8 hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-[#e6f2f7] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#2abfbf] transition-all duration-300">
                  <item.Icon className="w-8 h-8 text-[#0d3b4f] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-[#0d3b4f] mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CÓMO FUNCIONA ─── */}
      <section className="py-24 px-6 lg:px-8 bg-[#f8fafb]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#2abfbf] text-xs font-bold tracking-widest uppercase">Simple y rápido</span>
            <h2 className="text-4xl font-extrabold text-[#0d3b4f] tracking-tight mt-3 mb-4">El Proceso.</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Crear algo único es fácil con nosotros. Tres pasos y listo.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Explora', Icon: ShoppingCart, desc: 'Navega el catálogo, encuentra inspiración o simplemente escríbenos con tu idea.' },
              { num: '02', title: 'Personaliza', Icon: Palette, desc: 'Cuéntanos tu diseño, sube tu imagen o déjalo en nuestras manos. Te enviamos una vista previa.' },
              { num: '03', title: 'Recibe', Icon: Gift, desc: 'Coordinamos por WhatsApp el pago y entrega. Tu producto llega listo para brillar.' },
            ].map((step) => (
              <div key={step.num} className="bg-white border border-[#d5e5ec] rounded-2xl p-8 hover:shadow-md hover:shadow-[#0d3b4f]/8 transition-all">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: '#e6f2f7' }}>
                  <step.Icon className="w-6 h-6" style={{ color: '#0d3b4f' }} />
                </div>
                <span className="text-[#2abfbf] text-xs font-bold tracking-widest">{step.num}</span>
                <h3 className="text-xl font-bold text-[#0d3b4f] mt-1 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ALQUILER DE SALÓN (CTA Banner) ─── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0d3b4f] via-[#134a5e] to-[#092a38] rounded-3xl px-8 sm:px-14 py-16 shadow-2xl shadow-[#0d3b4f]/30">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2abfbf]/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#f5a623]/10 rounded-full blur-[60px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-white/80 text-xs font-semibold tracking-widest uppercase mb-6">
                  <Heart className="w-3 h-3 text-[#f5a623]" /> Servicio Especial
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                  Alquiler de Salones<br/>
                  <span className="text-[#2abfbf]">para tus eventos</span>
                </h2>
                <p className="text-white/70 text-base max-w-md leading-relaxed mb-8 md:mb-0">
                  ¿Planeas una fiesta, reunión o celebración? Contamos con salones equipados. Coordinamos todo por WhatsApp — fechas, decoración y detalles.
                </p>
              </div>
              <div className="shrink-0">
                <button
                  onClick={handleSalonQuote}
                  className="bg-white text-[#0d3b4f] font-bold px-10 py-4 rounded-xl text-sm tracking-wide hover:bg-[#e6f2f7] transition-all shadow-lg inline-flex items-center gap-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  Consultar disponibilidad
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="py-24 px-6 bg-[#f8fafb]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[#0d3b4f] to-[#092a38] rounded-3xl px-10 py-16 shadow-xl shadow-[#0d3b4f]/20">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              ¿Tienes una idea en mente?
            </h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Cuéntanos tu idea y la hacemos realidad. <strong className="text-[#2abfbf]">No importa lo loca que sea</strong> — si se puede imprimir, grabar o personalizar, lo hacemos.
            </p>
            <button
              onClick={handleCustomQuote}
              className="bg-[#2abfbf] text-white font-bold px-12 py-4 rounded-xl text-sm tracking-wide hover:bg-[#24a8a8] transition-all shadow-lg shadow-[#2abfbf]/30 inline-flex items-center gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              Cotiza tu producto por WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#0d3b4f] text-white/60 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Estilos Creativos" className="h-8 w-auto brightness-0 invert opacity-80" />
            <span className="font-semibold text-white/80 text-sm">Estilos Creativos</span>
          </div>
          <p className="text-xs text-center sm:text-right">
            © {new Date().getFullYear()} Estilos Creativos. Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </div>
  )
}
