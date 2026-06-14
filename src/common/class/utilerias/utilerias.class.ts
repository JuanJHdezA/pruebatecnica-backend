import { Buffer } from 'buffer';
import { camelCase, isArray, isObject } from 'lodash';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import * as path from 'path';

const fs = require('fs');
const isPDF = require('is-pdf-valid');

export class utileriasClass {
  constructor() {}

  /**
   * Formatea una fecha en distintos formatos configurables y opcionalmente incluye la hora.
   *
   * La función recibe un objeto `Date` y devuelve una cadena con el formato especificado.
   * Permite personalizar el orden de día, mes y año, el separador y si se incluye la hora.
   *
   * @param {Date} fecha - Fecha a formatear. Debe ser un objeto `Date` válido.
   * @param {Object} [config] - Configuración opcional para personalizar el formato.
   * @param {boolean} [config.incluirHora=false] - Si es `true`, añade la hora en formato `HH:mm:ss`.
   * @param {boolean} [config.removerSeparador=false] - Si es `true`, Se omite los separados`.
   * @param {'/' | '.' | '-'} [config.separador='/'] - Separador entre los componentes de la fecha.
   * @param {'DDMMYYYY' | 'YYYYMMDD' | 'DDMMYY' | 'YYMMDD'} [config.format='DDMMYYYY'] - Formato de salida.
   *
   * @returns {string} La fecha formateada en el formato especificado.
   *
   * @throws {Error} Si el parámetro `fecha` no está definido.
   *
   * @example
   * // Ejemplo por defecto (DD/MM/YYYY)
   * const fecha = new Date('2026-01-27T12:45:00Z');
   * const resultado = formatDateDDMMYYYY(fecha);
   * // resultado => "27/01/2026"
   *
   * @example
   * // Ejemplo con formato YYYY-MM-DD e incluir hora
   * const fecha = new Date('2026-01-27T12:45:07Z');
   * const resultado = formatDateDDMMYYYY(fecha, { incluirHora: true, separador: '-', format: 'YYYYMMDD' });
   * // resultado => "2026-01-27 12:45:07"
   *
   * @example
   * // Ejemplo con formato DD.MM.YY sin hora
   * const fecha = new Date('2026-01-27T12:45:07Z');
   * const resultado = formatDateDDMMYYYY(fecha, { separador: '.', format: 'DDMMYY' });
   * // resultado => "27.01.26"
   */

  /**
   *
   * @param fecha
   * @param config
   * @param config.incluirHora
   * @param config.removerSeparador
   * @param config.separador
   * @param config.format
   */
  public formatDateCustom(
    fecha: Date,
    config?: {
      incluirHora?: boolean;
      removerSeparador?: boolean;
      separador?: '/' | '.' | '-' | '' | '*';
      format?: 'DDMMYYYY' | 'YYYYMMDD' | 'DDMMYY' | 'YYMMDD' | 'DATE-IN-WORDS';
    }
  ): string {
    if (!fecha) {
      throw new Error('El parámetro <<fecha>> no está definido.');
    }

    const date = fecha instanceof Date ? fecha : new Date(fecha);
    const data = {
      dia: date.getUTCDate().toString().padStart(2, '0'),
      mes: (date.getUTCMonth() + 1).toString().padStart(2, '0'),
      year: date.getFullYear(),
      hora: date.getHours().toString().padStart(2, '0'),
      minutos: date.getMinutes().toString().padStart(2, '0'),
      segundos: date.getSeconds().toString().padStart(2, '0')
    };

    const separador: string = config?.removerSeparador ? '' : (config?.separador ?? '/');
    const format: string = config?.format ?? 'DDMMYYYY';
    const tiempo = config?.incluirHora ? ` ${data.hora}:${data.minutos}:${data.segundos}` : '';

    let _fecha = '';
    switch (format) {
      case 'YYYYMMDD':
        _fecha = `${data.year.toString()}${separador}${data.mes}${separador}${data.dia}${tiempo}`;
        break;

      case 'DDMMYY':
        _fecha = `${data.dia}${separador}${data.mes}${separador}${data.year.toString().slice(-2)}${tiempo}`;
        break;

      case 'YYMMDD':
        _fecha = `${data.year.toString().slice(-2)}${separador}${data.mes}${separador}${data.dia}${tiempo}`;
        break;

      case 'DATE-IN-WORDS':
        if (config?.incluirHora) {
          _fecha = date.toLocaleString('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'America/Mexico_City'
          });

          break;
        }

        _fecha = date.toLocaleString('es-MX', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'America/Mexico_City'
        });
        break;

