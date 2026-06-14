import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // <--- VERIFICAR ESTA RUTA
import { JwtModule } from '@nestjs/jwt';
import { AuthPrivateGuard } from '../guard/auth/private/auth-private.guard';
import { EncryptionService } from '../services/encryption/encryption.service';
import { environments } from '../../environments/environment';
import { SessionService } from '@common/services/session/session.service';
import { SupabaseService } from '@common/services/supabase/supabase.service';

const keys = environments.jwtConfig.api;

@Global()
@Module({
  imports: [
    // El HttpModule es el que provee el AXIOS_INSTANCE_TOKEN
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    }),
    JwtModule.register({
      secret: keys.secret,
      signOptions: { expiresIn: keys.expiresIn }
    })
  ],
  providers: [AuthPrivateGuard, EncryptionService, SessionService, SupabaseService],
  exports: [AuthPrivateGuard, EncryptionService, SessionService, JwtModule, HttpModule, SupabaseService]
})
export class PruebaTecnicaModule {}
