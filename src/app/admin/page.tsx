"use client"

import { useState, useEffect, useRef } from 'react'
import { supabase, Product } from '@/lib/supabase'
import { AdminAuth } from '@/components/AdminAuth'
import { Package, Plus, Pencil, Trash2, X, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
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

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error: any) {
      alert('Error subiendo imagen: ' + error.message + '\n\n*Asegúrate de haber creado el Storage Bucket llamado "products" y que sea público.*')
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
      alert('Debes agregar al menos una imagen principal (subiéndola)')
      return
    }
    
    // Preparar el producto a salvar
    const productData = {
      name: formData.name,
      price: Number(formData.price),
      category: formData.category || CATEGORIES[0],
      image_url: finalImages[0], // Primera imagen es la portada obligatoria para retrocompatibilidad
      images: finalImages,     // Array de imágenes reales
      stock: Number(formData.stock || 0),
      description: formData.description || null
    }

    if (formData.id) {
      // Editar
      await supabase.from('products').update(productData).eq('id', formData.id)
    } else {
      // Crear
      await supabase.from('products').insert([productData])
    }
    
    setFormData({})
    setSelectedFiles([])
    setExistingImagesState([])
    setIsEditing(false)
    fetchProducts()
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      await supabase.from('products').delete().eq('id', id)
      fetchProducts()
    }
  }

  const handleEdit = (product: Product) => {
    setFormData(product)
    
    // Inicializar fotos existentes
    if (product.images && product.images.length > 0) {
      setExistingImagesState(product.images)
    } else if (product.image_url) {
      // Migración temporal: si tiene "image_url" vieja, la pasamos al listado de fotos.
      setExistingImagesState([product.image_url])
    } else {
      setExistingImagesState([])
    }

    setSelectedFiles([])
    setIsEditing(true)
  }

  const handleAdd = () => {
    setFormData({
      category: CATEGORIES[0],
      price: 0,
      stock: 1
    })
    setExistingImagesState([])
    setSelectedFiles([])
    setIsEditing(true)
  }

  return (
    <AdminAuth>
      <div className="max-w-5xl mx-auto p-4 sm:p-6 w-full pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-black p-2.5 rounded-none shadow-sm shadow-black/30">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-black tracking-tight">Panel de Administración</h1>
            </div>
          </div>
          <button 
            onClick={handleAdd}
            className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-none font-medium shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Producto
          </button>
        </div>

        {/* Modal de Edición */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-none shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-black tracking-tight">{formData.id ? 'Editar Producto' : 'Crear Producto'}</h2>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-black transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Nombre</label>
                  <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-0 border-b border-gray-200 bg-transparent px-0 py-2 focus:ring-0 focus:border-black outline-none transition-colors" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Precio (₡)</label>
                    <input required min="0" type="number" value={formData.price ?? ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full border-0 border-b border-gray-200 bg-transparent px-0 py-2 focus:ring-0 focus:border-black outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Stock</label>
                    <input required min="0" type="number" value={formData.stock ?? ''} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full border-0 border-b border-gray-200 bg-transparent px-0 py-2 focus:ring-0 focus:border-black outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Categoría</label>
                    <div className="relative">
                      <select 
                        required 
                        value={formData.category || CATEGORIES[0]} 
                        onChange={e => setFormData({...formData, category: e.target.value})} 
                        className="w-full border-0 border-b border-gray-200 bg-transparent px-0 py-2 focus:ring-0 focus:border-black outline-none transition-colors appearance-none"
                      >
                        {CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Galería del Producto</label>
                  
                  {/* Selector Múltiple */}
                  <div className="border border-dashed border-gray-300 p-6 text-center hover:border-black transition-colors cursor-pointer bg-gray-50 mb-4">
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      id="image-upload"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-3">
                      <div className="bg-black w-10 h-10 flex items-center justify-center">
                        <Upload className="text-white w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold text-black tracking-wide">Haz clic para subir fotos</span>
                      <span className="text-xs text-gray-500 font-light">Puedes seleccionar varias (PNG, JPG)</span>
                    </label>
                  </div>
                  
                  {/* Vista Previa Conjunta */}
                  {(existingImagesState.length > 0 || selectedFiles.length > 0) && (
                    <div className="flex flex-wrap gap-3">
                      {/* Fotos ya en la nube */}
                      {existingImagesState.map((imgUrl, idx) => (
                        <div key={`exist-${idx}`} className="relative w-16 h-16 group border border-gray-200">
                          <img src={imgUrl} alt="Old" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeExistingImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      
                      {/* Fotos nuevas esperando guardar */}
                      {selectedFiles.map((file, idx) => (
                        <div key={`new-${idx}`} className="relative w-16 h-16 group border border-black opacity-80">
                          <img src={URL.createObjectURL(file)} alt="New" className="w-full h-full object-cover grayscale" />
                          <div className="absolute inset-0 flex items-center justify-center text-[8px] uppercase tracking-widest font-bold text-white bg-black/40 text-center">Nuevo</div>
                          <button type="button" onClick={() => removeSelectedFile(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Descripción (Opcional)</label>
                  <textarea rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border-0 border-b border-gray-200 bg-transparent px-0 py-2 focus:ring-0 focus:border-black outline-none transition-colors"></textarea>
                </div>
                
                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-white border border-gray-200 text-black font-semibold text-xs tracking-widest uppercase hover:border-black py-4 transition-colors">
                    Descartar
                  </button>
                  <button 
                    type="submit" 
                    disabled={isUploading}
                    className="flex-1 bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white font-semibold text-xs tracking-widest uppercase py-4 transition-all flex justify-center items-center gap-2"
                  >
                    {isUploading ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /> Procesando...</>
                    ) : (
                      'Publicar Producto'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de productos */}
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden rounded-none">
          {loading ? (
            <div className="p-12 text-center text-gray-400 flex flex-col items-center">
              <RefreshCw className="w-6 h-6 animate-spin mb-4 text-black" />
              Cargando catálogo...
            </div>
          ) : products.length === 0 ? (
            <div className="p-16 text-center">
              <p className="mb-6 text-gray-400 font-light">Inventario vacío por el momento.</p>
              <button onClick={handleAdd} className="text-black font-semibold uppercase tracking-widest text-xs border-b border-black pb-1 hover:text-gray-500 transition-colors">
                Ingresar un Artículo
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                    <th className="p-4">Producto</th>
                    <th className="p-4 text-right">Precio</th>
                    <th className="p-4 text-center">Unidades</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4 text-center mt-auto">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img src={product.image_url} alt="" className="w-12 h-16 object-cover bg-gray-100 border border-gray-200" />
                            {product.images && product.images.length > 1 && (
                              <div className="absolute -bottom-2 -right-2 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 pointer-events-none">+{product.images.length - 1}</div>
                            )}
                          </div>
                          <div className="font-semibold text-sm text-black line-clamp-1">{product.name}</div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-semibold text-black whitespace-nowrap text-sm">
                        ₡{product.price.toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 text-xs font-bold tracking-widest uppercase border ${product.stock <= 0 ? 'border-red-200 text-red-600 bg-red-50' : product.stock <= 5 ? 'border-orange-200 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-600 bg-gray-50'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 text-xs tracking-widest uppercase">
                        {product.category}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => handleEdit(product)} className="text-gray-400 hover:text-black transition-colors" title="Editar">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="text-red-300 hover:text-red-600 transition-colors" title="Eliminar">
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
    </AdminAuth>
  )
}
