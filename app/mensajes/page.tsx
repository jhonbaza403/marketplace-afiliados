import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function MessagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera del Centro de Mensajes */}
        <div className="bg-white border border-zinc-200/80 p-8 rounded-3xl shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
              Centro de Negocios
            </span>
            <h1 className="text-3xl font-black text-zinc-900 mt-2">Mensajería y Negociaciones</h1>
            <p className="text-zinc-500 text-xs mt-1">
              Comunícate directamente con compradores y vendedores sobre tus ofertas publicadas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-2.5 rounded-xl font-bold text-xs transition"
            >
              ← Volver al Marketplace
            </Link>
          </div>
        </div>

        {/* Panel de Conversaciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white border border-zinc-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
          {/* Lista de Chats */}
          <div className="border-r border-zinc-200 p-6 flex flex-col">
            <h2 className="text-sm font-black text-zinc-900 uppercase tracking-wider mb-4">
              Conversaciones Activas
            </h2>

            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
              <p className="text-zinc-500 text-xs font-medium">No hay mensajes activos aún.</p>
              <p className="text-zinc-400 text-[11px] mt-1">
                Las consultas de clientes interesados vía WhatsApp o chat interno aparecerán reflejadas aquí.
              </p>
            </div>
          </div>

          {/* Área de Visualización del Chat */}
          <div className="md:col-span-2 p-6 flex flex-col justify-between">
            <div className="border-b border-zinc-100 pb-4 mb-4">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Detalle del Chat</span>
              <h3 className="text-base font-black text-zinc-900 mt-0.5">Selecciona una conversación</h3>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
              <span className="text-3xl mb-2">💬</span>
              <p className="text-zinc-600 text-sm font-bold">Comunícate de forma directa y segura</p>
              <p className="text-zinc-400 text-xs mt-1 max-w-sm">
                Recuerda que también puedes coordinar transacciones y cierres inmediatos a través de los botones de contacto directo de cada oferta.
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-100 flex gap-3">
              <input
                disabled
                type="text"
                placeholder="Escribe un mensaje (Módulo en preparación)..."
                className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 text-zinc-400 cursor-not-allowed"
              />
              <button
                disabled
                className="bg-zinc-200 text-zinc-400 font-bold px-6 py-3 rounded-xl text-xs cursor-not-allowed"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
