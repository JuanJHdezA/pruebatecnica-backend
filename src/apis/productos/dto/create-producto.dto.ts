import { PTResponse } from '@common/dto/response.dto';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  NotEquals,
  IsArray,
  ArrayMinSize,
  IsBoolean
} from 'class-validator';

export class RegProductoDto {
  // Campos opcionales nuevos
  @IsInt()
  @IsOptional()
  @NotEquals(0, { message: 'El idProducto es obligatorio y no puede ser 0.' })
  idProducto?: number;

  // Campos opcionales nuevos
  @IsBoolean()
  @IsOptional()
  UpdateImg?: number;

  @IsString({ message: 'La urlImgAnterior del producto debe ser un texto válido.' })
  @IsOptional()
  urlImgAnterior?: string;

  @IsString({ message: 'La tipoArchivo del producto debe ser un texto válido.' })
  @IsOptional()
  tipoArchivo?: string;

  @IsString({ message: 'La codigoProducto del producto debe ser un texto válido.' })
  @IsOptional()
  codigoProducto?: string;

  @IsString({ message: 'El nombre del producto debe ser un texto válido.' })
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio.' })
  nombreProducto: string = '';

  @IsString({ message: 'El nombre del producto debe ser un texto válido.' })
  @IsOptional()
  descripcionProducto: string = '';

  @IsArray({ message: 'Las categorías deben ser una lista.' })
  @IsInt({ each: true, message: 'Cada categoría debe ser un ID numérico válido.' })
  @IsNotEmpty({ each: true, message: 'El ID de cada categoría no puede estar vacío.' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos una categoría.' })
  categorias: number[] = [];

  @IsInt({ message: 'El idMarca debe ser un número entero.' })
  @NotEquals(0, { message: 'El idMarca es obligatorio y no puede ser 0.' })
  idMarca: number = 0;

  @IsNumber({}, { message: 'El precio debe ser un número válido.' })
  @Min(0.01, { message: 'El precio debe ser mayor a cero.' })
  @IsNotEmpty({ message: 'El precio es obligatorio.' })
  precio: number = 0.01;

  @IsInt({ message: 'El stock debe ser un número entero.' })
  @Min(0, { message: 'El stock no puede ser negativo.' })
  @IsNotEmpty({ message: 'El stock es obligatorio.' })
  stock: number = 0;

  @IsArray({ message: 'Las categorías deben ser una lista.' })
  @IsInt({ each: true, message: 'Cada categoría debe ser un ID numérico válido.' })
  @IsNotEmpty({ each: true, message: 'El ID de cada categoría no puede estar vacío.' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos una categoría.' })
  tallas: number[] = [];

  @IsInt()
  @NotEquals(0, { message: 'El idEstatus es obligatorio y no puede ser 0.' })
  idEstatus: number = 0;

  @IsString({ message: 'La imagen del producto debe ser un base64' })
  @IsNotEmpty({ message: 'La imagen del producto es obligatorio.' })
  imagen: string = '';
}

export class UserResponseDto extends PTResponse<RegProductoDto> {}
