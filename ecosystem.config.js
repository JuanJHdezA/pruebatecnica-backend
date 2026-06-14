module.exports = config_ecosystem_datos = {
  apps: {
    name: 'SEGUIMIENTO_PROYECTOS.API',
    script: __dirname + '/dist/main.js',
    watch: false,
    ignore_watch: ['node_modules', './pm2.log/err.log', './pm2.log/out.log'],
    error_file: './pm2.log/err.log',
    out_file: './pm2.log/out.log',
    env: {
      SECRET: '',
      NODE_ENV: 'production',
      PORT: 3107,
      LOGS: true
    }
  }
};
