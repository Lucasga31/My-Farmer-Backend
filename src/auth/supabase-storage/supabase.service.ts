import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // Tomamos las variables de entorno
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    // Si alguna no está definida, lanzamos un error y la app no arranca
    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Faltan las variables de entorno SUPABASE_URL o SUPABASE_KEY'
      );
    }

    // Creamos el cliente de Supabase
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Getter para acceder al cliente
  get client() {
    return this.supabase;
  }
}