      default:
        _fecha = `${data.dia}${separador}${data.mes}${separador}${data.year} ${tiempo}`;
        break;
    }

    return _fecha.trim();
  }

  /**
   * Genera una cadena única de dígitos irrepetibles.
   * - Utiliza los números del 0 al 9.
   * - Aplica el algoritmo de Fisher-Yates para mezclar aleatoriamente.
   * - Por defecto devuelve una cadena de 8 dígitos.
   *
   * @param length - Longitud deseada de la cadena (opcional, por defecto 8).
   * @returns Una cadena de dígitos únicos en orden aleatorio.
   *
   * @example
   * generarCadenaUnica();
   * // Resultado posible: "50791326"
   *
   * generarCadenaUnica(5);
   * // Resultado posible: "48207"
   */
  public generarCadenaUnicaNumerica(length: number = 8): string {
    length = length == undefined ? 8 : length;
    // Creamos un array con los dígitos del 0 al 9
    const digitos = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    for (let i = digitos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [digitos[i], digitos[j]] = [digitos[j], digitos[i]];
    }

    // Tomamos los primeros "length" y los unimos en una cadena
    return digitos.slice(0, length).join('');
  }

  /**
   * Convierte una cadena en formato snake_case o kebab-case a camelCase.
   * @param key - Cadena de texto a transformar.
   * @returns La cadena transformada a camelCase.
   *
   * Ejemplo:
   *  toCamelCase("fecha_inicio_vigencia") -> "fechaInicioVigencia"
   */
  private toCamelCase(key: string): string {
    return key.toLowerCase().replace(/[_-](\w)/g, (_, c) => c.toUpperCase());
  }

  /**
   * Transforma todas las claves de un objeto a camelCase.
   * @param obj - Objeto con claves en snake_case o kebab-case.
   * @returns Nuevo objeto con las claves en camelCase.
   *
   * Ejemplo:
   *  transformToCamelCase({ fecha_inicio_vigencia: "2025-12-08" })
   *  -> { fechaInicioVigencia: "2025-12-08" }
   */
  public transformToCamelCase<T extends Record<string, any>>(obj: T): Record<string, any> {
    const newObj: Record<string, any> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[this.toCamelCase(key)] = obj[key];
      }
    }
    return newObj;
  }

  /**
   * Transforma todas las claves de los objetos dentro de un arreglo a camelCase.
   * @param arr - Arreglo de objetos con claves en snake_case o kebab-case.
   * @returns Nuevo arreglo con objetos cuyas claves están en camelCase.
   *
   * Ejemplo:
   *  transformArrayToCamelCase([{ fecha_inicio_vigencia: "2025-12-08" }])
   *  -> [{ fechaInicioVigencia: "2025-12-08" }]
   */
  public transformArrayToCamelCase<T extends Record<string, any>>(arr: T[]): Record<string, any>[] {
    return arr.map((item) => this.transformToCamelCase(item));
  }

  /**
   * Convierte las claves de un objeto o arreglo a formato camelCase.
   * - Si la entrada es un arreglo, aplica la transformación recursivamente a cada elemento.
   * - Si la entrada es un objeto, transforma todas sus claves a camelCase.
   * - Si la entrada es un valor primitivo, lo devuelve sin cambios.
   *
   * @typeParam T - Tipo genérico que representa la estructura de salida.
   * @param input - Objeto, arreglo o valor primitivo a transformar.
   * @returns El mismo objeto/arreglo con las claves en camelCase.
   *
   * @example
   * camelKeys({ fecha_inicio_vigencia: "2025-12-08" });
   * // Resultado: { fechaInicioVigencia: "2025-12-08" }
   *
   * camelKeys([{ usuario_nombre: "Juan" }]);
   * // Resultado: [{ usuarioNombre: "Juan" }]
   */
  public camelKeys<T>(input: any): T {
    if (isArray(input)) {
      return input.map((item) => this.camelKeys(item)) as T;
    }

    if (isObject(input)) {
      return Object.keys(input).reduce((acc: any, key: string) => {
        const newKey = camelCase(key);
        acc[newKey] = this.camelKeys(input[key]);
        return acc;
      }, {}) as T;
    }

    return input as T;
  }

  /**
   * Sube un archivo al sistema de almacenamiento local.
   *
   * @param {object} file - Objeto con los datos del archivo a subir.
   * @param {string} file.path - Ruta donde se almacenará el archivo.
   * @param {string} file.content - Contenido del archivo en base64.
   * @param {string} [file.nombre] - Nombre original del archivo (opcional).
   * @param {'pdf' | 'xml' | 'png' | 'pen' | 'jpg' | 'jpeg' | 'txt' | 'csv' | 'xls' | 'xsls' | 'svg' | 'cer'} file.extension - Extensión del archivo.
   *
   * @returns {Promise<{ upload: boolean; message?: string; file?: { path: string; name: string; originalName: string } }>}
   *   - upload: indica si la carga fue exitosa.
   *   - message: mensaje descriptivo en caso de error.
   *   - file: información del archivo cargado (ruta, nombre generado, nombre original).
   *
   * @throws {Error} Si faltan parámetros obligatorios (path, content, extension).
   *
   * @example
   * const result = await uploadFile({
   *   path: "/storage/tickets",
   *   content: "data:application/pdf;base64,JVBERi0xLjQK...",
   *   nombre: "ticketOriginal.pdf",
   *   extension: "pdf"
   * });
   *
   * if (result.upload) {
   * } else {
   *   console.error("Error:", result.message);
   * }
   */
  public async uploadFile(file: {
    path: string;
    content: string;
    nombre?: string;
    extension: 'pdf' | 'xml' | 'png' | 'pen' | 'jpg' | 'jpeg' | 'txt' | 'csv' | 'xls' | 'xsls' | 'svg' | 'cer';
  }): Promise<{
    upload: boolean;
    message?: string;
    file?: { path: string; name: string; originalName: string };
  }> {
    try {
      // Validaciones de parámetros obligatorios
      if (!file.path) throw new Error(`El campo "path" es obligatorio`);
      if (!file.content) throw new Error(`El campo "content" es obligatorio`);
      if (!file.extension) throw new Error(`El campo "extension" es obligatorio`);

      // Normaliza la ruta
      const normalizedPath = file.path.endsWith('/') ? file.path.slice(0, -1).trim() : file.path.trim();

      // Crea carpeta si no existe
      if (!fs.existsSync(normalizedPath)) {
        fs.mkdirSync(normalizedPath, { recursive: true });
      }

      // Decodifica contenido base64
      const base64Data = file.content.includes(',')
        ? file.content.split(',')[1] // elimina encabezado data:...
        : file.content;

      let buffer: Buffer;
      if (file.extension.toLowerCase() === 'xml') {
        // Para XML se asegura codificación UTF-8
        buffer = Buffer.from(base64Data, 'base64');
      } else {
        buffer = Buffer.from(base64Data, 'base64');
      }

      // Genera nombre único
      const timestamp = Date.now();
      const namefile = `${timestamp}.${file.extension.toLowerCase()}`;
      const originalName = file.nombre ?? 'No definido';
      const fullPath = path.join(normalizedPath, namefile);

      // Escribe archivo
      fs.writeFileSync(fullPath, buffer);

      return {
        upload: true,
        file: {
          path: fullPath,
          name: namefile,
          originalName: originalName ?? ''
        }
      };
    } catch (error: any) {
      return { upload: false, message: error.message };
    }
  }

  /**
   * Obtiene un archivo del servidor y lo convierte a Base64
   * @param path Ruta relativa desde la raíz del proyecto (ej: 'uploads/foto.jpg')
   * @param type Tipo de lectura del arhivo 'TXT' | 'PDF' | 'PNG' | 'JPG' | 'JPEG' | 'XML' | 'XLSX' | 'XLS'
   *
   * Respuesta del archivo en formato base64
   */
  public async getFile(params: { path: string; type: string }): Promise<{
    success: boolean;
    message?: string;
    file: {
      type?: string;
      content?: string;
    };
  }> {
    try {
      //Extensiones
      const extensions: Record<string, string> = {
        TXT: 'data:text/plain;base64,',
        PDF: 'data:application/pdf;base64,',
        PNG: 'data:image/png;base64,',
        JPG: 'data:image/jpeg;base64,',
        JPEG: 'data:image/jpeg;base64,',
        XML: 'data:application/xml;base64,',
        XLSX: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,',
        XLS: 'data:application/vnd.ms-excel;base64,'
      };

      //Se valida el tipo de archivo para generación correcta del MIME type estándar del archivo
      if (!extensions[params.type.toUpperCase()]) {
        throw new Error(
          `El tipo  ${params.type} no se encuentra dentro la configuración de extensiones: 'TXT' | 'PDF' | 'PNG' | 'JPG' | 'JPEG' | 'XML' | 'XLSX' | 'XLS'.`
        );
      }

      //Ruta absoluta del directorio/archivo
      const absolutePath = join(process.cwd(), params.path);

      //Se Verifica si el archivo existe
      if (!existsSync(absolutePath)) {
        throw new Error(`El archivo en la ruta ${params.path} no existe.`);
      }

      const fileBuffer = readFileSync(absolutePath);
      const base64Content = fileBuffer.toString('base64');

      return {
        success: true,
        file: {
          //Type real basado en TIPO del archivo físico,
          type: extensions[params.type.toUpperCase()],
          content: base64Content
        }
      };
    } catch (e: any) {
      return {
        success: false,
        message: e.message,
        file: {}
      };
    }
  }

  /**
   * Elimina un archivo del sistema de almacenamiento.
   *
   * @param {string} [path] - Ruta completa del archivo a eliminar.
   * @param {boolean} [isPdf] - Indica si debe validarse que el archivo sea PDF antes de eliminarlo.
   *
   * @returns {Promise<{ success: boolean; message?: string }>}
   *   - success: indica si la eliminación fue exitosa.
   *   - message: mensaje descriptivo en caso de error.
   *
   * @throws {Error} Si no se proporciona la ruta o si el archivo no existe.
   *
   * @example
   * const result = await unlinkFile("/storage/tickets/123456.pdf", true);
   * if (result.success) {
   * } else {
   *   console.error("Error:", result.message);
   * }
   */
  public async unlinkFile(path?: string, isPdf?: boolean): Promise<{ success: boolean; message?: string }> {
    try {
      if (!path) {
        throw new Error(`No se adjuntado un path de validación para eliminar el archivo`);
      }

      // Validación adicional si es PDF
      if (isPdf) {
        const file = readFileSync(path);
        if (!isPDF(file)) {
          throw new Error(`Archivo no encontrado`);
        }
      }

      // Elimina archivo del sistema
      await fs.unlink(path, async (response: any) => {});

      return { success: true, message: 'Archivo eliminado correctamente' };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

  /**
   * Codifica un string en base64 asegurando compatibilidad con caracteres Unicode.
   *
   * @param {string} str - Texto a codificar.
   * @returns {string} Texto codificado en base64.
   *
   * @example
   * const encoded = b64EncodeUnicode("Texto con acentos áéíóú");
   */
  public b64EncodeUnicode(str: string) {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode(parseInt(p1, 16));
      })
    );
  }

  /**
   * Convierte una cantidad numérica a letras con formato:
   * "X PESOS YY/100 M.N."
   * @param cantidad
   */
  public importeEnLetras(cantidad: number | string): string {
    const num = Number(cantidad);

    if (isNaN(num)) {
      throw new Error('Cantidad inválida');
    }

    const enteros = Math.floor(num);
    const centavos = Math.round((num - enteros) * 100);

    const letrasEnteros = this.convertirMiles(enteros);
    const letrasCentavos = centavos.toString().padStart(2, '0');

    return `${letrasEnteros} PESOS ${letrasCentavos}/100 M.N.`;
  }

  /**
   * Convierte números menores a 1000
   * @param num
   */
  private numeroALetras(num: number): string {
    const special: Record<number, string> = {
      11: 'ONCE',
      12: 'DOCE',
      13: 'TRECE',
      14: 'CATORCE',
      15: 'QUINCE',
      20: 'VEINTE'
    };

    const valorPosicional = {
      unidades: ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'],
      decenas: ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'],
      especiales: special,
      centenas: [
        '',
        'CIENTO',
        'DOSCIENTOS',
        'TRESCIENTOS',
        'CUATROCIENTOS',
        'QUINIENTOS',
        'SEISCIENTOS',
        'SETECIENTOS',
        'OCHOCIENTOS',
        'NOVECIENTOS'
      ]
    };

    if (num === 0) return 'CERO';
    if (num === 100) return 'CIEN';

    let letras = '';

    // Centenas
    if (num >= 100) {
      letras += valorPosicional.centenas[Math.floor(num / 100)] + ' ';
      num = num % 100;
    }

    // Especiales (11–15, 20)
    if (valorPosicional.especiales[num]) return letras + valorPosicional.especiales[num];

    // Decenas
    if (num >= 10) {
      letras += valorPosicional.decenas[Math.floor(num / 10)];
      num = num % 10;
      if (num > 0) letras += ' Y ';
    }

    // Unidades
    letras += valorPosicional.unidades[num];

    return letras.trim();
  }

  /**
   * Maneja miles y millones
   * @param num
   */
  private convertirMiles(num: number): string {
    if (num < 1000) return this.numeroALetras(num);

    if (num < 1_000_000) {
      const miles = Math.floor(num / 1000);
      const resto = num % 1000;

      const milesTexto = miles === 1 ? 'MIL' : `${this.numeroALetras(miles)} MIL`;
      const restoTexto = resto > 0 ? ` ${this.numeroALetras(resto)}` : '';

      return `${milesTexto}${restoTexto}`.trim();
    }

    const millones = Math.floor(num / 1_000_000);
    const resto = num % 1_000_000;

    const millonesTexto = millones === 1 ? 'UN MILLÓN' : `${this.numeroALetras(millones)} MILLONES`;
    const restoTexto = resto > 0 ? ` ${this.convertirMiles(resto)}` : '';

    return `${millonesTexto}${restoTexto}`.trim();
  }
}
