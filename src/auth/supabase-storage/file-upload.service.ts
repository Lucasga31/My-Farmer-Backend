import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { File } from 'multer';

@Injectable()
export class FileUploadService {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Sube un archivo a Supabase Storage y devuelve la URL pública
   */
  async uploadFile(file: File | undefined, bucket: string): Promise<string | null> {
    if (!file) return null;

    const fileName = `${Date.now()}_${file.originalname}`;

    // Subir archivo
    const { data, error } = await this.supabaseService.client
      .storage
      .from(bucket)
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (error) throw new Error(`Error al subir archivo: ${error.message}`);

    // Obtener URL pública
    const publicData = this.supabaseService.client
      .storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicData.data.publicUrl || null;
  }
}