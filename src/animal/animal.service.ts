import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from './entities/animal.entity';
import { HistorialAnimal } from 'src/historial_animal/entities/historial_animal.entity';
import { PlanConfigService } from 'src/plan_config/plan_config.service';
import { UsuarioService } from '../usuario/usuario.service';
import { CategoriaAnimalService } from 'src/categoria_animal/categoria_animal.service';
import { ParcelaService } from '../parcela/parcela.service';
import { EventoAnimalService } from 'src/evento_animal/evento_animal.service';
import { TipoPlan, NombreParametro } from '../plan_config/entities/plan_config.entity';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { ResponseAnimalDto } from './dto/response-animal.dto';
import { FileUploadService } from 'src/auth/supabase-storage/file-upload.service';

@Injectable()
export class AnimalService {

  constructor(
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
    @InjectRepository(HistorialAnimal)
    private readonly historialRepository: Repository<HistorialAnimal>,
    private readonly planConfigService: PlanConfigService,
    private readonly usuarioService: UsuarioService,
    private readonly categoriaAnimalService: CategoriaAnimalService,
    private readonly parcelaService: ParcelaService,
    private readonly eventoAnimalService: EventoAnimalService,
    private readonly fileUploadService: FileUploadService,
  ) { }

  // ─── Mapeo a DTO ───────────────────────────────────────────────

  /**
   * Convierte una entidad Animal a su respectivo Data Transfer Object (DTO) de respuesta.
   * @param animal Entidad animal a convertir.
   * @returns DTO con la información formateada para el cliente.
   */
  private toResponseDto(animal: Animal): ResponseAnimalDto {
    return {
      Animal_id: animal.Animal_id,
      Nombre: animal.Nombre,
      Raza: animal.Raza,
      Sexo: animal.Sexo,
      Color: animal.Color,
      Fecha_Nacimiento: animal.Fecha_Nacimiento,
      Peso: animal.Peso,
      Peso_Unidad: animal.Peso_Unidad,
      Altura: animal.Altura,
      Estado_Label: animal.Estado_Label,
      Notas: animal.Notas,
      Estado: animal.Estado,
      Foto: animal.Foto,
      Registro: animal.Registro,
      Actualizado: animal.Actualizado,
      Categoria: animal.CategoriaAnimal?.Nombre ?? null,
      Parcela: animal.Parcela?.Nombre ?? null,
    };
  }

  /**
   * Busca un animal específico por su ID y el ID del usuario, asegurando que no esté eliminado.
   * @param animalId ID del animal a buscar.
   * @param usuarioId ID del usuario propietario.
   * @returns La entidad Animal si es encontrada.
   * @throws NotFoundException si el animal no existe o no pertenece al usuario.
   */
  private async findEntity(animalId: number, usuarioId: number): Promise<Animal> {
    const animal = await this.animalRepository.findOne({
      where: { Animal_id: animalId, Usuario_id: usuarioId, Eliminado: false },
      relations: ['CategoriaAnimal', 'Parcela'],
    });
    if (!animal) throw new NotFoundException('Animal no encontrado');
    return animal;
  }

  // ─── Consultas ─────────────────────────────────────────────────

  /**
   * Obtiene todos los animales activos de un usuario específico.
   * @param usuarioId ID del usuario propietario.
   * @returns Lista de animales en formato DTO.
   */
  async findAll(usuarioId: number): Promise<ResponseAnimalDto[]> {
    const animales = await this.animalRepository.find({
      where: { Usuario_id: usuarioId, Estado: true, Eliminado: false },
      relations: ['CategoriaAnimal', 'Parcela'],
      order: { Registro: 'DESC' },
    });
    return animales.map(a => this.toResponseDto(a));
  }

  /**
   * Obtiene la información detallada de un animal por su ID.
   * @param animalId ID del animal.
   * @param usuarioId ID del usuario propietario.
   * @returns El animal solicitado en formato DTO.
   */
  async findOne(animalId: number, usuarioId: number): Promise<ResponseAnimalDto> {
    const animal = await this.findEntity(animalId, usuarioId);
    return this.toResponseDto(animal);
  }

  /**
   * Busca animales aplicando filtros opcionales como nombre, color y categoría.
   * @param usuarioId ID del usuario propietario.
   * @param nombre (Opcional) Filtro por nombre.
   * @param color (Opcional) Filtro por color.
   * @param categoriaId (Opcional) Filtro por ID de categoría.
   * @param limit Límite de resultados (por defecto 20, máximo 100).
   * @returns Lista de animales filtrados en formato DTO.
   */
  async buscar(
    usuarioId: number,
    nombre?: string,
    color?: string,
    categoriaId?: number,
    limit: number = 20,
  ): Promise<ResponseAnimalDto[]> {
    const limiteFinal = Math.min(limit, 100);
    const query = this.animalRepository
      .createQueryBuilder('animal')
      .leftJoinAndSelect('animal.CategoriaAnimal', 'categoria')
      .leftJoinAndSelect('animal.Parcela', 'parcela')
      .where('animal.Usuario_id = :usuarioId', { usuarioId })
      .andWhere('animal.Estado = true')
      .andWhere('animal.Eliminado = false');

    if (nombre) {
      query.andWhere('LOWER(animal.Nombre) LIKE LOWER(:nombre)', { nombre: `%${nombre}%` });
    }
    if (color) {
      query.andWhere('LOWER(animal.Color) LIKE LOWER(:color)', { color: `%${color}%` });
    }
    if (categoriaId) {
      query.andWhere('animal.Categoria_Animal_id = :categoriaId', { categoriaId });
    }

    const animales = await query.orderBy('animal.Nombre', 'ASC').take(limiteFinal).getMany();
    return animales.map(a => this.toResponseDto(a));
  }

