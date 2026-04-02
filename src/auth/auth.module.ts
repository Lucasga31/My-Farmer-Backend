import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseAuthGuard } from './supabase-auth/supabase-auth.guard';
import { SupabaseService } from '../auth/supabase-storage/supabase.service';
import { FileUploadService } from '../auth/supabase-storage/file-upload.service';
import { SupabaseAuthService } from './supabase-auth/auth-password.service';

@Module({
  imports: [ConfigModule],
  providers: [
    SupabaseAuthGuard,
    SupabaseService,      // cliente Supabase
    FileUploadService,    // servicio reusable de archivos
    SupabaseAuthService
  ],
  exports: [
    SupabaseAuthGuard, 
    SupabaseService,
    FileUploadService,
    SupabaseAuthService
  ],
})
export class AuthModule {}