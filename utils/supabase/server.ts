import { createClient } from '@/utils/supabase/server'

/**
 * Servicio general para interactuar con las tablas del Marketplace
 * utilizando el cliente de Supabase para el servidor.
 */
export async function obtenerPerfilUsuario(userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error al obtener el perfil:', error.message)
    return null
  }

  return data
}

export async function listarServiciosProfesionales() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('servicios')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al listar los servicios:', error.message)
    return []
  }

  return data
}
