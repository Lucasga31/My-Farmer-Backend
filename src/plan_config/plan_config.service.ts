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

  private toResponseDto(config: PlanConfig): ResponsePlanConfigDto {
    return {
      id: config.id,
      Tipo_Plan: config.Tipo_Plan,
      Nombre_Parametro: config.Nombre_Parametro,
      Valor: config.Valor,
      Registro: config.Registro,
    };
  }

  async findAll(): Promise<ResponsePlanConfigDto[]> {
    const configs = await this.planConfigRepository.find();
    return configs.map(c => this.toResponseDto(c));
  }

  async findLimite(tipoPlan: TipoPlan, parametro: NombreParametro): Promise<number> {
    const config = await this.planConfigRepository.findOne({
      where: { Tipo_Plan: tipoPlan, Nombre_Parametro: parametro },
    });
    if (!config) throw new NotFoundException('Configuración no encontrada');
    return config.Valor;
  }

  async create(datos: CreatePlanConfigDto): Promise<ResponsePlanConfigDto> {
    const config = this.planConfigRepository.create(datos);
    const guardado = await this.planConfigRepository.save(config);
    return this.toResponseDto(guardado);
  }

  async update(id: number, datos: UpdatePlanConfigDto): Promise<ResponsePlanConfigDto> {
    const config = await this.planConfigRepository.findOne({ where: { id } });
    if (!config) throw new NotFoundException('Configuración no encontrada');
    Object.assign(config, datos);
    const guardado = await this.planConfigRepository.save(config);
    return this.toResponseDto(guardado);
  }
}