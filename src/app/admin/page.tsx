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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
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
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
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
    
    let imageUrlToSave = formData.image_url || ''

    if (selectedFile) {
      const uploadedUrl = await uploadImage(selectedFile)
      if (!uploadedUrl) return // Detener si falló la subida
      imageUrlToSave = uploadedUrl
    }

    if (!imageUrlToSave) {
      alert('Debes agregar una imagen (subiéndola o con un link)')
      return
    }
    
    // Preparar el producto a salvar
    const productData = {
      name: formData.name,
      price: Number(formData.price),
      category: formData.category || CATEGORIES[0],
      image_url: imageUrlToSave,
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
    setSelectedFile(null)
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
    setSelectedFile(null)
    setIsEditing(true)
  }

  const handleAdd = () => {
    setFormData({
      category: CATEGORIES[0],
      price: 0,
      stock: 1
    })
    setSelectedFile(null)
    setIsEditing(true)
  }

  return (
    <AdminAuth>
      <div className="max-w-5xl mx-auto p-4 sm:p-6 w-full pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-600/30">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Panel de Administración</h1>
            </div>
          </div>
          <button 
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Producto
          </button>
        </div>

        {/* Modal de Edición */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold">{formData.id ? 'Editar Producto' : 'Crear Producto'}</h2>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-700 bg-gray-100 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-600 outline-none" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio (₡)</label>
                    <input required min="0" type="number" value={formData.price ?? ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input required min="0" type="number" value={formData.stock ?? ''} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <div className="relative">
                      <select 
                        required 
                        value={formData.category || CATEGORIES[0]} 
                        onChange={e => setFormData({...formData, category: e.target.value})} 
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 appearance-none focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
                      >
                        {CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del Producto</label>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-indigo-500 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*"
                      id="image-upload"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <div className="bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center">
                        <Upload className="text-indigo-600 w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-indigo-600">Haz clic para subir imagen</span>
                      <span className="text-xs text-gray-500">
                        {selectedFile ? selectedFile.name : (formData.image_url ? 'Ya tienes una imagen actual. Sube otra para reemplazar.' : 'PNG, JPG, WEBP')}
                      </span>
                    </label>
                  </div>
                  
                  {/* Vista Previa */}
                  {(selectedFile || formData.image_url) && (
                    <div className="mt-4 flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <ImageIcon className="w-5 h-5 text-gray-400 ml-2" />
                      <div className="text-sm text-gray-600 flex-1 truncate">
                        {selectedFile ? 'Nueva imagen lista para subir' : 'Imagen actual usando link'}
                      </div>
                      {formData.image_url && !selectedFile && (
                        <img src={formData.image_url} alt="Vista previa" className="w-10 h-10 object-cover rounded-md" />
                      )}
                    </div>
                  )}

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (Opcional)</label>
                  <textarea rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-600 outline-none"></textarea>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-xl transition-colors">
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={isUploading}
                    className="flex-1 bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-medium py-3 rounded-xl shadow-xl shadow-gray-900/20 transition-all flex justify-center items-center gap-2"
                  >
                    {isUploading ? (
                      <><RefreshCw className="w-5 h-5 animate-spin" /> Guardando...</>
                    ) : (
                      'Guardar Producto'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de productos */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
              Cargando productos...
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="mb-4">No hay productos en el catálogo.</p>
              <button onClick={handleAdd} className="text-indigo-600 hover:underline font-medium">
                Agrega tu primer producto
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">Producto</th>
                    <th className="p-4 font-semibold text-right">Precio</th>
                    <th className="p-4 font-semibold text-center">Stock</th>
                    <th className="p-4 font-semibold">Categoría</th>
                    <th className="p-4 font-semibold text-center mt-auto">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img src={product.image_url} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200" />
                          <div className="font-medium text-gray-900">{product.name}</div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-medium text-indigo-600 whitespace-nowrap">
                        ₡{product.price.toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${product.stock <= 0 ? 'bg-red-50 text-red-600' : product.stock <= 5 ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        <span className="bg-gray-100 px-2.5 py-1 rounded-md text-xs font-semibold">{product.category}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
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
