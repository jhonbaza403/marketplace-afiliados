import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Forzar renderizado dinámico para evitar errores de pre-renderizado en Vercel
export const dynamic = 'force-dynamic';

// Inicializar cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Método GET para consultar estado KYC
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'El parámetro userId es requerido.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('kyc_verifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[KYC GET DB Error]:', error);
      return NextResponse.json(
        { error: 'Error al consultar la solicitud KYC.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data || null }, { status: 200 });
  } catch (error) {
    console.error('[KYC GET Route Error]:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error interno en el servidor.' },
      { status: 500 }
    );
  }
}

// Método POST para registrar nueva solicitud KYC
export async function POST(request) {
  try {
    const formData = await request.formData();

    const companyName = formData.get('companyName');
    const rifNumber = formData.get('rifNumber');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const userId = formData.get('userId');
    const rifFile = formData.get('rifFile');

    // Validación de campos
    if (!companyName || !rifNumber || !phone || !email) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben ser completados.' },
        { status: 400 }
      );
    }

    let rifDocumentUrl = null;

    // Subida de documento a Supabase Storage
    if (rifFile && typeof rifFile === 'object' && rifFile.size > 0) {
      const fileExt = rifFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `kyc-documents/${fileName}`;

      const fileBuffer = await rifFile.arrayBuffer();

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, fileBuffer, {
          contentType: rifFile.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('[KYC Upload Error]:', uploadError);
        return NextResponse.json(
          { error: 'Error al subir el documento de RIF / Cédula.' },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      rifDocumentUrl = publicUrlData.publicUrl;
    }

    // Inserción en la base de datos
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
        { error: 'Error al registrar la solicitud KYC en la base de datos.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Solicitud de verificación RIF / KYC enviada con éxito.',
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
