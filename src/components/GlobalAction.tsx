"use client"

import React from 'react'
import { MessageCircle } from 'lucide-react'

export function GlobalAction() {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

  const handleGeneralQuestion = () => {
    if (!phoneNumber) {
      alert('Número no configurado en entorno')
      return
    }
    const msg = encodeURIComponent('Hola, estoy buscando un producto que no aparece en el catálogo:\n- Producto:\n- Presupuesto:\n')
    window.open(`https://wa.me/${phoneNumber}?text=${msg}`, '_blank')
  }

  return (
    <button
      onClick={handleGeneralQuestion}
      className="fixed bottom-6 right-6 z-30 bg-gray-900 hover:bg-black text-white px-5 py-3.5 rounded-full font-medium shadow-xl shadow-gray-900/20 flex items-center gap-2 transform transition-all hover:scale-105 active:scale-95"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="hidden sm:inline">¿No encuentras lo que buscas?</span>
    </button>
  )
}
