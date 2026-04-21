"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Product } from '@/lib/supabase'

export interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('catalog_cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error('Failed to parse cart', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage when items change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('catalog_cart', JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = (product: Product, quantity = 1) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id)
      const currentQuantity = existingItem ? existingItem.quantity : 0

      if (currentQuantity + quantity > product.stock) {
        alert(`Solo tenemos ${product.stock} unidades disponibles de este producto.`)
        return currentItems
      }

      if (existingItem) {
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...currentItems, { ...product, quantity }]
    })
    setIsCartOpen(true)
  }

  const removeItem = (productId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems(currentItems =>
      currentItems.map(item => {
        if (item.id === productId) {
          if (quantity > item.stock) {
            alert(`Límite de stock alcanzado (${item.stock} unidades).`)
            return { ...item, quantity: item.stock }
          }
          return { ...item, quantity }
        }
        return item
      })
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
