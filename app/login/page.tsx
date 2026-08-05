import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const resolvedSearchParams = await searchParams

  const signIn = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?message=Could not authenticate user')
    }

    return redirect('/')
  }

  const signUp = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return redirect('/login?message=Could not authenticate user')
    }

    return redirect('/login?message=Check email to continue sign in process')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 flex flex-col justify-center px-6 py-12">
      <div className="max-w-md w-full mx-auto bg-white border border-zinc-200/80 p-8 rounded-3xl shadow-sm">
        <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
              Acceso
            </span>
            <h1 className="text-2xl font-black text-zinc-900 mt-2">Iniciar Sesión</h1>
          </div>
          <Link
            href="/"
            className="text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-zinc-100 px-4 py-2 rounded-xl transition"
          >
            ← Volver
          </Link>
        </div>

        <form className="flex flex-col w-full gap-4 text-foreground">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1" htmlFor="email">
              Correo electrónico
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-inherit"
              name="email"
              type="email"
              placeholder="tucorreo@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-inherit"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              formAction={signIn}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition shadow-md text-sm"
            >
              Iniciar Sesión 🚀
            </button>
            <button
              formAction={signUp}
              className="w-full border border-zinc-300 hover:bg-zinc-100 text-zinc-800 font-bold py-3.5 rounded-xl transition text-sm"
            >
              Registrarse
            </button>
          </div>

          {resolvedSearchParams?.message && (
            <p className="mt-4 p-3 bg-red-50 text-center text-xs font-semibold text-red-600 rounded-xl border border-red-100">
              {resolvedSearchParams.message}
            </p>
          )}
        </form>
      </div>
    </main>
  )
}
