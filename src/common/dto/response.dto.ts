export class PTResponse<T> {
  success: boolean; // true si la operación fue exitosa
  httpCode: number; // código HTTP asociado
  codeError?: string; // código interno de error (según catálogo)
  message: string; // mensaje claro para cliente
  errors?: string | object; // detalle técnico para programador
  data?: T | null; // datos de la operación (DTO específico)

  /**
   *
   * @param partial
   */
  constructor(partial: Partial<PTResponse<T>>) {
    Object.assign(this, partial);
  }
}
