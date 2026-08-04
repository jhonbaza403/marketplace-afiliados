import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function Home({
  searchParams,
}: {
  searchParams: { type?: string }
}) {
  const resolvedSearchParams = await searchParams
  const selectedType = resolvedSearchParams?.type

  const supabase = await createClient()

  // Construir la consulta con filtro opcional por tipo
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (selectedType && selectedType !== 'todos') {
    query = query.eq('type', selectedType)
  }

  const { data: products, error } = await query

  const categories = [
    { label: 'Todos', value: 'todos' },
    { label: 'Detal', value: 'detal' },
    { label: 'Al Mayor', value: 'mayor' },
    { label: 'Servicios', value: 'servicio' },
    { label: 'Afiliados', value: 'afiliado' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera Creativa y Moderna */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-zinc-200 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
              Marketplace Pro
            </span>
            <h1 className="text-4xl font-black text-zinc-900 mt-2 tracking-tight">
              Ofertas y Oportunidades
            </h1>
            <p className="text-zinc-600 text-sm mt-1">
              Descubre productos exclusivos, servicios profesionales y los mejores enlaces de afiliados.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/vender"
              className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition transform hover:-translate-y-0.5"
            >
              + Publicar Oferta
            </Link>
            <Link
              href="/login"
              className="bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300 px-4 py-2.5 rounded-xl font-semibold text-sm transition"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>

        {/* Filtros Dinámicos */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const isActive = (!selectedType && cat.value === 'todos') || selectedType === cat.value
            return (
              <Link
                key={cat.value}
                href={`/?type=${cat.value}`}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-emerald-200'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                {cat.label}
              </Link>
            )
          })}
        </div>

        {/* Listado de Productos en Tarjetas Dinámicas */}
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
            <p className="font-semibold">Error al cargar el contenido.</p>
            <p className="text-xs mt-1">Verifica que las tablas de Supabase estén creadas correctamente.</p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative overflow-hidden bg-zinc-100 h-52">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-medium">
                      Sin imagen previa
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-zinc-900 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm">
                    {product.type}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 tracking-wide uppercase">
                      {product.category}
                    </span>
                    <h2 className="text-base font-bold text-zinc-900 mt-1 line-clamp-1 group-hover:text-emerald-600 transition">
                      {product.title}
                    </h2>
                    <p className="text-zinc-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {product.description || 'Sin descripción detallada.'}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-medium">Precio</span>
                      <span className="text-lg font-black text-zinc-900">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    </div>

                    {product.affiliate_link ? (
                      <a
                        href={product.affiliate_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-xl font-bold transition shadow-sm shadow-emerald-100"
                      >
                        Ver Oferta 🚀
                      </a>
                    ) : product.seller_whatsapp ? (
                      <a
                        href={`https://wa.me/${product.seller_whatsapp}?text=Hola,%20estoy%20interesado%20en%20tu%20producto:%20${encodeURIComponent(product.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-4 py-2 rounded-xl font-bold transition shadow-sm"
                      >
                        WhatsApp 💬
                      </a>
                    ) : (
                      <span className="text-xs text-zinc-400 font-semibold bg-zinc-100 px-3 py-1.5 rounded-xl">
                        Disponible
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white border border-dashed border-zinc-300 rounded-3xl shadow-sm">
            <h3 className="text-lg font-bold text-zinc-800">No hay ofertas registradas</h3>
            <p className="text-zinc-500 text-sm mt-1 max-w-sm mx-auto">
              Sé el primero en publicar un producto, servicio o enlace de afiliado en este marketplace.
            </p>
            <Link
              href="/vender"
              className="inline-block mt-6 bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-emerald-700 transition"
            >
              Crear mi primera publicación
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
