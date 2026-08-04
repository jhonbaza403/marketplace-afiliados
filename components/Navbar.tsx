import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-black text-xl text-zinc-900 tracking-tight flex items-center gap-2">
          <span className="bg-emerald-600 text-white w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-sm">
            M
          </span>
          Marketplace Pro
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-semibold text-zinc-600 hover:text-emerald-600 transition"
          >
            Explorar
          </Link>
          <Link
            href="/vender"
            className="text-sm font-semibold text-zinc-600 hover:text-emerald-600 transition"
          >
            Publicar
          </Link>

          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-zinc-200">
              <span className="text-xs font-medium text-zinc-500 hidden sm:inline">
                {user.email}
              </span>
              <form action={async () => {
                'use server'
                const supabase = await createClient()
                await supabase.auth.signOut()
              }}>
                <button
                  type="submit"
                  className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition"
                >
                  Salir
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm shadow-emerald-100"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
