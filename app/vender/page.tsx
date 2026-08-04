import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function VenderPage() {
  const supabase = await createClient()

  // Verificar si el usuario ha iniciado sesión
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const handleCreateProduct = async (formData: FormData) => {
    'use server'
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const type = formData.get('type') as string
    const price = Number(formData.get('price'))
    const description = formData.get('description') as string
    const image_url = formData.get('image_url') as string
    const affiliate_link = formData.get('affiliate_link') as string
    const seller_whatsapp = formData.get('seller_whatsapp') as string

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect('/login')

    const { error } = await supabase.from('products').insert({
      user_id: user.id,
      title,
      category,
      type,
      price,
      description,
      image_url,
      affiliate_link,
      seller_whatsapp,
    })

    if (error) {
      console.error('Error al crear producto:', error)
      return redirect('/vender?message=Error al publicar el producto')
    }

    return redirect('/')
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-6">
      <div className="max-w-xl mx-auto bg-white border border-zinc-200 rounded-lg p-8 shadow-sm">
        <h1 className="text-2xl font-extrabold text-zinc-900 mb-2">Publicar Producto o Servicio</h1>
        <p className="text-zinc-500 text-sm mb-6">Completa los datos para ofrecer tu artículo en el marketplace.</p>

        <form action={handleCreateProduct} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Título del Producto</label>
            <input
              name="title"
              required
              placeholder="Ej. Zapatillas deportivas / Curso online"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Categoría</label>
              <input
                name="category"
                required
                placeholder="Ej. Tecnología, Ropa"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Tipo</label>
              <select
                name="type"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="detal">Detal</option>
                <option value="mayor">Mayor</option>
                <option value="servicio">Servicio</option>
                <option value="afiliado">Afiliado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Precio ($)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">WhatsApp del Vendedor</label>
              <input
                name="seller_whatsapp"
                placeholder="+58412..."
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">URL de la Imagen</label>
            <input
              name="image_url"
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Enlace de Afiliado / Compra</label>
            <input
              name="affiliate_link"
              placeholder="https://tuenlaceafiliado.com"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Descripción</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Detalles sobre el producto, características o beneficios..."
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-md transition text-sm mt-2"
          >
            Publicar en el Marketplace
          </button>
        </form>
      </div>
    </div>
  )
}
