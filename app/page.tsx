import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()

  // Consultar los productos en Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-zinc-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900">Marketplace Afiliados</h1>
            <p className="text-zinc-600 text-sm mt-1">Encuentra los mejores productos, servicios y ofertas al detal y mayor.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium text-sm transition"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>

        {/* Listado de Productos */}
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            Hubo un error al cargar los productos. Asegúrate de haber ejecutado el script SQL en Supabase.
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-zinc-100 flex items-center justify-center text-zinc-400 text-sm">
                    Sin imagen
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      {product.type}
                    </span>
                    <h2 className="text-lg font-bold text-zinc-900 mt-2">{product.title}</h2>
                    <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{product.description || 'Sin descripción disponible.'}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-lg font-extrabold text-zinc-900">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    {product.affiliate_link ? (
                      <a
                        href={product.affiliate_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-zinc-900 text-white text-xs px-3 py-1.5 rounded font-medium hover:bg-zinc-800 transition"
                      >
                        Ver Oferta
                      </a>
                    ) : (
                      <span className="text-xs text-zinc-400 font-medium">Disponible</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-zinc-300 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-700">No hay productos publicados todavía</h3>
            <p className="text-zinc-500 text-sm mt-1">Inicia sesión y agrega tu primer producto o servicio al marketplace.</p>
          </div>
        )}
      </div>
    </main>
  )
}
