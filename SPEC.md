# Backend - Especificaciones Técnicas

## 1. Información General

- **Nombre del proyecto**: Prueba Técnica
- **Versión**: 0.0.1
- **Framework principal**: NestJS 11.x

## 2. Stack Tecnológico

### Framework y Lenguaje

| Componente | Tecnología | Versión  |
| ---------- | ---------- | -------- |
| Framework  | NestJS     | ^11.1.14 |
| Lenguaje   | TypeScript | ^5.9.3   |
| Runtime    | Node.js    | -        |

### Base de Datos

| Componente | Tecnología         | Versión |
| ---------- | ------------------ | ------- |
| ORM        | TypeORM            | ^0.3.28 |
| Driver     | PostgreSQL (pg)    | ^8.18.0 |
| Entidades  | Generadas desde DB | -       |

### Autenticación y Seguridad

| Componente   | Tecnología       | Versión |
| ------------ | ---------------- | ------- |
| JWT          | @nestjs/jwt      | ^11.0.2 |
| Passport     | @nestjs/passport | ^11.0.5 |
| Passport JWT | passport-jwt     | ^4.0.1  |

### Procesamiento y Utilidades

| Componente   | Tecnología            | Versión           |
| ------------ | --------------------- | ----------------- |
| HTTP Client  | Axios + @nestjs/axios | ^1.13.5           |
| Validación   | class-validator + Joi | ^0.14.3 / ^18.0.2 |
| Logging      | Winston               | ^3.19.0           |
| PDF          | pdf-lib, jspdf        | ^1.17.1 / ^4.2.0  |
| QR Code      | qrcode                | ^1.5.4            |
| Canvas       | canvas                | ^3.2.1            |
| Email        | nodemailer            | ^8.0.1            |
| Encriptación | crypto-js             | ^4.2.0            |
| Moneda       | currency.js           | ^2.0.4            |

### Testing

| Herramienta | Tecnología | Versión |
| ----------- | ---------- | ------- |
| Testing     | Jest       | ^30.2.0 |
| Supertest   | supertest  | ^7.2.2  |

### Documentación

| Herramienta     | Tecnología | Versión |
| --------------- | ---------- | ------- |
| Generación docs | JSDoc      | ^4.0.5  |

### Linting y Formateo

| Herramienta | Tecnología | Versión |
| ----------- | ---------- | ------- |
| Linter      | ESLint     | ^10.0.2 |
| Formateo    | Prettier   | ^3.8.1  |

## 3. Estructura del Proyecto

```
src/
├── apis/                    # Módulos de API
│   ├── api.module.ts        # Módulo raíz de APIs
│   ├── configuraciones/      # Módulo de configuraciones
│   ├── estructura-ejecutiva/ # Módulo de estructura ejecutiva
│   ├── security/            # Módulo de seguridad
├── common/                  # Componentes compartidos
│   ├── class/               # Clases utilitarias
│   ├── const/               # Constantes
│   ├── dto/                 # Data Transfer Objects
│   ├── entities/            # Entidades TypeORM
│   ├── enum/                # Enumeraciones
│   ├── filters/             # Filtros de excepciones
│   ├── guard/               # Guards de autenticación
│   ├── interceptors/        # Interceptores
│   ├── interfaces/          # Interfaces TypeScript
│   ├── middlewares/         # Middlewares
│   ├── modules/             # Módulos comunes
│   └── services/            # Servicios compartidos
├── environments/            # Variables de entorno
├── app.controller.ts       # Controlador principal
├── app.controller.spec.ts  # Tests del controlador
├── app.module.ts           # Módulo principal
├── app.service.ts          # Servicio principal
└── main.ts                  # Punto de entrada
```

## 4. Módulos de la API

### Security Module

- Autenticación JWT
- Autorización y permisos
- Gestión de usuarios
