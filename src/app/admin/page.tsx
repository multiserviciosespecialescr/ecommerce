"use client"

import { useState, useEffect } from 'react'
import { supabase, Product } from '@/lib/supabase'
import { AdminAuth } from '@/components/AdminAuth'
import { Package, Plus, Pencil, Trash2, X, RefreshCw, Upload, LayoutGrid, Search, LogOut } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({})
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [existingImagesState, setExistingImagesState] = useState<string[]>([])
  
  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setExistingImagesState(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `uploads/${fileName}`

      const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file)
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('products').getPublicUrl(filePath)
      return data.publicUrl
    } catch (error: any) {
      alert('Error subiendo imagen: ' + error.message)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let uploadedUrls: string[] = []

    if (selectedFiles.length > 0) {
      setIsUploading(true)
      for (const file of selectedFiles) {
        const url = await uploadImage(file)
        if (url) uploadedUrls.push(url)
      }
      setIsUploading(false)
    }

    const finalImages = [...existingImagesState, ...uploadedUrls]

    if (finalImages.length === 0) {
      alert('Debes agregar al menos una imagen')
      return
    }
    
    const productData = {
      name: formData.name,
      price: Number(formData.price),
      category: formData.category || CATEGORIES[0],
      image_url: finalImages[0], 
      images: finalImages,     
      stock: Number(formData.stock || 0),
      description: formData.description || null
    }

    if (formData.id) {
      await supabase.from('products').update(productData).eq('id', formData.id)
    } else {
      await supabase.from('products').insert([productData])
    }
    
    setFormData({})
    setSelectedFiles([])
    setExistingImagesState([])
    setIsEditing(false)
    fetchProducts()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Se eliminará permanentemente del catálogo. ¿Deseas continuar?')) {
      await supabase.from('products').delete().eq('id', id)
      fetchProducts()
    }
  }

  const handleEdit = (product: Product) => {
    setFormData(product)
    
    if (product.images && product.images.length > 0) {
      setExistingImagesState(product.images)
    } else if (product.image_url) {
      setExistingImagesState([product.image_url])
    } else {
      setExistingImagesState([])
    }

    setSelectedFiles([])
    setIsEditing(true)
  }

  const handleAdd = () => {
    setFormData({ category: CATEGORIES[0], price: 0, stock: 1 })
    setExistingImagesState([])
    setSelectedFiles([])
    setIsEditing(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    window.location.reload()
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between md:justify-start gap-4">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-xs">LB</div>
            <span className="font-semibold text-lg tracking-tight">Lo Buscamos</span>
          </div>
          <nav className="p-4 flex-1">
            <ul className="space-y-1">
              <li>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-black font-medium text-sm rounded-lg">
                  <LayoutGrid className="w-4 h-4" />
                  Inventario
                </div>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-100">
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full text-left font-medium text-sm rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Workspace */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          
          {/* Topbar */}
          <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10 shrink-0">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Catálogo</h1>
            <button 
              onClick={handleAdd}
              className="bg-black text-white px-5 py-2.5 text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Crear Producto
            </button>
          </header>

          {/* Content Area */}
          <div className="p-8 flex-1 overflow-y-auto w-full">
            
            {/* Toolbar */}
            <div className="bg-white border border-gray-200 rounded-xl p-3 mb-6 shadow-sm flex items-center gap-3">
              <div className="flex items-center gap-3 flex-1 px-3">
                <Search className="w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre o categoría..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 focus:ring-0 outline-none text-sm"
                />
              </div>
              <div className="text-xs font-semibold text-gray-400 px-4 border-l border-gray-100 uppercase tracking-widest hidden sm:block">
                {filteredProducts.length} Artículos
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
              {loading ? (
                <div className="p-20 text-center text-gray-400 flex flex-col items-center">
                  <RefreshCw className="w-6 h-6 animate-spin mb-4 text-black" />
                  Sincronizando con base de datos...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-24 text-center">
                  <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="mb-4 text-gray-500 font-medium">No se encontraron productos.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-400 text-xs font-bold uppercase tracking-widest">
                        <th className="p-5">Artículo Principal</th>
                        <th className="p-5 text-right w-32">Precio</th>
                        <th className="p-5 text-center w-32">Inventario</th>
                        <th className="p-5 w-40">Categoría</th>
                        <th className="p-5 text-center w-24">Ajustes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              <div className="relative shrink-0">
                                <img src={product.image_url} alt="" className="w-10 h-10 object-cover rounded-md border border-gray-200 bg-white" />
                                {product.images && product.images.length > 1 && (
                                  <div className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">{product.images.length}</div>
                                )}
                              </div>
                              <div className="font-semibold text-sm text-gray-900 line-clamp-2">{product.name}</div>
                            </div>
                          </td>
                          <td className="p-5 text-right font-medium text-gray-900 text-sm">
                            ₡{product.price.toLocaleString()}
                          </td>
                          <td className="p-5 text-center">
                            <span className={`inline-flex items-center justify-center min-w-[3rem] px-2.5 py-1 text-xs font-bold rounded-full border ${product.stock <= 0 ? 'border-red-200 text-red-700 bg-red-50' : product.stock <= 5 ? 'border-orange-200 text-orange-700 bg-orange-50' : 'border-green-200 text-green-700 bg-green-50'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="p-5 text-gray-500 text-xs font-medium">
                            {product.category}
                          </td>
                          <td className="p-5">
                            <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEdit(product)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-colors" title="Editar">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Eliminar">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Slide-over Drawer para Edición */}
        {isEditing && (
          <>
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsEditing(false)} />
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white shadow-2xl flex flex-col border-l border-gray-200 animate-in slide-in-from-right duration-300">
              
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">{formData.id ? 'Editor de Producto' : 'Nuevo Producto'}</h2>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-900 bg-white shadow-sm border border-gray-200 p-2 rounded-full transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <form id="product-form" onSubmit={handleSave} className="p-6 space-y-8">
                  
                  {/* Seccion 1 */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900">1. Información General</h3>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Nombre Comercial</label>
                      <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all text-sm font-medium text-gray-900" placeholder="Ej. Zapatillas Nike Air" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Precio (₡)</label>
                        <input required min="0" type="number" value={formData.price ?? ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all text-sm font-medium text-gray-900" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Stock Disp.</label>
                        <input required min="0" type="number" value={formData.stock ?? ''} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all text-sm font-medium text-gray-900" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Categoría</label>
                      <select 
                        required 
                        value={formData.category || CATEGORIES[0]} 
                        onChange={e => setFormData({...formData, category: e.target.value})} 
                        className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all text-sm font-medium text-gray-900"
                      >
                        {CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Seccion 2 */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900">2. Galería Visual</h3>
                    
                    <div className="border-2 border-dashed border-gray-200 p-8 text-center rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                      <input type="file" accept="image/*" multiple id="image-upload" className="hidden" onChange={handleFileChange} />
                      <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-3">
                        <div className="bg-white p-3 rounded-full shadow-sm border border-gray-200 group-hover:scale-110 transition-transform">
                          <Upload className="text-gray-900 w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">Seleccionar fotografías</span>
                        <span className="text-xs text-gray-500 font-medium">Arrastra o elige (PNG, JPG, WEBP)</span>
                      </label>
                    </div>
                    
                    {(existingImagesState.length > 0 || selectedFiles.length > 0) && (
                      <div className="bg-white border border-gray-100 p-4 rounded-xl flex flex-wrap gap-3">
                        {existingImagesState.map((imgUrl, idx) => (
                          <div key={`exist-${idx}`} className="relative w-24 h-24 group rounded-md overflow-hidden bg-gray-100">
                            <img src={imgUrl} alt="Old" className="w-full h-full object-cover" />
                            {idx === 0 && <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[8px] text-center font-bold py-1 uppercase">Principal</div>}
                            <button type="button" onClick={() => removeExistingImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        
                        {selectedFiles.map((file, idx) => (
                          <div key={`new-${idx}`} className="relative w-24 h-24 group rounded-md overflow-hidden bg-gray-100 border-2 border-green-500">
                            <img src={URL.createObjectURL(file)} alt="New" className="w-full h-full object-cover opacity-80" />
                            <div className="absolute top-1 left-1 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">NUEVA</div>
                            <button type="button" onClick={() => removeSelectedFile(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <hr className="border-gray-100" />

                  {/* Seccion 3 */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900">3. Detalles y Reseña</h3>
                    <textarea rows={4} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all text-sm text-gray-900" placeholder="Redacta la descripción, beneficios, materiales o composición del producto..."></textarea>
                  </div>
                </form>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-gray-100 bg-white grid grid-cols-2 gap-4 shrink-0">
                <button type="button" onClick={() => setIsEditing(false)} className="w-full bg-gray-50 border border-gray-200 text-gray-700 font-semibold text-sm rounded-lg py-3.5 hover:bg-gray-100 transition-colors">
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  form="product-form"
                  disabled={isUploading}
                  className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white shadow-md font-semibold text-sm rounded-lg py-3.5 transition-all flex justify-center items-center gap-2"
                >
                  {isUploading ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Guardando...</>
                  ) : (
                    'Guardar Todo'
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminAuth>
  )
}
