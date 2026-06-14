import { PTResponse } from '@common/dto/response.dto';
import { IsString, IsNotEmpty, IsNumber, IsInt, NotEquals } from 'class-validator';

export class DeleteProductoDto {
  // Campos opcionales nuevos
  @IsInt()
  @NotEquals(0, { message: 'El idProducto es obligatorio y no puede ser 0.' })
  @IsNumber()
  @IsNotEmpty()
  idProducto?: number;

  @IsString({ message: 'La urlImgAnterior del producto debe ser un texto válido.' })
  @IsNotEmpty()
  urlImagen?: string;
}

export class UserResponseDto extends PTResponse<DeleteProductoDto> {}
