import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminPublicarPage() {
  const supabase = await createClient()

  // Verificar si hay una sesión activa
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">
        Publicar Nuevo Anuncio
      </h1>
      <p className="text-sm text-zinc-500 mb-8">
        Completa los campos para agregar un nuevo elemento al marketplace.
      </p>

      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <p className="text-sm text-zinc-600">
          Sesión iniciada como: <span className="font-semibold text-zinc-900">{user.email}</span>
        </p>
      </div>
    </div>
  )
}
