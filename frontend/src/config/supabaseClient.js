import { createClient } from '@supabase/supabase-js';

// Cargamos las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificación rápida
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Fallo en las variables de entorno");
}

// Inicializamos y exportamos el cliente de forma segura
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;