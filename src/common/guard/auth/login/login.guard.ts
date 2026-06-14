/**
 * Autor: Juan José Hernández Antonio
 * Fecha: 11/04/2026
 * Descripción: Guard de permisos de autenticación por login.
 * Última modificación:
 * Modificado:
 */
import { CanActivate, ExecutionContext, HttpException, Inject, Injectable } from '@nestjs/common';
import { HeaderErrorsAccessPermissionEnum as headerErros } from '../../../enum/access-permissions.enum';
import { errorCodeResponseConst as validations } from '../../../const/error.code.response.const';
import { environments } from '../../../../environments/environment';
import { EncryptionService } from '../../../services/encryption/encryption.service';
import { encryptResponseInterface } from '../../../services/encryption/interfaces/encriptador.service.interface';
import { encryptResInterface, DecryptResInterface } from '../../../interfaces/http.response.interface';

/**
 * Guard para controladores públicos.
 *
 * Funcionalidad:
 * - Valida la cabecera `Authorization` con un token Bearer.
 * - Desencripta credenciales y las compara contra valores configurados en `environments`.
 * - Lanza excepciones uniformes en caso de error, con posibilidad de encriptar la respuesta.
 */
@Injectable()
export class LoginGuard implements CanActivate {
  /**
   * Servicio de encriptación utilizado para cifrar/desencriptar datos.
   */

  constructor() {}
  private _encryptionServices = new EncryptionService();

  /* private _SessionService = new SessionService(); */

  /**
   * Punto de entrada del guard.
   *
   * Flujo:
   * 1. Extrae el token Bearer de la cabecera `Authorization`.
   * 2. Desencripta el token y obtiene credenciales.
   * 3. Valida credenciales contra las configuradas en `environments.deployment.keys`.
   * 4. Si son válidas, añade el usuario al `request.body` y permite el acceso.
   * 5. Si falla, construye una respuesta de error uniforme (encriptada si aplica).
   *
   * @param context Contexto de ejecución de NestJS.
   * @returns `true` si la autenticación es correcta, lanza `HttpException` en caso contrario.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      /*Proceso de depuración de metricas de cabeceras */
      if (environments.debugger) return true;

      const request = context.switchToHttp().getRequest();

      // Obtener token
      const servicio = request?.originalUrl?.split('apis-services/')[1] ?? '';
      const authHeader = request.headers['authorization'];
      const auth = authHeader?.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;

      if (!auth || !servicio) {
        throw new Error(headerErros.TOKEN_INVALID);
      }

      // Desencriptar token
      const cipher = await this.descryptToken(auth, servicio);
      if (cipher.error) {
        throw new Error(headerErros.TOKEN_INVALID);
      }

      //Parámetros
      let data = request.body?.data ?? {};
      if (environments.production) {
        // Si el ambiente está en producción, se procede con la descriptar los datos del body.
        if (data) {
          const payload = {
            key: environments.deployment.keys.key,
            iv: environments.deployment.keys.iv,
            encrypted: data
          };

          const params: encryptResponseInterface = await this._encryptionServices.descrifrarDatos(payload);
          if (!params) {
            throw new Error(headerErros.ERROR_DECRYPTING);
          }

          data = params?.data ?? {};
        }
      }

      //Datos de usuario en el request
      request.body = {
        usuario: cipher.data?.usuario?.toLocaleLowerCase() ?? null,
        password: cipher.data?.password ?? null
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

      // Construcción de la respuesta de error
      const responsePayload = JSON.stringify(res);

      // Si el ambiente está en producción, se procede con la encriptación de respuestas
      if (environments.production) {
        const encrypt = await this.encriptResError(responsePayload);

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

  /**
   * Encripta la respuesta de error usando el servicio `EncryptionService`.
   *
   * @param res Cadena JSON con el objeto de error a encriptar.
   * @returns Objeto con estado de error y datos encriptados.
   */
  private async encriptResError(res: string): Promise<encryptResInterface> {
    try {
      const keys = {
        key: environments.deployment.keys.key,
        iv: environments.deployment.keys.iv,
        data: res
      };

      const encrypt: encryptResponseInterface = await this._encryptionServices.cifrarDatos(keys);
      if (encrypt.error) {
        throw new Error(encrypt?.message);
      }

      return { error: false, cipher: encrypt.cipher || '' };
    } catch (error: any) {
      return { error: true, message: error.message, cipher: '' };
    }
  }

  /**
   * Desencripta el token Bearer recibido en la cabecera.
   *
   * @param token Token encriptado recibido en la cabecera `Authorization`.
   * @param servicio Url del servicio o petición del endpoint.
   * @returns Objeto con credenciales desencriptadas (`usuario`, `password`) o error en caso de fallo.
   */
  private async descryptToken(token: string, servicio: string): Promise<DecryptResInterface> {
    try {
      /* Llaves de encriptación dinámicas generadas por minustos dado el enpoint de solicitud */
      const _keysTemp = await this._encryptionServices.generateTimeBasedKey(servicio);
      const cipherTk: encryptResponseInterface = await this._encryptionServices.descrifrarDatos({
        ..._keysTemp,
        encrypted: token
      });
      if (cipherTk.error) {
        throw new Error(cipherTk?.message);
      }

      const keys = {
        key: environments.deployment.keys.key,
        iv: environments.deployment.keys.iv,
        encrypted: cipherTk?.data
      };

      const encrypt: encryptResponseInterface = await this._encryptionServices.descrifrarDatos(keys);
      if (encrypt.error) {
        throw new Error(encrypt?.message);
      }

      return {
        error: false,
        data: {
          usuario: encrypt?.data?.usuario ?? '',
          password: encrypt?.data?.password ?? ''
        }
      };
    } catch (error: any) {
      return { error: true, message: error.message, data: { usuario: null, password: null } };
    }
  }
}
