import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Cargar exclusivamente los productos creados por el usuario autenticado
  const { data: userProducts, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera del Perfil */}
        <div className="bg-white border border-zinc-200/80 p-8 rounded-3xl shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
              Panel de Cuenta
            </span>
            <h1 className="text-3xl font-black text-zinc-900 mt-2">Mi Perfil y Tienda</h1>
            <p className="text-zinc-500 text-xs mt-1">Correo registrado: <span className="font-semibold text-zinc-700">{user.email}</span></p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/publicar"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition"
            >
              + Publicar Nueva Oferta
            </Link>
            <Link
              href="/"
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-2.5 rounded-xl font-bold text-xs transition"
            >
              ← Ir al Marketplace
            </Link>
          </div>
        </div>

        {/* Listado de Ofertas del Usuario */}
        <h2 className="text-xl font-black text-zinc-900 mb-6">Mis Publicaciones Activas</h2>

        {productsError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center text-sm">
            Error al cargar tus publicaciones.
          </div>
        ) : userProducts && userProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col"
              >
                <div className="relative overflow-hidden bg-zinc-100 h-44">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">
                      Sin imagen
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-zinc-900 text-[10px] font-black uppercase px-2 py-1 rounded-lg">
                    {product.type}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">
                      {product.category}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-900 mt-1 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-zinc-500 text-xs mt-1 line-clamp-2">
                      {product.description || 'Sin descripción'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-base font-black text-zinc-900">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      Activo
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-zinc-300 rounded-3xl shadow-sm">
            <h3 className="text-base font-bold text-zinc-800">Aún no tienes publicaciones</h3>
            <p className="text-zinc-500 text-xs mt-1 max-w-sm mx-auto">
              Crea tu primera oferta para que aparezca listada en tu vitrina personal y en el marketplace general.
            </p>
            <Link
              href="/admin/publicar"
              className="inline-block mt-5 bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-sm"
            >
              Crear publicación
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
