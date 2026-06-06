import { supabase } from '../config/supabaseClient';

export interface Business {
  id: string;
  nombre: string;
  giro: string;
  direccion: string;
  horario: string;
  telefono?: string;
  rating: number;
  tags: string[];
  latitude: number;
  longitude: number;
  descripcion?: string;
  created_at?: string;
}

// Initial mock businesses in Durango, Mexico.
export const MOCK_BUSINESSES: Business[] = [
  {
    id: 'mock-1',
    nombre: 'La Esquina',
    giro: 'Tienda de abarrotes',
    direccion: 'Calle Juárez 204, Centro Histórico, Durango',
    horario: '08:00 - 21:00',
    telefono: '618-123-4567',
    rating: 4.5,
    tags: ['abarrotes', 'frutas'],
    latitude: 24.027729,
    longitude: -104.653027,
    descripcion: 'Tienda de abarrotes tradicional con frutas y verduras frescas del día.'
  },
  {
    id: 'mock-2',
    nombre: 'El Alambique',
    giro: 'Mezcalería',
    direccion: 'Calle Constitución 112, Centro Histórico, Durango',
    horario: '14:00 - 23:00',
    rating: 4.8,
    tags: ['mezcal', 'bebidas'],
    latitude: 24.028500,
    longitude: -104.654000,
    descripcion: 'Mezcalería artesanal donde degustar el mejor mezcal de Durango en un gran ambiente.'
  },
  {
    id: 'mock-3',
    nombre: 'Antojitos Doña María',
    giro: 'Comida tradicional',
    direccion: 'Av. 20 de Noviembre 156, Durango',
    horario: '07:00 - 15:00',
    telefono: '618-987-6543',
    rating: 4.9,
    tags: ['antojitos', 'comida_corrida'],
    latitude: 24.026000,
    longitude: -104.655000,
    descripcion: 'Gorditas de harina hechas a mano y antojitos tradicionales duranguenses con guisados caseros.'
  },
  {
    id: 'mock-4',
    nombre: 'Artesanías Tierra Alacrán',
    giro: 'Artesanías',
    direccion: 'Calle 5 de Febrero 302, Durango',
    horario: '09:00 - 19:30',
    telefono: '618-456-7890',
    rating: 4.7,
    tags: ['artesanías', 'souvenirs'],
    latitude: 24.027200,
    longitude: -104.651500,
    descripcion: 'Recuerdos típicos, llaveros y artículos decorativos con alacranes encapsulados y cuero.'
  }
];

const LOCAL_STORAGE_KEY = 'durango_local_businesses';

/**
 * Get all businesses from:
 * 1. Supabase (if configured)
 * 2. LocalStorage (businesses registered locally)
 * 3. Mock data (guarantees the map has content)
 */
export async function getBusinesses(): Promise<Business[]> {
  let supabaseBusinesses: Business[] = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('negocios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching businesses from Supabase:', error);
      } else if (data) {
        // Map Supabase fields to our Business model structure
        supabaseBusinesses = data.map((b: any) => ({
          id: b.id,
          nombre: b.nombre,
          giro: b.giro,
          direccion: b.direccion,
          horario: b.horario,
          telefono: b.telefono || undefined,
          rating: b.rating || 4.5,
          tags: b.tags || [],
          latitude: Number(b.latitude),
          longitude: Number(b.longitude),
          descripcion: b.descripcion || undefined,
          created_at: b.created_at
        }));
      }
    } catch (e) {
      console.error('Failed to contact Supabase server:', e);
    }
  }

  // Retrieve locally saved businesses
  let localBusinesses: Business[] = [];
  try {
    const rawLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (rawLocal) {
      localBusinesses = JSON.parse(rawLocal);
    }
  } catch (e) {
    console.error('Error parsing local storage businesses:', e);
  }

  // Combine lists, removing duplicates based on unique fields if necessary.
  // We place Supabase businesses first, then locally registered, then mocks.
  const combined = [...supabaseBusinesses, ...localBusinesses, ...MOCK_BUSINESSES];
  
  // Deduplicate by name + address to avoid double entries
  const seen = new Set<string>();
  return combined.filter(b => {
    const key = `${b.nombre.toLowerCase().trim()}|${b.direccion.toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Register a new business:
 * 1. Inserts into Supabase database (if configured)
 * 2. Saves to localStorage as backup/local registry
 */
export async function saveBusiness(business: Omit<Business, 'id' | 'rating'>): Promise<Business> {
  const newBusiness: Business = {
    ...business,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'local-' + Date.now(),
    rating: 4.5 + Math.random() * 0.5 // Random initial rating between 4.5 and 5.0
  };

  // 1. Try to save to Supabase
  let savedInCloud = false;
  if (supabase) {
    try {
      const dbPayload = {
        nombre: newBusiness.nombre,
        giro: newBusiness.giro,
        direccion: newBusiness.direccion,
        horario: newBusiness.horario,
        telefono: newBusiness.telefono || null,
        rating: newBusiness.rating,
        tags: newBusiness.tags,
        latitude: newBusiness.latitude,
        longitude: newBusiness.longitude,
        descripcion: newBusiness.descripcion || null
      };

      const { data, error } = await supabase
        .from('negocios')
        .insert([dbPayload])
        .select();

      if (error) {
        console.error('Error saving to Supabase:', error.message);
      } else if (data && data[0]) {
        savedInCloud = true;
        // Update newBusiness with the cloud generated ID
        newBusiness.id = data[0].id;
        newBusiness.created_at = data[0].created_at;
      }
    } catch (e) {
      console.error('Supabase connection error during save:', e);
    }
  }

  // 2. Save to localStorage to guarantee local presence
  try {
    const rawLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
    const localList: Business[] = rawLocal ? JSON.parse(rawLocal) : [];
    
    // Check if it already exists locally
    const exists = localList.some(
      b => b.nombre.toLowerCase() === newBusiness.nombre.toLowerCase() && 
           b.direccion.toLowerCase() === newBusiness.direccion.toLowerCase()
    );
    
    if (!exists) {
      localList.unshift(newBusiness);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localList));
    }
  } catch (e) {
    console.error('Error saving business to local storage:', e);
  }

  return newBusiness;
}
