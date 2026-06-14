import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogoutService } from './logout.service';

/**
 *
 */
@Controller('logout')
export class LogoutController {
  /**
   *
   * @param logoutService
   */
  constructor(private readonly logoutService: LogoutService) {}
}
