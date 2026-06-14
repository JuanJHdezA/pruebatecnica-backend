/**
 * Autor: Juan José Hernández Antonio
 * Fecha: 11/04/2026
 * Descripción: Interfaz par controlador "Login"
 * Última modificación:
 * Modificado por:
 * Modificado:
 */

import { IsString, IsNotEmpty } from 'class-validator';
import { PTResponse } from '../../../../common/dto/response.dto';

/**
 * DTO para la creación de login.
 *
 * Este objeto define los parámetros requeridos para iniciar sesión en el sistema.
 * Incluye validaciones con `class-validator` para garantizar que los campos
 * cumplan con las reglas de negocio antes de ser procesados por el controlador.
 */
export class CreateLoginDto {
  /**
   * Nombre de usuario requerido para el login.
   * - Debe ser un texto válido (`string`).
   * - No puede estar vacío ni ser nulo.
   */
  @IsString({ message: 'El parámetro requerido <usuario> debe ser un texto válido.' })
  @IsNotEmpty({ message: 'No se ha definido o es nulo el valor del parámetro requerido <<usuario>>' })
  usuario: string = '';

  /**
   * Contraseña requerida para el login.
   *
   * - Debe ser un texto válido (`string`).
   * - No puede estar vacía ni ser nula.
   *
   * @example "MiPasswordSeguro123"
   */
  @IsString({ message: 'El parámetro requerido <password> debe ser un texto válido.' })
  @IsNotEmpty({ message: 'No se ha definido o es nulo el valor del parámetro requerido <<password>>' })
  password: string = '';
}

/**
 * DTO de respuesta para el login de usuario.
 *
 * Extiende la clase genérica `SPResponse` para envolver la respuesta
 * en el formato estándar del sistema, incluyendo metadatos como
 * `success`, `httpCode`, `codeError`, `message`, `errors` y `data`.
 *
 * El tipo genérico `CreateLoginDto` indica que el campo `data`
 * contendrá la información del login enviado.
 */
export class UserResponseDto extends PTResponse<CreateLoginDto> {}
