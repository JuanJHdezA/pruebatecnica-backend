import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { sessionRpsInterface } from '../../../apis/security/login/interfaces/login.services.interface';

@Injectable()
export class SessionService {
  constructor(private readonly supabaseService: SupabaseService) {}

  public async getDataSession<T>(user: { usuario: string }): Promise<sessionRpsInterface<T>> {
    try {
      const { data, error } = await this.supabaseService.supabase
        .from('usuarios')
        .select('*')
        .eq('usuario', user.usuario?.toLocaleLowerCase() ?? '')
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
