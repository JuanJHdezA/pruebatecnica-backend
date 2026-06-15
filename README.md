Esta API ha sido desarrollada con **NestJS** siguiendo una arquitectura modular y escalable. Su propósito principal es gestionar el catálogo de productos y asegurar la integridad de los datos mediante una integración robusta con **Supabase (PostgreSQL)** y una capa de seguridad personalizada.

## Stack Tecnológico

- **Framework:** [NestJS](https://nestjs.com/)
- **Lenguaje:** TypeScript
- **Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Gestión de Dependencias:** npm

## Arquitectura del Proyecto

El proyecto sigue una estructura modular diseñada para separar responsabilidades y facilitar el mantenimiento:

```text
src/
├── apis/            # Módulos de dominio (productos, security)
├── common/          # Recursos compartidos (DTOs, Enums, Guards, Filtros)
├── modules/         # Módulos core de la aplicación
├── services/        # Servicios de infraestructura (Supabase, JWT, Cifrado)
└── environments/    # Gestión de variables de entorno

```

### 1. Requisitos previos

- **Node.js**: v18.0.0 o superior.
- **NestJS CLI**: Instalación recomendada `npm i -g @nestjs/cli`.

### 2. Instalación

Clona el repositorio e instala las dependencias necesarias:

```bash
npm install

```

### 3. Variables de Entorno

Por políticas de seguridad, las credenciales sensibles han sido excluidas. Para configurar el proyecto:

1. Ubícate en `src/environments/`.
2. Asigna las variables de conexión de tu instancia de **Supabase**.

## 🚀 Comandos Disponibles

| Script               | Descripción                                         |
| -------------------- | --------------------------------------------------- |
| `npm run start:dev`  | Inicia el servidor en modo desarrollo (Watch Mode). |
| `npm run build`      | Compila la aplicación para producción.              |
| `npm run start:prod` | Inicia la aplicación compilada.                     |
| `npm run test`       | Ejecuta la suite de pruebas unitarias.              |
| `npm run lint`       | Analiza la calidad y estilo del código.             |

## 🛡️ Aspectos Técnicos Destacados

- **Seguridad:** Implementación de _Guards_ personalizados en `src/common/guard/` para la gestión de permisos y autenticación.

- **Observabilidad:** Middleware `cors-logger` integrado para el monitoreo de peticiones entrantes y depuración de CORS.

- **Modularidad:** Arquitectura desacoplada que permite extender la funcionalidad de nuevos módulos sin afectar el núcleo del sistema.
