import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function getVideoProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .not('video_url', 'is', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al cargar videos:', error.message)
    return []
  }

  return data || []
}

export default async function VideosPage() {
  const videos = await getVideoProducts()

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800/50">
            Reels & Promociones Visuales
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3">
            🎬 Vitrina Multimedia & Videos (90s)
          </h1>
          <p className="text-gray-400 mt-2">
            Descubre las ofertas de nuestros vendedores en formato de video dinámico.
          </p>
        </header>

        {videos.length === 0 ? (
          <div className="text-center py-24 bg-gray-900/50 rounded-2xl border border-gray-800">
            <p className="text-gray-400 text-lg">No hay videos promocionales publicados todavía.</p>
            <p className="text-sm text-gray-500 mt-1">Agrega enlaces de video (MP4 o YouTube) a tus productos para visualizarlos aquí.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((item: any) => (
              <div 
                key={item.id} 
                className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 flex flex-col justify-between shadow-lg"
              >
                <div className="relative aspect-[9/16] bg-black max-h-[400px] w-full flex items-center justify-center">
                  {item.video_url ? (
                    <video 
                      src={item.video_url} 
                      controls 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-600 text-sm">Sin contenido de video</div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2 py-1 rounded w-fit mb-2">
                    {item.category || 'Promoción'}
                  </span>
                  
                  <h2 className="text-lg font-bold text-white line-clamp-1">{item.title}</h2>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2 flex-grow">{item.description}</p>
                  
                  <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-white">${Number(item.price).toFixed(2)}</span>
                    
                    {item.seller_whatsapp && (
                      <a 
                        href={`https://wa.me/${item.seller_whatsapp}?text=Hola,%20vi%20el%20video%20del%20producto:%20${encodeURIComponent(item.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
                      >
                        Comprar por WhatsApp
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
