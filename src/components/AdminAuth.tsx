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
        <div className="flex justify-end p-4 max-w-5xl mx-auto w-full">
          <button 
            onClick={() => {
              localStorage.removeItem('adminAuth')
              setIsAuthenticated(false)
            }}
            className="text-sm text-gray-500 hover:text-red-500 font-medium"
          >
            Cerrar sesión de admin
          </button>
        </div>
        {children}
      </>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 max-w-sm w-full border border-gray-100">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
          <Lock className="w-6 h-6 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Acceso Restringido</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña de Administración
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
              placeholder="Ingresa la contraseña"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <p className="text-xs text-gray-500 mt-2">Por defecto es: admin123</p>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-black text-white font-medium py-2.5 rounded-xl transition-colors"
          >
            Ingresar al Panel
          </button>
        </form>
      </div>
    </div>
  )
}