  // ─── Crear ─────────────────────────────────────────────────────

  /**
   * Registra un nuevo animal en el sistema.
   * Valida los límites del plan del usuario, la unicidad del nombre y la existencia de categorías/parcelas.
   * @param usuarioId ID del usuario que crea el animal.
   * @param datos Datos del nuevo animal.
   * @param file (Opcional) Archivo de imagen para el animal.
   * @returns El animal creado en formato DTO.
   * @throws BadRequestException si se alcanza el límite del plan o el nombre ya existe.
   */
  async create(usuarioId: number, datos: CreateAnimalDto, file?: File): Promise<ResponseAnimalDto> {
    const usuario = await this.usuarioService.findEntityById(usuarioId);

    // Validaciones primero
    const tipoPlan = usuario.Premium ? TipoPlan.PREMIUM : TipoPlan.GRATUITO;
    const limite = await this.planConfigService.findLimite(tipoPlan, NombreParametro.MAX_ANIMALES);
    const total = await this.animalRepository.count({
      where: { Usuario_id: usuarioId, Estado: true, Eliminado: false },
    });
    if (total >= limite) throw new BadRequestException('Has alcanzado el límite de animales de tu plan');

    const nombreExiste = await this.animalRepository.findOne({
      where: { Usuario_id: usuarioId, Nombre: datos.Nombre, Eliminado: false },
    });
    if (nombreExiste) throw new BadRequestException('Ya tienes un animal con ese nombre');

    await this.categoriaAnimalService.findOne(datos.Categoria_Animal_id);
    if (datos.Parcela_id) {
      await this.parcelaService.findEntity(datos.Parcela_id, usuarioId);
    }

    // ── SUBIDA DE IMAGEN SOLO SI TODO ES VÁLIDO ──
    if (file) {
      datos.Foto = await this.fileUploadService.uploadFile(file, 'animales');
    }

    const animal = this.animalRepository.create({ ...datos, Usuario_id: usuarioId });
    const guardado = await this.animalRepository.save(animal);
    return this.findOne(guardado.Animal_id, usuarioId);
  }

  // ─── Actualizar ────────────────────────────────────────────────

  /**
   * Actualiza la información de un animal existente.
   * Realiza auditoría de cambios guardando el historial de las modificaciones.
   * @param animalId ID del animal a actualizar.
   * @param usuarioId ID del usuario propietario.
   * @param datos Nuevos datos del animal.
   * @param file (Opcional) Nueva imagen para el animal.
   * @returns El animal actualizado en formato DTO.
   */
  async update(
    animalId: number,
    usuarioId: number,
    datos: UpdateAnimalDto,
    file?: File,
  ): Promise<ResponseAnimalDto> {
    const animal = await this.findEntity(animalId, usuarioId);

    // Validaciones de nombre
    if (datos.Nombre && datos.Nombre !== animal.Nombre) {
      const nombreExiste = await this.animalRepository.findOne({
        where: { Usuario_id: usuarioId, Nombre: datos.Nombre, Eliminado: false },
      });
      if (nombreExiste) throw new BadRequestException('Ya tienes un animal con ese nombre');
    }

    // Validar categoria y parcela
    if (datos.Categoria_Animal_id) {
      await this.categoriaAnimalService.findOne(datos.Categoria_Animal_id);
    }
    if (datos.Parcela_id) {
      await this.parcelaService.findEntity(datos.Parcela_id, usuarioId);
    }

    // ── SUBIDA DE IMAGEN SOLO SI TODO ES VÁLIDO ──
    if (file) {
      datos.Foto = await this.fileUploadService.uploadFile(file, 'animales');
    }

    // Guardar historial de cambios
    const camposAuditables: (keyof UpdateAnimalDto)[] = [
      'Nombre', 'Raza', 'Sexo', 'Color', 'Fecha_Nacimiento',
      'Peso', 'Peso_Unidad', 'Altura', 'Estado_Label', 'Notas',
      'Estado', 'Parcela_id', 'Categoria_Animal_id', 'Foto',
    ];

    const camposNumericos: (keyof UpdateAnimalDto)[] = ['Peso', 'Altura'];

    for (const campo of camposAuditables) {
      const valorAnterior = animal[campo];
      const valorNuevo = datos[campo];
      if (valorNuevo === undefined) continue;

      const esNumerico = camposNumericos.includes(campo);
      const sinCambio = esNumerico
        ? parseFloat(String(valorAnterior)) === parseFloat(String(valorNuevo))
        : String(valorAnterior) === String(valorNuevo);

      if (!sinCambio) {
        const historial = this.historialRepository.create({
          Animal_id: animalId,
          Campo_Mod: campo,
          Valor_Ant: String(valorAnterior),
          Valor_Nue: String(valorNuevo),
        });
        await this.historialRepository.save(historial);
      }
    }

    // Actualizar y guardar
    Object.assign(animal, datos);
    await this.animalRepository.save(animal);

    return this.findOne(animalId, usuarioId);
  }

  // ─── Eliminar ──────────────────────────────────────────────────

  /**
   * Realiza una eliminación lógica de un animal.
   * Marca el animal como inactivo y eliminado, y limpia sus eventos asociados.
   * @param animalId ID del animal a eliminar.
   * @param usuarioId ID del usuario propietario.
   */
  async remove(animalId: number, usuarioId: number): Promise<void> {
    const animal = await this.findEntity(animalId, usuarioId);
    animal.Estado = false;
    animal.Eliminado = true;
    await this.animalRepository.save(animal);
    await this.eventoAnimalService.eliminarPorAnimal(animalId);
  }
}