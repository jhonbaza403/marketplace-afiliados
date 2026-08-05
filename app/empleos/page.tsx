import { createClient } from '@/utils/supabase/server'

export default async function EmpleosPage() {
  const supabase = await createClient()
  const { data: empleos } = await supabase.from('empleos').select('*')

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">
        Bolsa de Empleos
      </h1>
      <p className="text-sm text-zinc-500 mb-8">
        Explora las ofertas de empleo disponibles en el marketplace.
      </p>

      <div className="grid gap-4">
        {empleos && empleos.length > 0 ? (
          empleos.map((empleo: any) => (
            <div key={empleo.id} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-zinc-900 text-lg">{empleo.titulo}</h2>
              <p className="text-sm text-zinc-600 mt-1">{empleo.descripcion}</p>
            </div>
          ))
        ) : (
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-center text-zinc-500 text-sm">
            No hay empleos publicados por el momento.
          </div>
        )}
      </div>
    </div>
  )
}
