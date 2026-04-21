"use client"

import { useState, useEffect } from 'react'
import { Lock } from 'lucide-react'

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
    setIsReady(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    if (password === adminPass) {
      localStorage.setItem('adminAuth', 'true')
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Contraseña incorrecta')
    }
  }

  if (!isReady) return null

  if (isAuthenticated) {
    return (
      <>
        {children}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-10 shadow-sm max-w-sm w-full border border-gray-200">
        <div className="w-12 h-12 bg-black flex items-center justify-center mb-6 mx-auto">
          <Lock className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-center text-black mb-8 tracking-tight">Acceso Privado</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-0 border-b border-gray-200 px-0 py-2 text-center focus:ring-0 focus:border-black outline-none transition-colors"
              placeholder="••••••••"
            />
            {error && <p className="text-red-500 text-xs mt-2 text-center font-medium">{error}</p>}
            <p className="text-[10px] text-gray-400 mt-3 text-center uppercase tracking-widest">Por defecto es: admin123</p>
          </div>
          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest py-4 transition-colors"
          >
            Ingresar al Panel
          </button>
        </form>
      </div>
    </div>
  )
}
