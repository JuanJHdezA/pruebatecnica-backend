import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { environments } from '@environments/environment';
import { EncryptionService } from '../common/services/encryption/encryption.service';
import { SecurityModule } from './security/security.module';
import { PruebaTecnicaModule } from '@common/modules/pruebatecnica.module';
import { ProductosModule } from './productos/productos.module';

//Llaves de configuración para generación de JWT
const keys = environments.jwtConfig.api;

@Module({
  imports: [
    SecurityModule,
    PruebaTecnicaModule,
    JwtModule.register({
      secret: keys.secret,
      signOptions: { expiresIn: keys.expiresIn } // Ajuste de expiración
    }),
    ProductosModule
  ],
  providers: [EncryptionService]
})
export class ApisModule {}
