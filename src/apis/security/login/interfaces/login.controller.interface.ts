/**
 * Autor: Juan José Hernández Antonio
 * Fecha: 11/04/2026
 * Descripción: Interface que representa la información detallada de un usuario
 * dentro del sistema de control de login.
 * Última modificación:
 * Modificado:
 */
export interface userDataLoginCtrlInterface {
  id_usuario: number;
  created_at: string;
  usuario: string;
  password: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  fecha_vigencia: string;
  apikey: string;
  iv: string;
  validation?: 'USER_NO_FOUND';
}

export interface dataUser {
  code: string;
  mesage: string;
  user: {
    /** Identificador único o nombre de cuenta del usuario. */
    usuario: string;

    /** Información descriptiva y de perfil del usuario. */
    details: {
      /** Datos biográficos y de contacto. */
      personales: {
        nombre: string;
        apellidosPaternos: string;
        apellidosMaternos: string;
        /** Nombre completo formateado para visualización rápida. */
        fullname: string;
        email: string;
      };
      /** Representación en base64 o URL de la imagen de perfil; null si no tiene. */
      imgperfil: string | null;
    };

    /** Datos críticos de autenticación y seguridad para persistencia. */
    session: {
      /** Token de autorización (ej. JWT) para llamadas a la API. */
      token: string;
      /** Credenciales necesarias para procesos de cifrado/descifrado local. */
      credential: {
        /** Hash de la contraseña del usuario. */
        password: string;
        /** Parámetros de cifrado simétrico para proteger datos en local. */
        keys: {
          /** Clave secreta para cifrado AES. */
          key: string;
          /** Vector de inicialización para el algoritmo de cifrado. */
          iv: string;
        };
      };
    };

    /** Lista de roles o permisos asignados al usuario (ej: ["admin", "editor"]). */
    accesos: string[];
  };
}
