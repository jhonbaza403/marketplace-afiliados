import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase URL o Anon Key faltantes. Asegúrate de configurarlas en el archivo .env.local y en Vercel.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
