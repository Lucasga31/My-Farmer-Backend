import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recordatorio, EntidadTipo } from './entities/recordatorio.entity';
import { Animal } from 'src/animal/entities/animal.entity';
import { Cultivo } from 'src/cultivo/entities/cultivo.entity';
import { PlanConfigService } from 'src/plan_config/plan_config.service';
import { UsuarioService } from '../usuario/usuario.service';
import { TipoPlan, NombreParametro } from '../plan_config/entities/plan_config.entity';
import { CreateRecordatorioDto } from './dto/create-recordatorio.dto';
import { UpdateRecordatorioDto } from './dto/update-recordatorio.dto';
import { ResponseRecordatorioDto } from './dto/response-recordatorio.dto';

@Injectable()
export class RecordatorioService {

  constructor(
    @InjectRepository(Recordatorio)
    private readonly recordatorioRepository: Repository<Recordatorio>,
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
    @InjectRepository(Cultivo)
    private readonly cultivoRepository: Repository<Cultivo>,
    private readonly planConfigService: PlanConfigService,
    private readonly usuarioService: UsuarioService,
  ) {}

  /**
   * Mapea una entidad Recordatorio a su DTO de respuesta.
   * @param recordatorio Entidad de recordatorio.
   * @returns DTO de respuesta.
   */
  private toResponseDto(recordatorio: Recordatorio): ResponseRecordatorioDto {
    return {
      Recordatorio_id: recordatorio.Recordatorio_id,
      Usuario_id: recordatorio.Usuario_id,
      Entidad_Tipo: recordatorio.Entidad_Tipo,
      Entidad_id: recordatorio.Entidad_id,
      Titulo: recordatorio.Titulo,
      Descripcion: recordatorio.Descripcion,
      Recordar: recordatorio.Recordar,
      Enviado: recordatorio.Enviado,
      Cancelado: recordatorio.Cancelado,
      Cancelado_En: recordatorio.Cancelado_En,
      Registro: recordatorio.Registro,
    };
  }

  /**
   * Obtiene todos los recordatorios pendientes (no enviados ni cancelados) de un usuario.
   * @param usuarioId ID del usuario.
   * @returns Lista de recordatorios ordenados por fecha de recordatorio.
   */
  async findByUsuario(usuarioId: number): Promise<ResponseRecordatorioDto[]> {
    const recordatorios = await this.recordatorioRepository.find({
      where: { Usuario_id: usuarioId, Cancelado: false, Enviado: false },
      order: { Recordar: 'ASC' },
    });
    return recordatorios.map(r => this.toResponseDto(r));
  }

  /**
   * Obtiene un recordatorio específico por su ID.
   * @param recordatorioId ID del recordatorio.
   * @param usuarioId ID del usuario propietario.
   * @returns DTO del recordatorio.
   * @throws NotFoundException si no existe.
   */
  async findOne(recordatorioId: number, usuarioId: number): Promise<ResponseRecordatorioDto> {
    const recordatorio = await this.recordatorioRepository.findOne({
      where: { Recordatorio_id: recordatorioId, Usuario_id: usuarioId },
    });
    if (!recordatorio) throw new NotFoundException('Recordatorio no encontrado');
    return this.toResponseDto(recordatorio);
  }

