/**
 * Representa la respuesta estándar de una operación de sesión.
 */
export interface sessionRpsInterface<T> {
  /** Indica si ocurrió un error en la operación de sesión (`true` = error, `false` = éxito). */
  error: boolean;

  /** Mensaje descriptivo del resultado de la operación (ej. "Sesión iniciada correctamente"). */
  message: string;

  /** Datos del usuario obtenidos al iniciar sesión, definidos en `userDataLoginCtrlInterface`. */
  data: T;
}
