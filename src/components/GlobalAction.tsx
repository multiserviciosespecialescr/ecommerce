"use client"

import React from 'react'
import { MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function GlobalAction() {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) return null

  const handleGeneralQuestion = () => {
    if (!phoneNumber) {
      alert('Número no configurado en entorno')
      return
    }
    const msg = encodeURIComponent('Hola, quiero pedir un producto personalizado que no encuentro en el catálogo:\n\n- Producto que busco:\n- Presupuesto aproximado:\n\n¡Gracias!')
    window.open(`https://wa.me/${phoneNumber}?text=${msg}`, '_blank')
  }

  return (
    <button
      onClick={handleGeneralQuestion}
      className="fixed bottom-6 right-6 z-30 text-white px-5 py-3.5 rounded-full font-semibold shadow-xl flex items-center gap-2.5 transform transition-all hover:scale-105 active:scale-95 hover:brightness-110"
      style={{ backgroundColor: '#007bff', boxShadow: '0 8px 30px rgba(0,123,255,0.35)' }}
    >
      <MessageCircle className="w-5 h-5 flex-shrink-0" />
      <span className="hidden sm:inline text-sm">Pide lo que no ves en la tienda</span>
      <span className="sm:hidden text-sm">Pedir</span>
    </button>
  )
}
