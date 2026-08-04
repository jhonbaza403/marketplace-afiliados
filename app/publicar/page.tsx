'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function PublicarPage() {
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMensaje('')

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const type = formData.get('type') as string
    const price = parseFloat(formData.get('price') as string) || 0
    const description = formData.get('description') as string
    const image_url = formData.get('image_url') as string
    const seller_whatsapp = formData.get('seller_whatsapp') as string
    const affiliate_link = formData.get('affiliate_link') as string

    // Obtenemos el usuario autenticado actual para asociar la publicación
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('products').insert([
      {
        title,
        category,
        type,
        price,
        description,
        image_url,
        seller_whatsapp,
        affiliate_link,
        user_id: user?.id || null,
      },
    ])

    setLoading(false)

    if (error) {
      setMensaje(`Error al publicar: ${error.message}`)
    } else {
      setMensaje('¡Oferta, servicio o empleo publicado con éxito en el Marketplace!')
      e.currentTarget.reset()
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">📢 Publicar Nueva Oferta, Empleo o Afiliación</h1>
        <p className="text-gray-600 text-sm mb-6">Comparte tus productos, servicios profesionales, ofertas de empleo o enlaces de afiliado.</p>

        {mensaje && (
          <div className={`p-4 mb-6 rounded-lg text-sm ${mensaje.includes('éxito') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título de la Oferta / Vacante / Producto</label>
            <input name="title" required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej. Zapatillas, Desarrollador Frontend o Curso" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <input name="category" required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej. Calzado, Tecnología, Recursos Humanos" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Publicación</label>
              <select name="type" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                <option value="detal">Detal</option>
                <option value="mayor">Al Mayor</option>
                <option value="servicio">Servicio</option>
                <option value="afiliado">Afiliado / Enlace Externo</option>
                <option value="empleo">Empleo / Vacante</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio o Salario ($)</label>
              <input name="price" type="number" step="0.01" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0.00" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp de Contacto / Postulación</label>
              <input name="seller_whatsapp" type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej. 584121234567" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-700 mb-1">🔗 Enlace de Afiliado / Red Social / Postulación Externa</label>
            <input name="affiliate_link" type="url" className="w-full px-4 py-2 border border-emerald-300 bg-emerald-50/30 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="https://t.me/tu_canal o https://tu-enlace.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen o Logo</label>
            <input name="image_url" type="url" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción / Requisitos</label>
            <textarea name="description" rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Detalles de la oferta, requerimientos del empleo o campaña..." />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
          >
            {loading ? 'Publicando...' : 'Publicar Oferta 🚀'}
          </button>
        </form>
      </div>
    </main>
  )
}
