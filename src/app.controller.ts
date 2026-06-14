import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 *
 */
@Controller()
export class AppController {
  /**
   *
   * @param appService
   */
  constructor(private readonly appService: AppService) {}

  /**
   *
   */
  @Get() getRoot(): string {
    return 'API funcionando correctamente 🚀';
  }
}
