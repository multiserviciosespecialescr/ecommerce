"use client"

import React from 'react'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from './CartContext'

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, totalPrice } = useCart()

  // Generate WA Checkout Message
  const handleCheckout = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
    
    // Fallback if number is not set
    if (!phoneNumber) {
      alert("El número de WhatsApp no está configurado.")
      return
    }

    let message = "👋 ¡Hola! Me gustaría hacer un pedido:\n\n"
    
    items.forEach(item => {
      message += `- ${item.name} (x${item.quantity}) - ₡${(item.price * item.quantity).toLocaleString()}\n`
    })
    
    message += `\n💰 *Total estimado: ₡${totalPrice.toLocaleString()}*\n\n`
    message += "Quedo a la espera para coordinar el pago y envío. ¡Gracias!"

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank')
  }

  // Prevent scroll when drawer is open
  React.useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isCartOpen])

  if (!isCartOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[400px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">Tu Pedido</h2>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-gray-500 gap-4">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-20 h-20 object-cover rounded-lg bg-white"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                    <p className="text-indigo-600 font-semibold">₡{item.price.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-white border rounded-lg px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-500 hover:text-indigo-600 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className={`transition-colors ${item.quantity >= item.stock ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-indigo-600'}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-500 hover:underline font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Total estimado</span>
              <span className="text-xl font-bold text-gray-900">₡{totalPrice.toLocaleString()}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3.5 rounded-xl font-bold tracking-wide shadow-lg shadow-green-500/30 flex justify-center items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Finalizar pedido por WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </>
  )
}
