import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function getJobs() {
  const { data, error } = await supabase
    .from('products') // O puedes estructurarlo con una tabla 'jobs' dedicada
    .select('*')
    .eq('type', 'empleo')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al cargar empleos:', error.message)
    return []
  }

  return data || []
}

export default async function JobsPage() {
  const jobs = await getJobs()

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Bolsa de Empleo & Oportunidades
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mt-2">
            🏢 Portal Corporativo de Empleos
          </h1>
          <p className="text-gray-600 mt-2">
            Conecta con empresas verificadas y postúlate a las mejores vacantes del mercado.
          </p>
        </header>

        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">No hay ofertas de empleo publicadas todavía.</p>
            <p className="text-sm text-gray-400 mt-1">Las vacantes corporativas aparecerán aquí en cuanto las empresas las publiquen.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job: any) => (
              <div 
                key={job.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      {job.category || 'Vacante General'}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ${Number(job.price).toFixed(2)} / mes
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">{job.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Postulación Directa</span>
                  {job.seller_whatsapp && (
                    <a 
                      href={`https://wa.me/${job.seller_whatsapp}?text=Hola,%20estoy%20interesado%20en%20la%20vacante%20laboral:%20${encodeURIComponent(job.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      Postularme por WhatsApp
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
