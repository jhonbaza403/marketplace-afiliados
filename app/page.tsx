import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

async function getProducts() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return []
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error de Supabase:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error general al conectar con la base de datos:', err)
    return []
  }
}

export default async function Home() {
  const products = await getProducts()

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            🛒 Credi Marketplace & Ofertas
          </h1>
          <p className="text-gray-600 mt-2">
            Plataforma multivendedor de agregación de ofertas y productos populares.
          </p>
        </header>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">No hay productos publicados o configurando conexión.</p>
            <p className="text-sm text-gray-400 mt-1">Verifica tus variables de entorno (`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`) en tu archivo `.env.local`.</p>
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
                    {product.category || 'General'}
                  </span>
                  
                  <h2 className="text-lg font-bold text-gray-800 line-clamp-1">{product.title}</h2>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2 flex-grow">{product.description}</p>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">${Number(product.price || 0).toFixed(2)}</span>
                    
                    {product.seller_whatsapp && (
                      <a 
                        href={`https://wa.me/${product.seller_whatsapp}?text=Hola,%20estoy%20interesado%20en%20el%20producto:%20${encodeURIComponent(product.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
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
