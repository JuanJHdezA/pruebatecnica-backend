import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { HeaderErrorsAccessPermissionEnum as headerErros } from '../../../enum/access-permissions.enum';
import { errorCodeResponseConst as validations } from '../../../const/error.code.response.const';
import { environments } from '../../../../environments/environment';
import { EncryptionService } from '../../../services/encryption/encryption.service';
import { encryptResponseInterface } from '../../../services/encryption/interfaces/encriptador.service.interface';

//LLaves de encriptación para autenticación pública
const keys = environments.deployment.keys;

/**
 * Guard para controladores públicos.
 *
 * Funcionalidad:
 * - Valida la cabecera `Authorization` con un token Bearer.
 * - Desencripta credenciales y las compara contra valores configurados en `environments`.
 * - Lanza excepciones uniformes en caso de error, con posibilidad de encriptar la respuesta.
 */
@Injectable()
export class AuthPublicGuard implements CanActivate {
  /**
   * Servicio de encriptación utilizado para cifrar/desencriptar datos.
   */
  private _encryptionServices = new EncryptionService();

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
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      // Obtener token Bearer
      const authHeader = request.headers['authorization'];
      const auth = authHeader?.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;
      if (!auth) {
        throw new Error(headerErros.AUTHORIZATION_ERROR);
      }

      const payload = {
        key: keys.key,
        iv: keys.iv,
        encrypted: auth
      };

      // Validar credenciales contra configuración principal
      const cipher: encryptResponseInterface = await this._encryptionServices.descrifrarDatos(payload);
      if (cipher.error) {
        throw new Error('AUTHORIZATION_ERROR');
      }

      //Si los datos proceden de despliegue de producción se procede a generar descifrar los datos enviados
      let data = request.body?.data ?? {};
      if (environments.production) {
        if (data) {
          const payload = {
            key: keys.key,
            iv: keys.iv,
            encrypted: data
          };

          const params: encryptResponseInterface = await this._encryptionServices.descrifrarDatos(payload);
          if (cipher.error) {
            throw new Error('ERROR_DECRYPTING');
          }

          data = params?.data ?? {};
        }
      }

      //Datos de usuario en el request
      request.body = data;

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

      // Si el ambiente está en producción, se procede con la encriptación de respuestas
      if (environments.production) {
        // Construcción de la respuesta de error cifrada
        const payload = {
          key: keys.key,
          iv: keys.iv,
          data: JSON.stringify(res)
        };

        const encrypt = await await this._encryptionServices.cifrarDatos(payload);

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
