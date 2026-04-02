import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { jwtVerify, createRemoteJWKSet, decodeProtectedHeader } from 'jose';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private jwks: any;

  constructor(private configService: ConfigService) {
    // Inicializamos el JWKS set usando la URL de tu proyecto de Supabase
    // El issuer que pasaste en el ejemplo es: https://dmchnftqmmtcxnqwetca.supabase.co/auth/v1
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL') || 'https://dmchnftqmmtcxnqwetca.supabase.co';
    const jwksUrl = new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`);
    this.jwks = createRemoteJWKSet(jwksUrl);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No Token Provided!');
    }

    const token = authHeader.split(' ')[1];

    try {
      // 1. Detectar el algoritmo del token
      const header = decodeProtectedHeader(token);
      const alg = header.alg;

      let payload: any;

      if (alg === 'ES256') {
        // 2a. Para ES256, usamos JWKS (descarga la clave pública automáticamente)
        const result = await jwtVerify(token, this.jwks, {
          algorithms: ['ES256'],
        });
        payload = result.payload;
      } else {
        // 2b. Fallback para HS256 (usando el secreto del .env)
        const jwtSecret = this.configService.get<string>('SUPABASE_JWT_SECRET');
        if (!jwtSecret) throw new UnauthorizedException('JWT Secret not found');
        const secret = new TextEncoder().encode(jwtSecret);
        const result = await jwtVerify(token, secret, {
          algorithms: ['HS256'],
        });
        payload = result.payload;
      }

      // 3. Mapear los campos de Supabase a lo que espera el UsuarioController
      const userMetadata = (payload.user_metadata as any) || {};

      request['user'] = {
        userId: payload.sub,
        email: payload.email,
        nombre: userMetadata.nombre || userMetadata.full_name || '',
        apellido: userMetadata.apellido || '',
        foto: userMetadata.foto || userMetadata.avatar_url || null,
        ...payload,
      };

      return true;
    } catch (error: any) {
      // Filtramos los errores conocidos de JWT
      if (error?.code === 'ERR_JWT_EXPIRED') {
        // No loguear, solo devolver el mensaje al cliente
        throw new UnauthorizedException('Token Expired');
      }

      if (error?.name === 'JWTInvalid') {
        // También conocido, no loguear
        throw new UnauthorizedException('Invalid Token');
      }

      // Solo loguear errores inesperados
      console.error('Unexpected JWT Error:', error);

      // Luego lanzamos la excepción para que el cliente reciba un 401 genérico
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
