import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PlanConfigService } from './plan_config.service';
import { CreatePlanConfigDto } from './dto/create-plan_config.dto';
import { UpdatePlanConfigDto } from './dto/update-plan_config.dto';
import { ResponsePlanConfigDto } from './dto/response-plan_config.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';

@Controller('plan-config')
export class PlanConfigController {
  constructor(private readonly planConfigService: PlanConfigService) {}

  /**
   * GET /plan-config
   * Retorna todas las configuraciones de planes.
   * Params: ninguno
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get()
  async findAll(): Promise<ResponsePlanConfigDto[]> {
    return this.planConfigService.findAll();
  }

  /**
   * POST /plan-config
   * Crea una nueva configuración de plan.
   * Body:
   * {
   *   "Tipo_Plan": "premium",                    premium, gratuito
   *   "Nombre_Parametro": "maxCultivos",       maxRecordatorios, maxCultivos, maxAnimales    
   *   "Valor": 50
   * }
   * Headers: Authorization: Bearer <token>, Content-Type: application/json
   */
  @UseGuards(SupabaseAuthGuard)
  @Post()
  async create(
    @Body() datos: CreatePlanConfigDto,
  ): Promise<ResponsePlanConfigDto> {
    return this.planConfigService.create(datos);
  }

  /**
   * PATCH /plan-config/:id
   * Actualiza una configuración de plan.
   * Params:
   *  - id (obligatorio): ID de la configuración
   * Body:
   * {
   *   "Valor": 100
   * }
   * Headers: Authorization: Bearer <token>, Content-Type: application/json
   */
  @UseGuards(SupabaseAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: UpdatePlanConfigDto,
  ): Promise<ResponsePlanConfigDto> {
    return this.planConfigService.update(id, datos);
  }
}