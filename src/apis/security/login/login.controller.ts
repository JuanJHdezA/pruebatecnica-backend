/**
 * Autor: Juan José Hernández Antonio
 * Fecha: 11/04/2026
 * Descripción: Controlador de control de sesión y autenticación de usuarios
 * Última modificación:
 * Modificado:
 */
import { Controller, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { JwtService } from '@nestjs/jwt';
import { sessionRpsInterface } from './interfaces/login.services.interface';
import { dataUser, userDataLoginCtrlInterface } from './interfaces/login.controller.interface';
import { loginValidationConst as validations } from './const/login.const';
import { LoginGuard } from '@common/guard/auth/login/login.guard';
import { EncryptionService } from '@common/services/encryption/encryption.service';
@Controller('session')
export class LoginController {
  /**
   *
   * @param loginService
   * @param jwtService
   */
  constructor(
    private readonly loginService: LoginService,
    private readonly jwtService: JwtService,
    private readonly EncryptionService: EncryptionService
  ) {}

  /**
   * Endpoint de inicio de sesión.
   *
   * @route POST /session/login
   * @guard AuthPublicGuard - Permite acceso público con validación previa.
   *
   * @param {CreateLoginDto} LoginDto - DTO con las credenciales de acceso:
   *  - usuario: string
   *  - password: string
   *
   * @returns {Promise<object>} Objeto con:
   *  - Datos del usuario (personales y laborales).
   *  - Imagen de perfil (si existe).
   *  - Token JWT para la sesión.
   *  - Estado de vigencia y registro del usuario.
   *
   * @throws {BadRequestException} Si las credenciales son inválidas o el usuario no cumple validaciones.
   */

  @Post('login')
  @UseGuards(LoginGuard)
  public async login(@Body() LoginDto: CreateLoginDto) {
    try {
      const rps: sessionRpsInterface<userDataLoginCtrlInterface> = await this.loginService.getUser(LoginDto);
      if (rps?.error) {
        if (!rps?.data?.validation) {
          throw new Error(rps.message ?? 'Servicio no disponible');
        } else {
          return {
            code: 'USUARIO_NOVALIDO',
            mesage: rps?.message ?? 'Servicio no Disponible',
            user: {}
          };
        }
      }

      const { error, message, data } = rps;
      const payload = {
        usuario: LoginDto.usuario,
        iv: rps?.data?.iv ?? '',
        key: rps?.data?.apikey ?? ''
      };

      /* Cifrado seguro del JWT por proceso de polítias */
      const token = this.jwtService.sign(payload);

      const dtpersonales = {
        nombre: data?.nombre ?? '',
        appPat: data?.apellido_paterno ?? '',
        appMat: data?.apellido_materno ?? ''
      };

      const sesion: dataUser = {
        code: 'LOGIN_SUCCESS',
        mesage: 'Inicio de sesión exitoso',
        user: {
          usuario: LoginDto?.usuario,
          details: {
            personales: {
              nombre: dtpersonales.nombre,
              apellidosPaternos: dtpersonales.appPat,
              apellidosMaternos: dtpersonales.appMat,
              fullname: `${dtpersonales.nombre} ${dtpersonales.appPat} ${dtpersonales.appMat}`,
              email: data?.email
            },
            imgperfil: null
          },
          session: {
            token: token ?? null,
            credential: {
              password: LoginDto.password,
              keys: { key: data?.apikey, iv: data?.iv }
            }
          },
          accesos: []
        }
      };

      return sesion;
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }
}
