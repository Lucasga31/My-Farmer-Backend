import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanConfig, TipoPlan, NombreParametro } from '../plan_config/entities/plan_config.entity';
import { CreatePlanConfigDto } from './dto/create-plan_config.dto';
import { UpdatePlanConfigDto } from './dto/update-plan_config.dto';
import { ResponsePlanConfigDto } from './dto/response-plan_config.dto';

@Injectable()
export class PlanConfigService {

  constructor(
    @InjectRepository(PlanConfig)
    private readonly planConfigRepository: Repository<PlanConfig>,
  ) {}

  /**
   * Mapea una entidad PlanConfig a su DTO de respuesta.
   * @param config Entidad de configuración de plan.
   * @returns DTO de respuesta.
   */
  private toResponseDto(config: PlanConfig): ResponsePlanConfigDto {
    return {
      id: config.id,
      Tipo_Plan: config.Tipo_Plan,
      Nombre_Parametro: config.Nombre_Parametro,
      Valor: config.Valor,
      Registro: config.Registro,
    };
  }

  /**
   * Obtiene todas las configuraciones de planes disponibles.
   * @returns Lista de configuraciones en formato DTO.
   */
  async findAll(): Promise<ResponsePlanConfigDto[]> {
    const configs = await this.planConfigRepository.find();
    return configs.map(c => this.toResponseDto(c));
  }

  /**
   * Busca el valor de un límite específico según el tipo de plan y el parámetro.
   * @param tipoPlan Tipo de plan (GRATUITO, PREMIUM, etc).
   * @param parametro Nombre del parámetro a consultar (MAX_ANIMALES, etc).
   * @returns Valor numérico del límite.
   * @throws NotFoundException si la configuración no existe.
   */
  async findLimite(tipoPlan: TipoPlan, parametro: NombreParametro): Promise<number> {
    const config = await this.planConfigRepository.findOne({
      where: { Tipo_Plan: tipoPlan, Nombre_Parametro: parametro },
    });
    if (!config) throw new NotFoundException('Configuración no encontrada');
    return config.Valor;
  }

  /**
   * Crea una nueva configuración de plan.
   * @param datos Datos de la configuración.
   * @returns Configuración creada en formato DTO.
   */
  async create(datos: CreatePlanConfigDto): Promise<ResponsePlanConfigDto> {
    const config = this.planConfigRepository.create(datos);
    const guardado = await this.planConfigRepository.save(config);
    return this.toResponseDto(guardado);
  }

  /**
   * Actualiza una configuración de plan existente.
   * @param id ID de la configuración.
   * @param datos Nuevos datos.
   * @returns Configuración actualizada en formato DTO.
   * @throws NotFoundException si la configuración no existe.
   */
  async update(id: number, datos: UpdatePlanConfigDto): Promise<ResponsePlanConfigDto> {
    const config = await this.planConfigRepository.findOne({ where: { id } });
    if (!config) throw new NotFoundException('Configuración no encontrada');
    Object.assign(config, datos);
    const guardado = await this.planConfigRepository.save(config);
    return this.toResponseDto(guardado);
  }
}