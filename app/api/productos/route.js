import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Lista de productos o la información que requiera tu aplicación
    const productos = [
      { id: 1, nombre: 'Producto Ejemplo 1', precio: 100 },
      { id: 2, nombre: 'Producto Ejemplo 2', precio: 200 }
    ];

    return NextResponse.json({ success: true, data: productos });
  } catch (error) {
    console.error('[PRODUCTOS GET Error]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
