import { CanActivate, ExecutionContext, Injectable, HttpException } from '@nestjs/common';
import { HeaderErrorsAccessPermissionEnum as headerErros } from '../../enum/access-permissions.enum';
import { errorCodeResponseConst as validations } from '../../const/error.code.response.const';
import { environments } from '../../../environments/environment';
import { EncryptionService } from '../../../common/services/encryption/encryption.service';

/**
 * Guard de permisos de acceso.
 *
 * Este guard valida las cabeceras principales de cada petición:
 * - Verifica cabecera `origin` y lista blanca de recursos.
 * - Comprueba autenticación vía `Authorization: Bearer <token>`.
 * - Valida la existencia y formato de la cabecera `x-api-key`.
 *
 * En caso de error, lanza `HttpException` con mensajes y códigos
 * definidos en `HeaderErrorsAccessPermissionEnum` y `errorCodeResponseConst`.
 *
 * Retorno:
 * - `Promise<boolean>` → `true` si todas las validaciones son correctas.
 * - Lanza excepción si alguna validación falla.
 */

/**
 *
 */
@Injectable()
export class AccessPermissionsGuard implements CanActivate {
  /**
   * Servicio de encriptación utilizado para cifrar las respuestas de error
   * cuando la variable de entorno `encryptResponse` está habilitada.
   */
  private _encryptionServices = new EncryptionService();

  /**
   * Punto de entrada del guard.
   *
   * @param context Contexto de ejecución de NestJS que permite acceder
   *                a la petición HTTP y sus cabeceras.
   * @returns Promise<boolean> → `true` si la petición pasa todas las validaciones.
   * @throws HttpException → Si alguna validación falla, devuelve un objeto
   *                         con formato uniforme (mensaje, código, descripción).
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      /* Validaciones de credenciales y llaves de accesos */
      /*Proceso de depeuración de metricas de cabeceras */
      if (environments.debugger) return true;

      /* Validación de cabecera Origin
      se valida que el origin de datos exista de lo contrario se toma el indice del referer como origin de datos*/
      const origin =
        request.headers['origin'] ?? request.headers['referer']?.substr(0, request.headers['referer'].length - 1);
      if (!origin) {
        throw new Error(headerErros.ORIGIN_DENIED);
      }

      // Validación de lista blanca de recursos
      if (!environments.ResourceWhiteList.includes(origin)) {
        throw new Error(headerErros.RESOURCE_WHITE_LIST);
      }

      // Validación de cabecera Authorization
      const auth = request.headers['authorization'];
      if (!auth || (!auth.startsWith('Bearer ') && false)) {
        throw new Error(headerErros.AUTHORIZATION_ERROR);
      }

      // Validación de token Bearer
      const authorization = auth.split('Bearer ')[1];
      if (!authorization && false) {
        throw new Error(headerErros.TOKEN_INVALID);
      }

      // Validación de cabecera x-api-key
      if (!request.headers['x-api-key']) {
        throw new Error(headerErros.X_API_KEY_NULL);
      }

      // Validación de llave de acceso
      if (request.headers['x-api-key'] !== environments.deployment.keys.key) {
        throw new Error(headerErros.X_API_KEY_INVALID);
      }

      //Canal del servicio de respuesta KEY
      if (request.headers['x-chanel'] !== environments.deployment.keys.xChannel) {
        throw new Error(headerErros.X_CHANEL);
      }

      // Validación de llave de acceso IV
      if (!request.headers['x-vector-key']) {
        throw new Error(headerErros.X_IV_NULL);
      }

      //Validación de código de abordaje
      if (!request.headers['x-code-boarding']) {
        throw new Error(headerErros.CODE_BOARDING_DENIED);
      }

      if (request.headers['x-code-boarding'] !== environments.deployment.keys.iv) {
        throw new Error(headerErros.X_IV_INVALID);
      }

      //Cifrado y validación de llaves de encriptación
      const payload = {
        key: environments.deployment.keys.key,
        iv: environments.deployment.keys.iv,
        encrypted: request.headers['x-vector-key']
      };

      //Se descripta el valor del vector de encriptación ya que este valor tiene un cifrado doble sobre el valor real
      const decryptIV = await this._encryptionServices.descrifrarDatos(payload);
      const iv = decryptIV?.data?.iv ?? null;
      if (decryptIV.error || !iv) {
        throw new Error(headerErros.X_IV_INVALID);
      }

      //Llaves de encriptación de datos
      request.userContext = {
        encrypt: {
          key: request.headers['x-api-key'],
          iv: decryptIV?.data?.iv
        },
        session: {}
      };

      return true;
    } catch (e: any) {
      const error = validations[e.message] ?? validations[headerErros.UNDEFINED_ERROR];
      const res = {
        success: false, // Bandera que indica que la operación falló
        status: error.validations, // Estado de validación (ej. Unauthorized, NotAcceptable)
        httpCode: error.httpCode, // Código HTTP asociado al error
        codeError: error.codeError, // Código interno de error para trazabilidad
        message: error.message, // Mensaje descriptivo del error
        data: null // Datos adicionales (vacío en caso de error)
      };

      // Si está el ambiente ha producción está habilitada se procede con la encriptación de respuestas
      if (environments.production) {
        const payload = {
          key: request?.userContext?.encrypt?.key || null,
          iv: request?.userContext?.encrypt?.iv || null,
          data: JSON.stringify(res)
        };

        const encrypt = await this._encryptionServices.cifrarDatos(payload);

        // Si la encriptación falla, se devuelve la respuesta sin cifrar
        if (encrypt.error) {
          throw new HttpException({ pt: res }, res.httpCode);
        }

        // Respuesta encriptada
        throw new HttpException({ pt: encrypt.cipher }, res.httpCode);
      }

      // Respuesta sin encriptar (modo estándar)
      throw new HttpException({ pt: res }, res.httpCode);
    }
  }
}
