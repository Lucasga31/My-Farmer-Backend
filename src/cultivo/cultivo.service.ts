import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cultivo, EstadoCultivo } from './entities/cultivo.entity';
import { HistorialCultivo } from 'src/historial_cultivo/entities/historial_cultivo.entity';
import { PlanConfigService } from 'src/plan_config/plan_config.service';
import { UsuarioService } from '../usuario/usuario.service';
import { TipoCultivoService } from 'src/tipo_cultivo/tipo_cultivo.service';
import { ParcelaService } from '../parcela/parcela.service';
import { TipoPlan, NombreParametro } from '../plan_config/entities/plan_config.entity';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';
import { ResponseCultivoDto } from './dto/response-cultivo.dto';
import { FileUploadService } from 'src/auth/supabase-storage/file-upload.service';

@Injectable()
export class CultivoService {

  constructor(
    @InjectRepository(Cultivo)
    private readonly cultivoRepository: Repository<Cultivo>,
    @InjectRepository(HistorialCultivo)
    private readonly historialRepository: Repository<HistorialCultivo>,
    private readonly planConfigService: PlanConfigService,
    private readonly usuarioService: UsuarioService,
    private readonly tipoCultivoService: TipoCultivoService,
    private readonly parcelaService: ParcelaService,
    private readonly fileUploadService: FileUploadService,
  ) { }

  // ─── Mapeo a DTO ───────────────────────────────────────────────

  /**
   * Convierte una entidad Cultivo a su DTO de respuesta.
   * @param cultivo Entidad de cultivo.
   * @returns DTO de respuesta.
   */
  private toResponseDto(cultivo: Cultivo): ResponseCultivoDto {
    return {
      Cultivo_id: cultivo.Cultivo_id,
      Nombre: cultivo.Nombre,
      Estado: cultivo.Estado,
      Fecha_Siembra: cultivo.Fecha_Siembra,
      Fecha_Cosecha_Estimada: cultivo.Fecha_Cosecha_Estimada,
      Fecha_Cosecha: cultivo.Fecha_Cosecha,
      Rendimiento_Estimado: cultivo.Rendimiento_Estimado,
      Rendimiento_Unidad: cultivo.Rendimiento_Unidad,
      Notas: cultivo.Notas,
      Foto: cultivo.Foto,
      Activo: cultivo.Activo,
      Registro: cultivo.Registro,
      Actualizado: cultivo.Actualizado,
      Tipo_Cultivo: cultivo.TipoCultivo?.Nombre ?? null,
      Parcela: cultivo.Parcela?.Nombre ?? null,
    };
  }

  /**
   * Busca un cultivo específico por su ID y el ID del usuario.
   * @param cultivoId ID del cultivo.
   * @param usuarioId ID del usuario propietario.
   * @returns Entidad Cultivo.
   * @throws NotFoundException si no se encuentra o está eliminado.
   */
  private async findEntity(cultivoId: number, usuarioId: number): Promise<Cultivo> {
    const cultivo = await this.cultivoRepository.findOne({
      where: { Cultivo_id: cultivoId, Usuario_id: usuarioId, Eliminado: false },
      relations: ['TipoCultivo', 'Parcela'],
    });
    if (!cultivo) throw new NotFoundException('Cultivo no encontrado');
    return cultivo;
  }

  // ─── Consultas ─────────────────────────────────────────────────

  /**
   * Obtiene todos los cultivos activos de un usuario.
   * @param usuarioId ID del usuario.
   * @returns Lista de cultivos activos en formato DTO.
   */
  async findActivos(usuarioId: number): Promise<ResponseCultivoDto[]> {
    const cultivos = await this.cultivoRepository.find({
      where: { Usuario_id: usuarioId, Activo: true, Eliminado: false },
      relations: ['TipoCultivo', 'Parcela'],
      order: { Registro: 'DESC' },
    });
    return cultivos.map(c => this.toResponseDto(c));
  }

  /**
   * Obtiene los cultivos históricos (no activos) de un usuario.
   * @param usuarioId ID del usuario.
   * @returns Lista de cultivos históricos en formato DTO.
   */
  async findHistoricos(usuarioId: number): Promise<ResponseCultivoDto[]> {
    const cultivos = await this.cultivoRepository.find({
      where: { Usuario_id: usuarioId, Activo: false, Eliminado: false },
      relations: ['TipoCultivo', 'Parcela'],
      order: { Registro: 'DESC' },
    });
    return cultivos.map(c => this.toResponseDto(c));
  }

  /**
   * Obtiene la información detallada de un cultivo por su ID.
   * @param cultivoId ID del cultivo.
   * @param usuarioId ID del usuario propietario.
   * @returns DTO del cultivo.
   */
  async findOne(cultivoId: number, usuarioId: number): Promise<ResponseCultivoDto> {
    const cultivo = await this.findEntity(cultivoId, usuarioId);
    return this.toResponseDto(cultivo);
  }

  // ─── Crear ─────────────────────────────────────────────────────

