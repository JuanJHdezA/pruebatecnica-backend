/**
 * Autor: Juan José Hernández Antonio
 * Fecha: 11/04/2026
 * Descripción: Clase global para resolución de rutas absolutas del proyecto
 * Última modificación:
 * Modificado:
 */

import path from 'path';
import fs from 'fs';

/**
 *
 */
export class PathResolverClass {
  /**
   * Resuelve una ruta absoluta basada en la raíz del proyecto,
   * sin importar si el backend corre desde src o dist.
   * @param {...any} segments
   */
  static resolveProjectPath(...segments: string[]): string {
    return path.join(process.cwd(), ...segments);
  }

  /**
   * Resuelve una ruta absoluta y valida que el archivo exista.
   * Lanza un error si no existe.
   * @param {...any} segments
   */
  static resolveFileOrThrow(...segments: string[]): string {
    const absolutePath = this.resolveProjectPath(...segments);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Archivo no encontrado: ${absolutePath}`);
    }

    return absolutePath;
  }

  /**
   * Devuelve una ruta absoluta con prefijo file://
   * compatible con canvas.loadImage()
   * @param {...any} segments
   */
  static resolveFileUrl(...segments: string[]): string {
    const absolutePath = this.resolveFileOrThrow(...segments);
    return `${absolutePath}`;
  }
}
