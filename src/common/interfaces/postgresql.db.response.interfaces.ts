/**
 * Autor: Juan José Hernández Antonio
 * Fecha: 11/04/2026
 * Descripción: Servicio general para consulta de datos de usuario
 * Última modificación:
 * Modificado:
 */
/**
 * Interface que define la estructura estándar de respuesta
 * proveniente de la base de datos o de la API.
 *
 * Se utiliza para homogenizar las respuestas y facilitar
 * el manejo de éxito, error y datos en el frontend.
 */
export interface ResponseDBInterface {
  /**
   * Indica si la operación fue exitosa.
   * - true: operación completada correctamente.
   * - false: ocurrió un error lógico o técnico.
   */
  success?: boolean;

  /**
   * Mensaje informativo o de error asociado a la operación.
   * Puede ser nulo si no se requiere mensaje.
   */
  message?: string | null;

  /**
   * Objeto que describe el error en detalle.
   * Solo presente si success = false.
   */
  error?: {
    /**
     * Nombre o tipo de excepción lanzada.
     */
    excepcion?: string | null;

    /**
     * Código de error asociado (ej. código SQL, código interno).
     */
    codigo?: string | null;

    /**
     * Detalles adicionales del error.
     */
    detalle?: {
      /**
       * Mensaje descriptivo del error.
       */
      message?: string | null;

      /**
       * Columna o campo relacionado con el error (ej. en BD).
       */
      columna?: string | null;

      /**
       * Restricción violada (ej. constraint en BD).
       */
      restriccion?: string | null;

      /**
       * Descripción más amplia del error.
       */
      descripcion?: string | null;
    };
  };

  /**
   * Datos devueltos por la operación.
   * Puede ser cualquier tipo de objeto o nulo si no hay datos.
   */
  data?: any | null;
}
