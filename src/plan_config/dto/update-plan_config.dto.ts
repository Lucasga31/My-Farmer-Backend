import { TipoPlan, NombreParametro } from 'src/plan_config/entities/plan_config.entity';

export class UpdatePlanConfigDto {
  Tipo_Plan?: TipoPlan;
  Nombre_Parametro?: NombreParametro;
  Valor?: number;
}
