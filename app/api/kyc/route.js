export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const supabase = getSupabaseClient();
    let query = supabase.from('kyc_verifications').select('*');

    // Filtrar por usuario si se provee el parámetro
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('[KYC DB Fetch Error]:', error);
      return NextResponse.json(
        { error: 'Error al consultar las solicitudes KYC.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('[KYC GET Route Error]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al consultar KYC.' },
      { status: 500 }
    );
  }
}
