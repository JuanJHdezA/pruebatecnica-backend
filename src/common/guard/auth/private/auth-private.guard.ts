import { CanActivate, ExecutionContext, HttpException, Injectable, Body } from '@nestjs/common';
import { HeaderErrorsAccessPermissionEnum as headerErros } from '../../../enum/access-permissions.enum';
import { errorCodeResponseConst as validations } from '../../../const/error.code.response.const';
import { environments } from '../../../../environments/environment';
import { EncryptionService } from '../../../services/encryption/encryption.service';
import { encryptResponseInterface } from '../../../services/encryption/interfaces/encriptador.service.interface';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from '../../../services/session/session.service';
import { DecryptResInterface } from '@common/interfaces/http.response.interface';
/**
 *
 */
@Injectable()
export class AuthPrivateGuard implements CanActivate {
  private keys = {
    public: { key: environments.deployment.keys.key, iv: environments.deployment.keys.iv },
    private: { key: null, iv: null }
  };

  /**
   *
   * @param _sessionServices
   * @param _jwt
   * @param _encryptionServices
   */
  constructor(
    private readonly _sessionServices: SessionService,
    private _jwt: JwtService,
    private _encryptionServices: EncryptionService
  ) {}

  /**
   *
   * @param context
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      // Obtener token
      const servicio = request?.originalUrl?.split('apis-services/')[1] ?? '';
      const authHeader = request.headers['authorization'];
      const auth = authHeader?.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;
      if (!auth || !servicio) {
        throw new Error(headerErros.AUTHORIZATION_ERROR);
      }

      //Descifrado del token de autenticación de usuario
      const token = await this.descryptToken(auth, servicio);
      if (token.error || !token.data) {
        throw new Error(headerErros.TOKEN_INVALID);
      }

      //Validación de JWT
      const jwt = this._jwt.verify(token?.data, { secret: environments.jwtConfig.api.secret });
      if (!jwt || !jwt?.usuario) {
        throw new Error(headerErros.TOKEN_INVALID);
      }

      this.keys.private = {
        key: jwt?.key ?? '',
        iv: jwt?.iv ?? ''
      };

      const sesion: any = await this._sessionServices.getDataSession({ usuario: jwt.usuario });
      if (sesion.error || !sesion?.data) {
        throw new Error(headerErros.TOKEN_INVALID);
      }

      /* Validación de credenciales de usuario */
      const usuario = {
        key: sesion?.data?.apikey || '',
        iv: sesion?.data?.iv || ''
      };

      if (usuario.key !== jwt.key || usuario.iv !== jwt.iv) {
        throw new Error(headerErros.TOKEN_INVALID);
      }

      let data = request.body?.data ?? {};
      if (environments.production) {
        // Si el ambiente está en producción, se procede con la descriptar los datos del body.
        if (data) {
          const payload = {
            ...usuario,
            encrypted: data
          };

          const params: encryptResponseInterface = await this._encryptionServices.descrifrarDatos(payload);
          if (!params) {
            throw new Error(headerErros.ERROR_DECRYPTING);
          }

          data = params?.data;
        }
      }

      //Parámetros
      request.body = data;

      //Datos del usuario en sesion
      request.userContext = {
        encrypt: {
          key: sesion?.data?.apikey || '',
          iv: sesion?.data?.iv || ''
        },
        session: sesion?.data ?? {}
      };

      return true;
    } catch (e: any) {
      const jwtError = ['jwt expired', 'jwt malformed'];
      const message = e.message?.toLowerCase()?.trim() ?? 'jwt malformed';

      const error = jwtError.includes(message) //Si el error se refiere a la token vigencia del token se responde con "tokenInvalid"
        ? validations['tokenInvalid']
        : (validations[e.message] ?? validations[headerErros.UNDEFINED_ERROR]);

      const res = {
        success: false, // Bandera que indica que la operación falló
        status: error.validations, // Estado de validación (ej. Unauthorized, NotAcceptable)
        httpCode: error.httpCode, // Código HTTP asociado al error
        codeError: error.codeError, // Código interno de error para trazabilidad
        message: error.message, // Mensaje descriptivo del error
        data: null // Datos adicionales (vacío en caso de error)
      };

      // Construcción de la respuesta de error

      // Si el ambiente está en producción, se procede con la encriptación de respuestas
      if (environments.production) {
        const payload = {
          key: request.body?.encrypt?.key || null,
          iv: request.body?.encrypt?.iv || null,
          data: JSON.stringify(res)
        };

        const encrypt: encryptResponseInterface = await this._encryptionServices.cifrarDatos(payload);

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

      return {
        error: false,
        data: cipherTk?.data ?? {}
      };
    } catch (error: any) {
      return { error: true, message: error.message, data: { usuario: null, password: null } };
    }
  }
}