  /**
   * Crea un nuevo recordatorio para un animal o cultivo.
   * Valida los límites del plan del usuario y la existencia de la entidad asociada.
   * @param usuarioId ID del usuario.
   * @param datos Datos del recordatorio.
   * @returns Recordatorio creado en formato DTO.
   * @throws BadRequestException si se alcanza el límite del plan.
   * @throws NotFoundException si la entidad asociada no existe.
   */
  async create(usuarioId: number, datos: CreateRecordatorioDto): Promise<ResponseRecordatorioDto> {
    const usuario = await this.usuarioService.findEntityById(usuarioId);
    const tipoPlan = usuario.Premium ? TipoPlan.PREMIUM : TipoPlan.GRATUITO;
    const limite = await this.planConfigService.findLimite(tipoPlan, NombreParametro.MAX_RECORDATORIOS);
    const total = await this.recordatorioRepository.count({
      where: { Usuario_id: usuarioId, Enviado: false, Cancelado: false },
    });
    if (total >= limite) {
      throw new BadRequestException('Has alcanzado el límite de recordatorios de tu plan');
    }
    if (datos.Entidad_Tipo === EntidadTipo.ANIMAL) {
      const animal = await this.animalRepository.findOne({
        where: { Animal_id: datos.Entidad_id, Usuario_id: usuarioId, Eliminado: false },
      });
      if (!animal) throw new NotFoundException('Animal no encontrado');
    } else if (datos.Entidad_Tipo === EntidadTipo.CULTIVO) {
      const cultivo = await this.cultivoRepository.findOne({
        where: { Cultivo_id: datos.Entidad_id, Usuario_id: usuarioId, Eliminado: false },
      });
      if (!cultivo) throw new NotFoundException('Cultivo no encontrado');
    }
    const recordatorio = this.recordatorioRepository.create({ ...datos, Usuario_id: usuarioId });
    const guardado = await this.recordatorioRepository.save(recordatorio);
    return this.toResponseDto(guardado);
  }

  /**
   * Actualiza la información de un recordatorio existente.
   * @param recordatorioId ID del recordatorio.
   * @param usuarioId ID del usuario propietario.
   * @param datos Nuevos datos.
   * @returns Recordatorio actualizado en formato DTO.
   * @throws NotFoundException si no existe.
   */
  async update(recordatorioId: number, usuarioId: number, datos: UpdateRecordatorioDto): Promise<ResponseRecordatorioDto> {
    const recordatorio = await this.recordatorioRepository.findOne({
      where: { Recordatorio_id: recordatorioId, Usuario_id: usuarioId },
    });
    if (!recordatorio) throw new NotFoundException('Recordatorio no encontrado');
    Object.assign(recordatorio, datos);
    const guardado = await this.recordatorioRepository.save(recordatorio);
    return this.toResponseDto(guardado);
  }

  /**
   * Cancela todos los recordatorios pendientes asociados a una entidad específica.
   * Útil cuando se elimina o archiva un animal/cultivo.
   * @param entidadTipo Tipo de entidad (ANIMAL/CULTIVO).
   * @param entidadId ID de la entidad.
   */
  async cancelarPorEntidad(entidadTipo: EntidadTipo, entidadId: number): Promise<void> {
    await this.recordatorioRepository.update(
      { Entidad_Tipo: entidadTipo, Entidad_id: entidadId, Enviado: false, Cancelado: false },
      { Cancelado: true, Cancelado_En: new Date() },
    );
  }

  /**
   * Realiza la cancelación (eliminación lógica) de un recordatorio.
   * @param recordatorioId ID del recordatorio.
   * @param usuarioId ID del usuario propietario.
   * @throws NotFoundException si no existe.
   */
  async remove(recordatorioId: number, usuarioId: number): Promise<void> {
    const recordatorio = await this.recordatorioRepository.findOne({
      where: { Recordatorio_id: recordatorioId, Usuario_id: usuarioId },
    });
    if (!recordatorio) throw new NotFoundException('Recordatorio no encontrado');
    recordatorio.Cancelado = true;
    recordatorio.Cancelado_En = new Date();
    await this.recordatorioRepository.save(recordatorio);
  }

  /**
   * Procesa los recordatorios cuya fecha ya ha pasado para marcarlos como enviados.
   */
  async procesarPendientes(): Promise<void> {
    const ahora = new Date();
    const pendientes = await this.recordatorioRepository
      .createQueryBuilder('recordatorio')
      .where('recordatorio.Enviado = false')
      .andWhere('recordatorio.Cancelado = false')
      .andWhere('recordatorio.Recordar <= :ahora', { ahora })
      .getMany();

    for (const recordatorio of pendientes) {
      try {
        recordatorio.Enviado = true;
        await this.recordatorioRepository.save(recordatorio);
      } catch {
        recordatorio.Intentos += 1;
        recordatorio.Ultimo_Intento = new Date();
        await this.recordatorioRepository.save(recordatorio);
      }
    }
  }
}