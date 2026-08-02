import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin/server client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const formData = await request.formData();

    const companyName = formData.get('companyName');
    const rifNumber = formData.get('rifNumber');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const userId = formData.get('userId');
    const rifFile = formData.get('rifFile'); // File object from input

    // Validation
    if (!companyName || !rifNumber || !phone || !email) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben ser completados.' },
        { status: 400 }
      );
    }

    let rifDocumentUrl = null;

    // Handle file upload to Supabase Storage if provided
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

      // Get public URL of the uploaded document
      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      rifDocumentUrl = publicUrlData.publicUrl;
    }

    // Insert KYC application into Supabase Database
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
