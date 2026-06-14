// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginJsdoc from 'eslint-plugin-jsdoc';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist', 'node_modules']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        // Agregamos explícitamente process para evitar errores de referencia
        process: 'readonly'
      },
      sourceType: 'module', // NestJS usa módulos de ES
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname ?? null
      }
    },
    plugins: {
      jsdoc: eslintPluginJsdoc
    }
  },
  {
    rules: {
      // --- Prettier ---
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      // --- Documentación obligatoria ---
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true
          }
        }
      ],
      'jsdoc/require-description': 'error',
      'jsdoc/require-param': 'error',
      'jsdoc/require-returns': 'error',

      // --- Tipado (AJUSTADO PARA GLOBALES) ---

      // 1. Cambiamos 'error' a 'off' para permitir 'any' cuando sea necesario (como en process.env)
      '@typescript-eslint/no-explicit-any': 'off',

      // 2. Desactivamos reglas de "inspección de flujo" que fallan con variables 'any'
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',

      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: false, allowTypedFunctionExpressions: true }
      ],

      '@typescript-eslint/typedef': [
        'error',
        {
          parameter: true,
          propertyDeclaration: true,
          memberVariableDeclaration: true,
          // CAMBIO CLAVE: variableDeclaration en false permite constantes globales sin tipar
          variableDeclaration: false,
          variableDeclarationIgnoreFunction: true,
          arrayDestructuring: false,
          arrowCallSignature: false,
          objectDestructuring: false
        }
      ],

      // --- Consistencia en nombres ---
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'function', format: ['PascalCase'] },
        { selector: 'method', format: ['PascalCase'] },
        { selector: 'interface', format: ['PascalCase'], suffix: ['Interface'] },
        { selector: 'typeAlias', format: ['PascalCase'], suffix: ['Dto'] },
        { selector: 'enum', format: ['PascalCase'], suffix: ['Enum'] },
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['UPPER_CASE', 'camelCase'], // Permitimos camelCase por si acaso
          // Eliminamos 'types' restrictivos para que no falle con objetos complejos o process.env
          filter: {
            regex: '^[A-Z0-9_]+$',
            match: true
          }
        }
      ],

      // --- Buenas prácticas ---
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn'
    }
  }
);
