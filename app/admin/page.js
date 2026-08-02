import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Helper para validar formato de correo
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Inicialización segura del cliente Supabase
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltan variables de entorno para Supabase.');
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    // Soporta ambos formatos (camelCase y snake_case)
    const companyName = formData.get('companyName') || formData.get('company_name');
    const rifNumber = formData.get('rifNumber') || formData.get('rif');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const userId = formData.get('userId') || formData.get('user_id');
    const rifFile = formData.get('rifFile') || formData.get('rif_file') || formData.get('file');

    // 1. Validación de campos requeridos
    if (!companyName || !rifNumber || !phone || !email) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios (Empresa, RIF, Teléfono, Correo) deben ser completados.' },
        { status: 400 }
      );
    }

    // 2. Validación de formato de email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'El formato de correo electrónico no es válido.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    let rifDocumentUrl = null;

    // 3. Carga del archivo a Supabase Storage (Bucket "documents")
    if (rifFile && typeof rifFile === 'object' && rifFile.size > 0) {
      const rawExt = rifFile.name ? rifFile.name.split('.').pop() : 'png';
      const fileExt = rawExt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `kyc-documents/${fileName}`;

      const fileBuffer = await rifFile.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, fileBuffer, {
          contentType: rifFile.type || 'application/octet-stream',
          upsert: false,
        });

      if (uploadError) {
        console.error('[KYC Upload Error]:', uploadError);
        return NextResponse.json(
          { error: 'Error al subir el documento de RIF o identificación.' },
          { status: 500 }
        );
      }

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      rifDocumentUrl = publicUrlData.publicUrl;
    }

    // 4. Inserción en la base de datos
    const { data: kycRecord, error: dbError } = await supabase
      .from('kyc_verifications')
      .insert([
        {
          user_id: userId || null,
          company_name: companyName,
          rif_number: rifNumber,
          phone: phone,
          email: email,
          document_url: rifDocumentUrl,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('[KYC DB Insert Error]:', dbError);
      return NextResponse.json(
        { error: 'Error al guardar el registro KYC en la base de datos.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Solicitud de verificación RIF / KYC enviada exitosamente.',
        data: kycRecord,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[KYC Route Error]:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error interno en el servidor.' },
      { status: 500 }
    );
  }
}
