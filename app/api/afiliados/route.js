import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Aquí puedes agregar la lógica de conexión a Supabase o tus datos de afiliados
    // Ejemplo de respuesta estándar en formato JSON:
    const data = [
      { id: 1, name: 'Afiliado Ejemplo 1', status: 'activo' },
      { id: 2, name: 'Afiliado Ejemplo 2', status: 'activo' }
    ];

    if (id) {
      const filtered = data.find(item => item.id === parseInt(id));
      if (!filtered) {
        return NextResponse.json({ error: 'Afiliado no encontrado' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: filtered });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[AFILIADOS GET Error]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
