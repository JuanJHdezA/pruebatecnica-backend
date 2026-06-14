/**
 * Autor: Juan José Hernández Antonio
 * Fecha: 11/04/2026
 * Descripción: Configuración Global Modulos y recursos de aplicación
 * Última modificación:
 * Modificado:
 */
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppService } from './app.service';
import { ApisModule } from './apis/api.module';
import { EncryptionService } from './common/services/encryption/encryption.service';
import { AccessPermissionsGuard } from './common/guard/access-permissions/access-permissions.guard';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { environments } from './environments/environment';
import { JwtStrategyService } from './common/services/jwt/jwt.service';
import { AuthPrivateGuard } from './common/guard/auth/private/auth-private.guard';
import { AuthPublicGuard } from './common/guard/auth/public/auth-public.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { PruebaTecnicaModule } from '@common/modules/pruebatecnica.module';

@Module({
  imports: [
    ApisModule,
    PassportModule, //Configuración de lectura de JWT
    JwtModule.register({
      secret: environments.jwtConfig.api.secret,
      signOptions: { expiresIn: environments.jwtConfig.api.expiresIn } // Ajuste de expiración
    }),
    PruebaTecnicaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      // Sin asteriscos para evitar el PathError
      exclude: ['/apis-services/:splat*']
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'storage'),
      serveRoot: '/storage',
      exclude: ['/apis-services/:splat*']
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      //Permisos de Accesos - Validaciones de llaves y credenciales de acceso
      provide: APP_GUARD,
      useClass: AccessPermissionsGuard
    },
    EncryptionService,
    JwtStrategyService,
    AuthPrivateGuard,
    AuthPublicGuard
  ]
})
export class AppModule {}
