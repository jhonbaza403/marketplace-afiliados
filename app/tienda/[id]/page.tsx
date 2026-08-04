import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function getStoreProducts(userId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al cargar la tienda:', error.message)
    return []
  }

  return data || []
}

export default async function StorePage({ params }: { params: { id: string } }) {
  const products = await getStoreProducts(params.id)

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera del Perfil de Tienda */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Vitrina Verificada
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Tienda Multivendedor</h1>
            <p className="text-gray-600 text-sm mt-1">ID de Vendedor: {params.id}</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-gray-50 px-4 py-3 rounded-xl border text-center">
              <span className="block text-xl font-bold text-gray-900">{products.length}</span>
              <span className="text-xs text-gray-500">Productos Activos</span>
            </div>
          </div>
        </div>

        {/* Catálogo Específico de la Tienda */}
        <h2 className="text-xl font-bold text-gray-800 mb-6">Catálogo de Ofertas</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500">Este vendedor aún no ha publicado ofertas en su tienda personal.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <div 
                key={product.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.title} 
                    className="w-full h-48 object-cover bg-gray-100"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                    Sin Imagen
                  </div>
                )}
                
                <div className="p-4 flex flex-col flex-grow">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-fit mb-2">
                    {product.category}
                  </span>
                  
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{product.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2 flex-grow">{product.description}</p>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">${Number(product.price).toFixed(2)}</span>
                    
                    {product.seller_whatsapp && (
                      <a 
                        href={`https://wa.me/${product.seller_whatsapp}?text=Hola,%20estoy%20interesado%20en%20tu%20producto:%20${encodeURIComponent(product.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
