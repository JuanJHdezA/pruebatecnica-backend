import { Injectable } from '@nestjs/common';
import { sessionRpsInterface } from './interfaces/login.services.interface';
import { SupabaseService } from '@common/services/supabase/supabase.service';

/**
 *
 */
@Injectable()
export class LoginService {
  /**
   *
   * @param dataSource
   */
  constructor(private readonly supabaseService: SupabaseService) {}

  public async getUser<T>(user: { usuario: string; password: string }): Promise<sessionRpsInterface<T>> {
    try {
      const { data, error } = await this.supabaseService.supabase
        .from('usuarios')
        .select('*')
        .eq('usuario', user.usuario?.toLocaleLowerCase() ?? '')
        .eq('password', user.password ?? '')
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return {
          error: true,
          message: 'Usuario o contraseña incorrectos',
          data: { validation: 'USER_NO_FOUND' } as T
        };
      }

      return {
        error: false,
        message: 'Petición ejecutada correctamente',
        data: data as T
      };
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : 'Error desconocido';
      return { error: true, message: errMsg, data: {} as T };
    }
  }
}
