import { EncryptionService } from './../../../common/services/encryption/encryption.service';
import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { AuthPublicGuard } from '../../../common/guard/auth/public/auth-public.guard';
import { JwtModule } from '@nestjs/jwt';
import { environments } from '../../../environments/environment';

//Llaves de configuración para generación de JWT
const keys = environments.jwtConfig.api;

/**
 *
 */
@Module({
  controllers: [LoginController],
  imports: [
    JwtModule.register({
      secret: keys.secret,
      signOptions: { expiresIn: keys.expiresIn } // Ajuste de expiración
    })
  ],
  providers: [LoginService, AuthPublicGuard, EncryptionService]
})
export class LoginModule {}
