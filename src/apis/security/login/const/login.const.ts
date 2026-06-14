/**
 * Conjunto de mensajes de validación y error estandarizados
 * utilizados en procesos de autenticación y control de accesos.
 */
export const loginValidationConst = {
  /**
   * Mensaje mostrado cuando la cuenta de usuario especificada
   * no existe en los registros del sistema.
   * Se recomienda verificar la exactitud del identificador ingresado.
   */
  USUARIO_NOVALIDO:
    'La cuenta de usuario ingresada no se encuentra registrada en nuestro sistema. Verifique que el nombre de usuario esté escrito correctamente.',

  /**
   * Mensaje mostrado cuando la contraseña proporcionada
   * no corresponde al usuario especificado.
   * Indica un fallo en el proceso de autenticación.
   */
  PASSWORD_NOVALIDO:
    'No fue posible autenticar la cuenta. Verifique que la contraseña ingresada corresponda correctamente al usuario especificado.',

  /**
   * Mensaje mostrado cuando la cuenta de usuario se encuentra
   * marcada como inactiva o no vigente en el sistema.
   */
  INACTIVO: 'Usuario NO vigente',

  /**
   * Mensaje de advertencia cuando los roles o permisos asignados
   * al usuario han caducado y ya no son válidos.
   */
  ROLES_VENCIDOS: 'ADVERTENCIA: Los permisos asignados a su usuario han caducado.',

  /**
   * Mensaje de advertencia cuando el usuario no tiene roles
   * o permisos asignados en el sistema.
   * Se sugiere notificar al administrador correspondiente.
   */
  ROLES_SIN_ASIGNAR:
    'ADVERTENCIA: Usuario sin accesos y/o permisos asignados. Favor de notificar este enlace a su administrador.',

  /**
   * Mensaje de advertencia cuando el usuario no tiene servicios
   * habilitados o asignados en el sistema.
   * Se sugiere notificar al administrador correspondiente.
   */
  SERVICIOS_SIN_ASIGNAR:
    'ADVERTENCIA: Usuario sin accesos y/o permisos asignados. Favor de notificar este enlace a su administrador.',

  /**
   * Mensaje genérico para errores no identificados o desconocidos.
   * Puede ser utilizado como fallback en validaciones.
   */
  ERROR_DESCONOCIDO: '',

  /**
   * Mensaje mostrado cuando la vigencia de la cuenta de usuario
   * ha expirado. Se recomienda notificar al administrador.
   */
  VIGENCIA: 'La vigencia del usuario ha caducado. Favor de notificar este enlace a su administrador.',

  /**
   * Mensaje mostrado cuando el número máximo de intentos de acceso
   * ha sido superado. Se informa que se han emitido contraseñas
   * temporales al correo electrónico registrado del usuario.
   */
  NUM_INTENTOS:
    'Número de intentos superados. Contraseñas temporales emitidas a la cuenta de correo electrónico del usuario.'
};
