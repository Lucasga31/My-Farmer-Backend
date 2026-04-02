import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { TokenRecuperacion } from './entities/token_recuperacion.entity';
import { ResponseTokenRecuperacionDto } from './dto/response-token_recuperacion.dto';

@Injectable()
export class TokenRecuperacionService {
  constructor(
    @InjectRepository(TokenRecuperacion)
    private readonly tokenRepository: Repository<TokenRecuperacion>,
  ) {}

  // ─── Mapeo a DTO ───────────────────────────────────────────────

  private toResponseDto(token: TokenRecuperacion): ResponseTokenRecuperacionDto {
    return {
      id: token.id,
      Usuario_id: token.Usuario_id,
      Expira: token.Expira,
      Usado_En: token.Usado_En,
      Registro: token.Registro,
      Token: token.Token
    };
  }

  // ─── Generación de PIN ─────────────────────────────────────────

  private generarPin(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private calcularExpiracion(): Date {
    const expira = new Date();
    expira.setMinutes(expira.getMinutes() + 15); // ⚡ 15 min recomendado
    return expira;
  }

  // ─── Crear PIN ─────────────────────────────────────────────────

  async create(usuarioId: number): Promise<ResponseTokenRecuperacionDto> {
    // 🔥 Invalidar tokens anteriores
    await this.tokenRepository.update(
      { Usuario_id: usuarioId, Usado_En: IsNull() },
      { Usado_En: new Date() },
    );

    const token = this.tokenRepository.create({
      Usuario_id: usuarioId,
      Token: this.generarPin(),
      Expira: this.calcularExpiracion(),
      Intentos: 0, // ⚡ importante
    });

    const guardado = await this.tokenRepository.save(token);
    return this.toResponseDto(guardado);
  }

  // ─── Validar PIN ───────────────────────────────────────────────

  async validarPin(pin: string, usuarioId: number): Promise<TokenRecuperacion> {
    const token = await this.tokenRepository.findOne({
      where: {
        Token: pin,
        Usuario_id: usuarioId,
        Usado_En: IsNull(),
      },
      order: { Registro: 'DESC' }, // 🔥 el más reciente
    });

    if (!token) throw new BadRequestException('PIN incorrecto');

    // 🔥 Control de intentos
    if (token.Intentos >= 5) {
      throw new BadRequestException('Demasiados intentos, solicita un nuevo código');
    }

    token.Intentos++;
    await this.tokenRepository.save(token);

    if (new Date() > token.Expira) {
      throw new BadRequestException('El PIN ha expirado');
    }

    return token;
  }

  // ─── Marcar como usado ─────────────────────────────────────────

  async marcarComoUsado(token: TokenRecuperacion): Promise<void> {
    token.Usado_En = new Date();
    await this.tokenRepository.save(token);

    // 🔥 Opcional: invalidar todos los demás tokens activos
    await this.tokenRepository.update(
      { Usuario_id: token.Usuario_id, Usado_En: IsNull() },
      { Usado_En: new Date() },
    );
  }

  // ─── Buscar token (opcional debug/admin) ───────────────────────

  async findByPin(pin: string): Promise<ResponseTokenRecuperacionDto> {
    const token = await this.tokenRepository.findOne({
      where: { Token: pin },
    });

    if (!token) throw new NotFoundException('PIN no encontrado');
    return this.toResponseDto(token);
  }
}