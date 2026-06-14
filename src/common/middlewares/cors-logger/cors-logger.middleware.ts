import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 *
 */
@Injectable()
export class CorsLoggerMiddleware implements NestMiddleware {
  /* Se verifica el tipo de método de entrada al servicio */
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
      console.log('--- Preflight Request (OPTIONS) ---');
      console.log('Origin:', req.headers.origin);
      console.log('Access-Control-Request-Method:', req.headers['access-control-request-method']);
      console.log('Access-Control-Request-Headers:', req.headers['access-control-request-headers']);
    }
    next();
  }
}
