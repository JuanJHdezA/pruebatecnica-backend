/**
 * Autor: Juan José Hernández Antonio
 * Fecha: 11/04/2026
 * Descripción: Configuración Global de servidor
 * Última modificación:
 * Modificado:
 */

import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { environments } from './environments/environment';
import { ResponseInterceptor } from './common/interceptors/response/response.interceptor';
import { json } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Prefijo de aplicación
  app.setGlobalPrefix('apis-services');

  //Configuración de CORS
  app.enableCors({
    origin: [environments.ResourceWhiteList],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Api-Key', 'X-Chanel', 'X-Vector-Key', 'X-Code-Boarding'],
    credentials: true
  });

  //Respuesta global - respuestas exitosas/errores/excepciones
  app.useGlobalInterceptors(new ResponseInterceptor());

  /* 
  //Filtro de excepciones para rutas no encontradas y errores)
  app.useGlobalFilters(new AllExceptionsFilter()); */

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no estén definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si llegan propiedades extra no esperadas
      transform: true, // Transforma los tipos de datos al tipo definido en el DTO (ej. string → number, string → Date)
      exceptionFactory: (errors) => {
        // Personaliza los mensajes de error de validación
        const mensajes = errors.map((err) => {
          // Mensaje para propiedades no esperadas
          if (err.constraints?.whitelistValidation) {
            return `El parámetro <<${err.property}>> no está permitido en esta API.`;
          }

          // Mensajes de validación estándar
          if (err.constraints) {
            return Object.values(err.constraints);
          }

          // Mensaje genérico si no se detecta la causa
          return 'Error de validación desconocido.';
        });

        // Devuelve excepción con los mensajes personalizados
        return new BadRequestException(mensajes.flat());
      }
    })
  );
  app.use(json({ limit: '10mb' }));

  // configuracion de swagger
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api_doc', app, documentFactory);

  await app.listen(process.env.PORT ?? environments.PORT);
}
bootstrap();
