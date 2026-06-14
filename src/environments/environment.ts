export const environments = {
  production: false,
  debugger: false, //Desactiva validaciones por cabeceras y metricas de seguridad
  deployment: {
    ambiente: 'develoment-local',
    domain: 'http://localhost',
    keys: {
      //claves de encriptación de body AES 256
      key: '', //Llave de encriptacion (KEY)
      xChannel: '',
      iv: '' //Vector de inicializacion (IV Publica),
    }
  },
  Databases: {
    PostgreSQL: {}
  },
  supabaseConfig: {
    SUPABASE_URL: 'https://peyraquaendvfpiidlyy.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: ''
  },
  loggings: false, //Monitorio, Auditoria e Inspección de procesos de aplicación
  PORT: 3000,
  enableSSL: false,
  SSLConfig: {
    cert: '',
    key: ''
  },
  jwtConfig: {
    api: {
      //Enpoint expuestas por Aplicacción
      secret: '',
      expiresIn: 3600 * 60 //1 hora de vigencia
    },
    ws: {
      //Enpoint expuestas por WS
      secret: '',
      expiresIn: 60 //1 hora de vigencia
    }
  },
  mailConfig: {
    nodemailer: {
      pool: true,
      maxConnections: 10,
      host: 'correo.tabasco.gob.mx',
      port: 25,
      secure: false,
      auth: { user: '', pass: '' }, //Correo Tabasco
      tls: {
        // do not fail on invalid certs
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    }
  },
  ResourceWhiteList: [
    //Lista blanca
    'http://localhost:4200' //Portal
  ],

  HTTPResponse: {
    //Códigos de respuesta a cliente Códigos HTTP
    Unauthorized: 401, //No autorizado
    success: 200, //O.K. Success
    NotAcceptable: 406, //No aceptable
    conflict: 409, //Conflicto
    IamTeapot: 418, // indica que el servidor no puede cumplir con la solicitud, no porque sea un error real, sino porque el servidor se considera una tetera y no puede preparar café.
    ExpectationFailed: 417, //Expectativa fallida
    failedDependency: 424, //Dependencia fallida
    RequiredPrecondition: 428 //Condición previa requerida
  }
};