  /**
   * Registra un nuevo cultivo para un usuario.
   * Valida los límites del plan del usuario y la existencia de tipos de cultivo y parcelas.
   * @param usuarioId ID del usuario.
   * @param datos Datos del nuevo cultivo.
   * @param file (Opcional) Foto del cultivo.
   * @returns Cultivo creado en formato DTO.
   * @throws BadRequestException si se alcanza el límite del plan.
   */
  async create(usuarioId: number, datos: CreateCultivoDto, file?: File,): Promise<ResponseCultivoDto> {
    const usuario = await this.usuarioService.findEntityById(usuarioId);
    const tipoPlan = usuario.Premium ? TipoPlan.PREMIUM : TipoPlan.GRATUITO;
    const limite = await this.planConfigService.findLimite(tipoPlan, NombreParametro.MAX_CULTIVOS);
    const total = await this.cultivoRepository.count({
      where: { Usuario_id: usuarioId, Activo: true, Eliminado: false },
    });
    if (total >= limite) {
      throw new BadRequestException('Has alcanzado el límite de cultivos de tu plan');
    }
    if (datos.Tipo_Cultivo_id) {
      await this.tipoCultivoService.findOne(datos.Tipo_Cultivo_id);
    }
    if (datos.Parcela_id) {
      await this.parcelaService.findEntity(datos.Parcela_id, usuarioId);
    }
    if (file) {
      datos.Foto = await this.fileUploadService.uploadFile(file, 'cultivos');
    }
    const cultivo = this.cultivoRepository.create({ ...datos, Usuario_id: usuarioId });
    const guardado = await this.cultivoRepository.save(cultivo);
    return this.findOne(guardado.Cultivo_id, usuarioId);
  }

  // ─── Actualizar ────────────────────────────────────────────────

  /**
   * Actualiza la información de un cultivo existente.
   * Incluye auditoría de cambios y validaciones de estados y fechas.
   * @param cultivoId ID del cultivo.
   * @param usuarioId ID del usuario propietario.
   * @param datos Nuevos datos del cultivo.
   * @param file (Opcional) Nueva foto.
   * @returns Cultivo actualizado en formato DTO.
   * @throws BadRequestException si las transiciones de estado o fechas son inválidas.
   */
  async update(cultivoId: number, usuarioId: number, datos: UpdateCultivoDto, file?: File,): Promise<ResponseCultivoDto> {

    const cultivo = await this.findEntity(cultivoId, usuarioId);

    if (datos.Estado === EstadoCultivo.EN_CRECIMIENTO && cultivo.Estado === EstadoCultivo.COSECHADO) {
      throw new BadRequestException('No se puede cambiar de cosechado a en crecimiento');
    }

    if (datos.Fecha_Cosecha && cultivo.Fecha_Siembra) {
      if (new Date(datos.Fecha_Cosecha) < new Date(cultivo.Fecha_Siembra)) {
        throw new BadRequestException('La fecha de cosecha no puede ser anterior a la de siembra');
      }
    }

    if (datos.Fecha_Cosecha_Estimada && cultivo.Fecha_Siembra) {
      if (new Date(datos.Fecha_Cosecha_Estimada) < new Date(cultivo.Fecha_Siembra)) {
        throw new BadRequestException('La fecha estimada de cosecha no puede ser anterior a la de siembra');
      }
    }

    if (datos.Estado === EstadoCultivo.COSECHADO) {
      datos.Activo = false;
    }

    if (datos.Tipo_Cultivo_id) {
      await this.tipoCultivoService.findOne(datos.Tipo_Cultivo_id);
    }

    if (datos.Parcela_id) {
      await this.parcelaService.findEntity(datos.Parcela_id, usuarioId);
    }

    // ── SUBIDA DESPUÉS DE VALIDACIONES ──
    if (file) {
      datos.Foto = await this.fileUploadService.uploadFile(file, 'cultivos');
    }

    const camposAuditables: (keyof UpdateCultivoDto)[] = [
      'Nombre', 'Estado', 'Fecha_Siembra', 'Fecha_Cosecha_Estimada',
      'Fecha_Cosecha', 'Rendimiento_Estimado', 'Rendimiento_Unidad',
      'Notas', 'Foto', 'Parcela_id', 'Tipo_Cultivo_id',
    ];

    const camposNumericos: (keyof UpdateCultivoDto)[] = ['Rendimiento_Estimado'];

    for (const campo of camposAuditables) {
      const valorAnterior = cultivo[campo];
      const valorNuevo = datos[campo];
      if (valorNuevo === undefined) continue;

      const esNumerico = camposNumericos.includes(campo);
      const sinCambio = esNumerico
        ? parseFloat(String(valorAnterior)) === parseFloat(String(valorNuevo))
        : String(valorAnterior) === String(valorNuevo);

      if (!sinCambio) {
        const historial = this.historialRepository.create({
          Cultivo_id: cultivoId,
          Campo_Mod: campo,
          Valor_Ant: String(valorAnterior),
          Valor_Nue: String(valorNuevo),
        });

        await this.historialRepository.save(historial);
      }
    }

    Object.assign(cultivo, datos);
    await this.cultivoRepository.save(cultivo);

    return this.findOne(cultivoId, usuarioId);
  }

  // ─── Eliminar ──────────────────────────────────────────────────

  /**
   * Realiza la eliminación lógica de un cultivo.
   * @param cultivoId ID del cultivo.
   * @param usuarioId ID del usuario propietario.
   */
  async remove(cultivoId: number, usuarioId: number): Promise<void> {
    const cultivo = await this.findEntity(cultivoId, usuarioId);
    cultivo.Eliminado = true;
    cultivo.Activo = false;
    await this.cultivoRepository.save(cultivo);
  }
}