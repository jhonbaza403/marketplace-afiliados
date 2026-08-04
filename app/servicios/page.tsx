import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function getServices() {
  const { data, error } = await supabase
    .from('products') // O una tabla específica 'services' si prefieres separarla
    .select('*')
    .eq('type', 'servicio')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al cargar servicios:', error.message)
    return []
  }

  return data || []
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Directorio Profesional
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mt-2">
            🛠️ Servicios Calificados & Expertos
          </h1>
          <p className="text-gray-600 mt-2">
            Conecta con profesionales especializados para tus proyectos y requerimientos.
          </p>
        </header>

        {services.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">No hay servicios profesionales publicados todavía.</p>
            <p className="text-sm text-gray-400 mt-1">Publica un servicio seleccionando el tipo "Servicio" desde el panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service: any) => (
              <div 
                key={service.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      {service.category || 'Servicio Profesional'}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ${Number(service.price).toFixed(2)}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-800">{service.title}</h2>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">{service.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Atención Directa</span>
                  {service.seller_whatsapp && (
                    <a 
                      href={`https://wa.me/${service.seller_whatsapp}?text=Hola,%20estoy%20interesado%20en%20contratar%20tu%20servicio:%20${encodeURIComponent(service.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      Contactar Experto
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
