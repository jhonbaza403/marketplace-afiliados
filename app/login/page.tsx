'form'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string }
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
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto mt-20">
      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md font-medium" htmlFor="email">
          Correo electrónico
        </label>
        <input
          className="rounded-md px-4 py-2 border bg-inherit border-zinc-300 mb-6"
          name="email"
          placeholder="tucorreo@gmail.com"
          required
        />
        <label className="text-md font-medium" htmlFor="password">
          Contraseña
        </label>
        <input
          className="rounded-md px-4 py-2 border bg-inherit border-zinc-300 mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button
          formAction={signIn}
          className="bg-emerald-600 rounded-md px-4 py-2 text-white mb-2 font-medium hover:bg-emerald-700 transition"
        >
          Iniciar Sesión
        </button>
        <button
          formAction={signUp}
          className="border border-zinc-300 rounded-md px-4 py-2 text-foreground mb-2 font-medium hover:bg-zinc-100 transition"
        >
          Registrarse
        </button>
        {resolvedSearchParams?.message && (
          <p className="mt-4 p-4 bg-zinc-100 text-center text-red-600 rounded-md">
            {resolvedSearchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
