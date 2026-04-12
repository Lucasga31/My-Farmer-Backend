import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AnimalModule } from './animal/animal.module';
import { UsuarioModule } from './usuario/usuario.module';
import { TokenRefrescoModule } from './token_refresco/token_refresco.module';
import { TokenRecuperacionModule } from './token_recuperacion/token_recuperacion.module';
import { PlanConfigModule } from './plan_config/plan_config.module';
import { SuscripcionModule } from './suscripcion/suscripcion.module';
import { CategoriaAnimalModule } from './categoria_animal/categoria_animal.module';
import { HistorialAnimalModule } from './historial_animal/historial_animal.module';
import { ParcelaModule } from './parcela/parcela.module';
import { TipoCultivoModule } from './tipo_cultivo/tipo_cultivo.module';
import { CultivoModule } from './cultivo/cultivo.module';
import { HistorialCultivoModule } from './historial_cultivo/historial_cultivo.module';
import { CrecimientoModule } from './crecimiento/crecimiento.module';
import { CosechaModule } from './cosecha/cosecha.module';
import { RecordatorioModule } from './recordatorio/recordatorio.module';
import { EventoAnimalModule } from './evento_animal/evento_animal.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        charset: 'utf8mb4',
      }),
    }),
    AnimalModule,
    UsuarioModule,
    TokenRefrescoModule,
    TokenRecuperacionModule,
    PlanConfigModule,
    SuscripcionModule,
    CategoriaAnimalModule,
    HistorialAnimalModule,
    ParcelaModule,
    TipoCultivoModule,
    CultivoModule,
    HistorialCultivoModule,
    CrecimientoModule,
    CosechaModule,
    RecordatorioModule,
    EventoAnimalModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}