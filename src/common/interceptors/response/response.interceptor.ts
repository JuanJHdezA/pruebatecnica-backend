/**
 * Autor: Juan José Hernández Antonio
 * Fecha: 11/04/2026
 * Descripción: Interceptor de respuesta
 * Última modificación:
 * Modificado:
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { Observable, from, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { PTResponse } from '../../dto/response.dto';
import { errorCodeResponseConst as validations } from '../../const/error.code.response.const';
import { HeaderErrorsAccessPermissionEnum as headerErros } from '../../enum/access-permissions.enum';
import { EncryptionService } from '../../services/encryption/encryption.service';
import { encryptResInterface } from '../../interfaces/http.response.interface';
import { environments } from '../../../environments/environment';
import { encryptResponseInterface } from '../../services/encryption/interfaces/encriptador.service.interface';

/**
 * Interceptor de respuesta.
 * Se encarga de transformar todas las respuestas de los controladores
 * en un formato estándar con metadatos adicionales y, opcionalmente,
 * encriptar la salida si el ambiente está configurado en producción.
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  // Servicio de encriptación utilizado para cifrar/desencriptar datos.
  private _encryptionServices: EncryptionService = new EncryptionService();

  /**
   * Intercepta todas las respuestas de los controladores.
   * Aplica un formato uniforme (`PTResponse`) y maneja tanto respuestas exitosas
   * como errores. En producción, encripta la respuesta antes de enviarla al cliente.
   *
   * @param context Contexto de ejecución de NestJS (incluye request/response).
   * @param next Flujo de ejecución del manejador de llamadas.
   * @returns Observable con la respuesta transformada o encriptada.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    //Llaves de encrptación por sesión activa
    const keys = request.userContext?.encrypt ?? { key: null, iv: null };

    return next.handle().pipe(
      // Respuestas exitosas
      mergeMap(async (data) => {
        const validacion = validations[headerErros.RESPONSE_VALIDATION];
        const errorDTO = new PTResponse({
          success: false,
          httpCode: validacion.httpCode,
          codeError: validacion.codeError,
          message: validacion.message,
          errors: validacion?.message,
          data: null
        });

        const res = new PTResponse({
          success: true,
          httpCode: HttpStatus.OK,
          message: 'Operación realizada correctamente.',
          data
        });

        // Si el ambiente está en producción, se procede con la encriptación de respuestas
        if (environments.production) {
          const responsePayload = {
            ...keys,
            data: JSON.stringify(res)
          };

          const encrypt = await this.encriptResponse(responsePayload);
          // Si la encriptación falla, se devuelve la respuesta sin cifrar
          if (encrypt.error) {
            return throwError(() => new HttpException(errorDTO, validacion.httpCode));
          }

          return { pt: encrypt.cipher };
        }

        return { pt: res };
      }),
      // Errores
      catchError((err) => {
        // Error de validación por DTO
        if (err instanceof BadRequestException) {
          const response = err.getResponse() as any;

          if (Array.isArray(response?.message)) {
            const validacion = validations[headerErros.RESPONSE_VALIDATION];

            const errorDTO = new PTResponse({
              success: false,
              httpCode: validacion.httpCode,
              codeError: validacion.codeError,
              message: validacion.message,
              errors: response?.message,
              data: null
            });

            return this.handleErrorResponse(errorDTO, errorDTO.httpCode, request);
          }
        }

        // Validaciones y errores genéricos
        const status = err instanceof HttpException ? err.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const response = err instanceof HttpException ? err.getResponse() : (err as Error).message;

        const errorPayload =
          typeof response === 'object' && 'codeError' in response
            ? response
            : new PTResponse({
                success: false,
                httpCode: status,
                codeError: '00',
                message: 'Procesos de validación.',
                errors: response,
                data: null
              });

        return this.handleErrorResponse(errorPayload, status, request);
      })
    );
  }

  /**
   * Maneja la construcción y envío de respuestas de error.
   * Si el ambiente está en producción, encripta el payload antes de enviarlo.
   *
   * @param payload Objeto de error (`PTResponse`) o catálogo con `codeError`.
   * @param status Código HTTP asociado al error.
   * @param request Objeto de la petición HTTP (para obtener claves de encriptación).
   * @returns Observable que lanza una excepción encriptada o sin encriptar.
   */
  private handleErrorResponse(
    payload: PTResponse<unknown> | (object & { codeError: unknown }),
    status: number,
    request: any
  ) {
    if (environments.production) {
      const responsePayload = {
        key: request?.userContext.encrypt?.key || null,
        iv: request?.userContext.encrypt?.iv || null,
        data: JSON.stringify(payload)
      };

      return from(
        this.encriptResponse(responsePayload).then((encrypt) => {
          if (encrypt.error) {
            throw new HttpException({ pt: payload }, status);
          }
          throw new HttpException({ pt: encrypt.cipher }, status);
        })
      );
    }

    throw new HttpException({ pt: payload }, status);
  }

  /**
   * Encripta la respuesta de error usando el servicio `EncryptionService`.
   *
   * @param cipher Objeto con la clave, vector de inicialización y datos a encriptar.
   * @param payload
   * @param payload.key
   * @param payload.iv
   * @param payload.data
   * @returns Objeto con estado de error y datos encriptados.
   */
  private async encriptResponse(payload: { key: string; iv: string; data: string }): Promise<encryptResInterface> {
    try {
      const encrypt: encryptResponseInterface = await this._encryptionServices.cifrarDatos(payload);
      if (encrypt.error) {
        throw new Error(encrypt?.message);
      }

      return { error: false, cipher: encrypt.cipher || '' };
    } catch (error: any) {
      return { error: true, message: error.message, cipher: '' };
    }
  }
}
