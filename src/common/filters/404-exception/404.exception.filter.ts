import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // Al no pasar parámetros, captura ABSOLUTAMENTE TODO
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.getResponse() : 'Error crítico en el servidor';

    // Aquí es donde tú controlas la respuesta final
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'object' ? message['message'] : message
    });
  }
}
