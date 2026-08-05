import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="border-b bg-white px-6 py-4 flex justify-between items-center shadow-sm">
      <Link href="/" className="font-bold text-lg text-blue-600">
        Marketplace Afiliados
      </Link>
      <div className="flex gap-4 items-center">
        <Link href="/empleos" className="text-gray-600 hover:text-black">Empleos</Link>
        <Link href="/mensajes" className="text-gray-600 hover:text-black">Mensajes</Link>
        <Link href="/admin/publicar" className="text-gray-600 hover:text-black">Publicar</Link>
        <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Entrar</Link>
      </div>
    </nav>
  )
}
