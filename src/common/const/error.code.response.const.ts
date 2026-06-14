import { environments } from '../../environments/environment';
import { HeaderErrorsAccessPermissionEnum } from '../enum/access-permissions.enum';

/**
 * Mapa de validaciones y respuestas de acceso.
 *
 * Cada entrada define un objeto con las siguientes propiedades:
 *
 * - `httpCode`: Código HTTP asociado al error, tomado de `environments.HTTPResponse`.
 *   Ejemplo: 401 (Unauthorized), 500 (InternalServerError).
 *
 * - `validations`: Texto corto que representa el estado de validación.
 *   Se usa como etiqueta estándar para identificar el tipo de error.
 *
 * - `codeError`: Código interno de error definido por la aplicación.
 *   Permite identificar de manera única el tipo de fallo en logs o reportes.
 *
 * - `error`: Bandera booleana que indica si la respuesta corresponde a un error (`true`)
 *   o a una operación exitosa (`false`).
 *
 * - `message`: Texto descriptivo y amigable que se devuelve al cliente.
 *   Explica de manera clara qué ocurrió.
 *
 * - `description`: Explicación técnica más detallada del motivo del error.
 *   Se utiliza para documentación, debugging y soporte técnico.
 */
export const errorCodeResponseConst = {
  /**
   * Validación de reglas de negocio.
   * Se lanza cuando la solicitud no cumple con parámetros, formatos o reglas de negocio.
   */
  [HeaderErrorsAccessPermissionEnum.RESPONSE_VALIDATION]: {
    httpCode: environments.HTTPResponse.success,
    validations: 'success',
    codeError: '00',
    error: true,
    message: 'La solicitud no cumple con los parámetros, formatos o reglas de negocio requeridas.',
    description:
      'Durante la ejecución de la API se encontraron validaciones previas que impiden continuar con el proceso. Se notifica al cliente que la solicitud no cumple con los requisitos establecidos.'
  },

  /**
   * Error genérico de autorización.
   * Se lanza cuando la cabecera `Authorization` está ausente o mal formada.
   */
  [HeaderErrorsAccessPermissionEnum.AUTHORIZATION_ERROR]: {
    httpCode: environments.HTTPResponse.Unauthorized,
    validations: 'Unauthorized',
    codeError: '01',
    error: true,
    message: 'El token de autenticación no fue proporcionado o es inválido.',
    description: 'La cabecera Authorization está ausente o mal formada, impidiendo al servidor autorizar el acceso.'
  },

  /**
   * Token inválido.
   * Se usa cuando el token JWT o similar no pasa la validación.
   */
  [HeaderErrorsAccessPermissionEnum.TOKEN_INVALID]: {
    httpCode: environments.HTTPResponse.Unauthorized,
    validations: 'Unauthorized',
    codeError: '02',
    error: true,
    message: 'El token enviado es inválido o está caducado.',
    description:
      'El token fue enviado pero está mal formado, incompleto, con caracteres inválidos o caducado, por lo que no puede ser validado.'
  },

  /**
   * API Key ausente.
   * Se lanza cuando la cabecera `x-api-key` no está presente.
   */
  [HeaderErrorsAccessPermissionEnum.X_API_KEY_NULL]: {
    httpCode: environments.HTTPResponse.NotAcceptable,
    validations: 'NotAcceptable',
    codeError: '03',
    error: true,
    message: 'No se adjuntó la cabecera de acceso <<x-api-key>>.',
    description:
      'No se recibió la llave de acceso esperada en la cabecera x-api-key, por lo tanto no se puede validar la identidad ni permitir el acceso al recurso solicitado.'
  },

  /**
   * IV ausente.
   * Se lanza cuando la cabecera `x-api-key` no está presente.
   */
  [HeaderErrorsAccessPermissionEnum.X_IV_INVALID]: {
    httpCode: environments.HTTPResponse.NotAcceptable,
    validations: 'NotAcceptable',
    codeError: '04',
    error: true,
    message:
      'La cabecera <<x-vector-key>> es inválida. Verifique que la clave enviada coincida con la configurada en el sistema.',
    description:
      'No se recibió la llave de acceso esperada en la cabecera x-vector-key, por lo tanto no se puede validar la identidad ni permitir el acceso al recurso solicitado.'
  },

  /**
   * IV ausente.
   * Se lanza cuando la cabecera `x-api-key` no está presente.
   */
  [HeaderErrorsAccessPermissionEnum.X_IV_NULL]: {
    httpCode: environments.HTTPResponse.NotAcceptable,
    validations: 'NotAcceptable',
    codeError: '05',
    error: true,
    message: 'No se adjuntó la cabecera de acceso <<x-vector-key>>.',
    description:
      'La cabecera fue enviada, pero el valor no coincide con el esperado (clave incorrecta, expirada o mal configurada).'
  },

  /**
   * API Key inválida.
   * Se usa cuando la cabecera `x-api-key` no coincide con la esperada.
   */
  [HeaderErrorsAccessPermissionEnum.X_API_KEY_INVALID]: {
    httpCode: environments.HTTPResponse.NotAcceptable,
    validations: 'NotAcceptable',
    codeError: '06',
    error: true,
    message:
      'La cabecera <<x-api-key>> es inválida. Verifique que la clave enviada coincida con la configurada en el sistema.',
    description:
      'La cabecera fue enviada, pero el valor no coincide con el esperado (clave incorrecta, expirada o mal configurada).'
  },

  /**
   * Autorización denegada.
   * Se lanza cuando el usuario no tiene permisos suficientes.
   */
  [HeaderErrorsAccessPermissionEnum.AUTHORIZATION_DENIED]: {
    httpCode: environments.HTTPResponse.Unauthorized,
    validations: 'Unauthorized',
    codeError: '07',
    error: true,
    message: 'Acceso denegado: no estás autorizado para realizar esta petición.',
    description:
      'La petición fue recibida, pero el sistema bloqueó el acceso porque el usuario no cuenta con las credenciales o permisos adecuados.'
  },

  /**
   * Origen denegado.
   * Se usa cuando la petición proviene de un origen no permitido (ej. CORS).
   */
  [HeaderErrorsAccessPermissionEnum.ORIGIN_DENIED]: {
    httpCode: environments.HTTPResponse.Unauthorized,
    validations: 'Unauthorized',
    codeError: '08',
    error: true,
    message: 'El origen de la petición no está autorizado.',
    description: 'El servidor bloqueó el acceso porque la solicitud proviene de un dominio o fuente no permitida.'
  },

  /**
   * Recurso fuera de lista blanca.
   * Se lanza cuando la ruta solicitada no está incluida en la lista blanca de APIs permitidas.
   */
  [HeaderErrorsAccessPermissionEnum.RESOURCE_WHITE_LIST]: {
    httpCode: environments.HTTPResponse.Unauthorized,
    validations: 'Unauthorized',
    codeError: '09',
    error: true,
    message: 'Acceso denegado, el recurso solicitado no está autorizado.',
    description:
      'La ruta o endpoint al que intentas acceder no forma parte de la lista blanca de APIs habilitadas por el sistema. Esto significa que el recurso no está disponible para clientes externos o no ha sido configurado como accesible. Verifica la URL solicitada y confirma que el servicio esté registrado en la configuración de recursos permitidos.'
  },

  /**
   * Canal del servicio incorrecto.
   * Se lanza cuando el canal asignado al proyecto no está autorizado.
   */
  [HeaderErrorsAccessPermissionEnum.X_CHANEL]: {
    httpCode: environments.HTTPResponse.Unauthorized,
    validations: 'Unauthorized',
    codeError: '10',
    error: true,
    message: 'La cabecera <<x-chanel>> es inválida. El canal de servicio no está autorizado.',
    description: 'El canal asignado al proyecto no se encuentra en la lista blanca de sistemas permitidos.'
  },

  /**
   * Cabecera de servicio indefinida.
   * Se lanza cuando falta la cabecera <<Service>>.
   */
  [HeaderErrorsAccessPermissionEnum.HEADER_SERVICE]: {
    httpCode: environments.HTTPResponse.NotAcceptable,
    validations: 'NotAcceptable',
    codeError: '11',
    error: true,
    message: 'Este acceso requiere la definición del servicio mediante la cabecera <<Service>>.',
    description:
      'El acceso fue bloqueado porque falta la cabecera Service para identificar correctamente el servicio solicitado.'
  },

  /**
   * Error de descifrado.
   * Se lanza cuando el proceso de desencriptado falla.
   */
  [HeaderErrorsAccessPermissionEnum.ERROR_DECRYPTING]: {
    httpCode: environments.HTTPResponse.failedDependency,
    validations: 'failedDependency',
    codeError: '12',
    error: true,
    message: 'No fue posible descifrar los datos recibidos.',
    description:
      'El servidor no pudo descifrar los datos porque la clave o el contenido no son válidos, y por seguridad se rechaza la operación.'
  },

  /**
   * Parámetros GET requeridos.
   * Se lanza cuando faltan parámetros obligatorios en la URL.
   */
  [HeaderErrorsAccessPermissionEnum.PARAMS_GET]: {
    httpCode: environments.HTTPResponse.RequiredPrecondition,
    validations: 'RequiredPrecondition',
    codeError: '13',
    error: true,
    message: 'Parámetros de enlace requeridos en la URL.',
    description:
      'La petición no incluye los parámetros obligatorios en el query string o path. Deben ser integrados para procesar la solicitud correctamente.'
  },

  /**
   * Parámetros POST requeridos.
   * Se lanza cuando faltan parámetros obligatorios en el cuerpo de la solicitud.
   */
  [HeaderErrorsAccessPermissionEnum.PARAMS_POST]: {
    httpCode: environments.HTTPResponse.RequiredPrecondition,
    validations: 'RequiredPrecondition',
    codeError: '14',
    error: true,
    message: 'Parámetros POST requeridos en el cuerpo de la solicitud.',
    description:
      'La petición no incluye los parámetros obligatorios en el cuerpo. Verifique que el cliente envíe todos los valores definidos como requeridos por el servicio.'
  },

  /**
   * Validación de Seguridad: Código de Abordaje.
   * Representa una falla en la integridad de la transacción criptográfica.
   * Se dispara cuando la codificación doble del IV (Initialization Vector)
   * de las llaves de encriptación no coincide o está mal formada.
   */
  [HeaderErrorsAccessPermissionEnum.CODE_BOARDING_DENIED]: {
    httpCode: environments.HTTPResponse.RequiredPrecondition,
    validations: 'RequiredPrecondition',
    codeError: '15',
    error: true,
    message: 'Fallo en la validación del código de abordaje.',
    description:
      'Se detectó una inconsistencia en la codificación doble del Vector de Inicialización (IV) de las llaves de encriptación. La solicitud ha sido rechazada para prevenir ataques de replay o manipulación de la carga útil cifrada.'
  },

  /**
   * Error de mensajes indefindos.
   * Se lanza cuando no existe un formato de global de respuesta del servidor
   */
  [HeaderErrorsAccessPermissionEnum.UNDEFINED_ERROR]: {
    httpCode: environments.HTTPResponse.conflict,
    validations: 'InternalServerError',
    codeError: '99',
    error: true,
    message: 'Se ha producido un error inesperado o no registrado en el sistema',
    description: 'La operación falló por una condición no contemplada en las validaciones actuales.'
  }
};
