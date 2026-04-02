import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenRefresco } from './entities/token_refresco.entity';
import { CreateTokenRefrescoDto } from './dto/create-token_refresco.dto';
import { ResponseTokenRefrescoDto } from './dto/response-token_refresco.dto';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class TokenRefrescoService {

  constructor(
    @InjectRepository(TokenRefresco)
    private readonly tokenRepository: Repository<TokenRefresco>,
    private readonly usuarioService: UsuarioService,
  ) {}

  private toResponseDto(token: TokenRefresco): ResponseTokenRefrescoDto {
    return {
      id: token.id,
      Usuario_id: token.Usuario_id,
      Expira: token.Expira,
      Revocado: token.Revocado,
      Registro: token.Registro,
    };
  }

  async findByHash(tokenHash: string): Promise<TokenRefresco | null> {
    return this.tokenRepository.findOne({
      where: { Token_Hash: tokenHash, Revocado: false },
    });
  }

  async findByUsuario(usuarioId: number): Promise<ResponseTokenRefrescoDto[]> {
    const tokens = await this.tokenRepository.find({
      where: { Usuario_id: usuarioId, Revocado: false },
    });
    return tokens.map(t => this.toResponseDto(t));
  }

  async create(datos: CreateTokenRefrescoDto): Promise<ResponseTokenRefrescoDto> {
    await this.usuarioService.findEntityById(datos.Usuario_id);
    const token = this.tokenRepository.create(datos);
    const guardado = await this.tokenRepository.save(token);
    return this.toResponseDto(guardado);
  }

  async revocar(tokenId: number): Promise<void> {
    const token = await this.tokenRepository.findOne({
      where: { id: tokenId },
    });
    if (!token) throw new NotFoundException('Token no encontrado');
    token.Revocado = true;
    await this.tokenRepository.save(token);
  }

  async revocarTodosDeUsuario(usuarioId: number): Promise<void> {
    await this.usuarioService.findEntityById(usuarioId);
    await this.tokenRepository.update(
      { Usuario_id: usuarioId, Revocado: false },
      { Revocado: true },
    );
  }
}