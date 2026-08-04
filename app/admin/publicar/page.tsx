import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPublishPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  async function handlePublish(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const type = formData.get('type') as string
    const price = parseFloat(formData.get('price') as string) || 0
    const description = formData.get('description') as string
    const image_url = formData.get('image_url') as string
    const seller_whatsapp = formData.get('seller_whatsapp') as string
    const affiliate_link = formData.get('affiliate_link') as string
    const social_network = formData.get('social_network') as string

    const supabaseServer = await createClient()
    const { data: userData } = await supabaseServer.auth.getUser()

    await supabaseServer.from('products').insert([
      {
        title,
        category,
        type,
        price,
        description,
        image_url,
        seller_whatsapp,
        affiliate_link,
        // Puedes concatenar o guardar la red social dentro de la descripción o en una columna específica si la creas en Supabase
        user_id: userData.user?.id || null,
      },
    ])

    redirect('/')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 p-6 md:p-12">
      <div className="max-w-2xl mx-auto bg-white border border-zinc-200/80 p-8 rounded-3xl shadow-sm">
        <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
              Panel Administrativo
            </span>
            <h1 className="text-2xl font-black text-zinc-900 mt-2">Gestión y Publicación</h1>
          </div>
          <Link
            href="/"
            className="text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-zinc-100 px-4 py-2 rounded-xl transition"
          >
            ← Volver al Inicio
          </Link>
        </div>

        <form action={handlePublish} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
              Título de la Oferta
            </label>
            <input
              name="title"
              required
              type="text"
              placeholder="Ej. Producto, Servicio o Vacante"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Categoría
              </label>
              <input
                name="category"
                required
                type="text"
                placeholder="Ej. Tecnología, Ropa"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Tipo
              </label>
              <select
                name="type"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="detal">Detal</option>
                <option value="mayor">Al Mayor</option>
                <option value="servicio">Servicio</option>
                <option value="afiliado">Afiliado / Enlace externo</option>
                <option value="empleo">Empleo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Precio ($)
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                WhatsApp de Contacto
              </label>
              <input
                name="seller_whatsapp"
                type="text"
                placeholder="Ej. 584121234567"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Campo esencial para marketing de afiliados estilo Amazon */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
              🔗 Enlace de Afiliado / Producto (Amazon, Hotmart, etc.)
            </label>
            <input
              name="affiliate_link"
              type="url"
              placeholder="https://tu-enlace-de-afiliado.com/..."
              className="w-full px-4 py-3 rounded-xl border border-emerald-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/30"
            />
          </div>

          {/* Redes sociales para difusión */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
              📱 Red Social o Canal de Promoción (Telegram, Instagram, X, Facebook)
            </label>
            <input
              name="social_network"
              type="text"
              placeholder="Ej. https://t.me/tu_canal o @tu_perfil"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
              URL de Imagen
            </label>
            <input
              name="image_url"
              type="url"
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Detalles de la oferta..."
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition shadow-md text-sm"
          >
            Guardar y Publicar 🚀
          </button>
        </form>
      </div>
    </main>
  )
}
