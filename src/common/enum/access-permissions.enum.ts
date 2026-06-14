/**
 * Enumeración de errores relacionados con permisos de acceso
 * en validaciones de cabeceras y seguridad global.
 *
 * Este enum centraliza los códigos de error que pueden ser
 * devueltos por guards o middlewares al validar autenticación,
 * autorización y listas blancas de recursos.
 */
export enum HeaderErrorsAccessPermissionEnum {
  /**
   * Error indefinido o inesperado.
   * Se usa como fallback cuando el error no está registrado
   * en la colección de validaciones o no se puede determinar
   * su causa exacta.
   */
  UNDEFINED_ERROR = 'InternalServerError',

  /**
   * Error genérico de autorización.
   * Se lanza cuando la cabecera `Authorization` está ausente o mal formada.
   */
  AUTHORIZATION_ERROR = 'authorizationError',

  /**
   * Token inválido.
   * Se usa cuando el token JWT o similar no pasa la validación.
   */
  TOKEN_INVALID = 'tokenInvalid',

  /**
   * Validación de reCAPTCHA fallida.
   * Se activa cuando el token de Google reCAPTCHA v3 es rechazado. Técnicamente indica que
   * el análisis de riesgo (score) no alcanzó el umbral mínimo de confianza o que el token
   * enviado es malformado, duplicado o ha superado el tiempo de vida de 2 minutos.
   */
  KEY_RECAPTCHA_INVILID = 'recaptchaInvalid',

  /**
   * API Key nula.
   * Se lanza cuando la cabecera `x-api-key` no está presente.
   */
  X_API_KEY_NULL = 'xApiKeyNull',

  /**
   * API Key inválida.
   * Se usa cuando la `x-api-key` no coincide con la esperada.
   */
  X_API_KEY_INVALID = 'xApiKeyInvalid',

  /**
   * IV Key inválida.
   * Se usa cuando la `x-vector-key` no coincide con la esperada.
   */
  X_IV_INVALID = 'xIVInvalid',

  /**
   * IV Key nula.
   * Se usa cuando la `x-vector-key` no está presente
   */
  X_IV_NULL = 'xIVNull',

  /**
   * Autorización denegada.
   * Se lanza cuando el usuario no tiene permisos suficientes
   * para acceder al recurso solicitado.
   */
  AUTHORIZATION_DENIED = 'authorizationDenied',

  /**
   * Origen denegado.
   * Se usa cuando la petición proviene de un origen no permitido
   * (ejemplo: validación de CORS o lista de dominios).
   */
  ORIGIN_DENIED = 'originDenied',

  /**
   * Recurso fuera de lista blanca.
   * Se lanza cuando la ruta solicitada no está incluida en la
   * lista blanca de APIs permitidas.
   */
  RESOURCE_WHITE_LIST = 'whitelistDenied',

  /**
   * Canal del servicio incorrecto.
   * Se lanza cuando la cabecera `x-code-boarding` no coincide con el
   * código de abordaje de aplicación.
   */
  CODE_BOARDING_DENIED = 'codeBoardingDenied',

  /**
   * Canal del servicio incorrecto.
   * Se lanza cuando la cabecera `x-chanel` no coincide con el canal
   * autorizado por el sistema.
   */
  X_CHANEL = 'xChanelDenied',

  /**
   * Cabecera de servicio indefinida.
   * Se lanza cuando falta la cabecera `Service` para identificar
   * correctamente el servicio solicitado.
   */
  HEADER_SERVICE = 'headerServiceUndefined',

  /**
   * Error al descifrar datos.
   * Se lanza cuando el servidor no puede desencriptar la información
   * recibida por estar corrupta o usar una clave inválida.
   */
  ERROR_DECRYPTING = 'errorDecrypting',

  /**
   * Parámetros GET requeridos.
   * Se lanza cuando la petición no incluye los parámetros obligatorios
   * en la URL (query string o path).
   */
  PARAMS_GET = 'paramsGetUndefined',

  /**
   * Parámetros POST requeridos.
   * Se lanza cuando la petición no incluye los parámetros obligatorios
   * en el cuerpo de la solicitud.
   */
  PARAMS_POST = 'paramsPostUndefined',

  /**
   * Validación de reglas de negocio.
   * Se lanza cuando la solicitud no cumple con parámetros, formatos
   * o reglas de negocio requeridas durante la ejecución de la API.
   */
  RESPONSE_VALIDATION = 'responseValidation'
}
