/**
 * Respuesta estándar al desencriptar un token.
 * - `error`: indica si el proceso falló.
 * - `data`: credenciales obtenidas (usuario y password).
 * - `message`: mensaje opcional en caso de error.
 */
export interface DecryptResInterface {
  error: boolean;
  data: any;
  message?: string;
}

/**
 * Respuesta estándar al encriptar datos.
 * - `error`: indica si el proceso falló.
 * - `cipher`: cadena encriptada resultante.
 * - `message`: mensaje opcional en caso de error.
 */
export interface encryptResInterface {
  error: boolean;
  cipher: string;
  message?: string;
}
