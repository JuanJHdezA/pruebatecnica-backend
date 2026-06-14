import { Injectable } from '@nestjs/common';
import { CreateLogoutDto } from './dto/create-logout.dto';
import { UpdateLogoutDto } from './dto/update-logout.dto';

/**
 *
 */
@Injectable()
export class LogoutService {
  /**
   *
   * @param createLogoutDto
   */
  create(createLogoutDto: CreateLogoutDto) {
    return 'This action adds a new logout';
  }

  /**
   *
   */
  findAll() {
    return `This action returns all logout`;
  }

  /**
   *
   * @param id
   */
  findOne(id: number) {
    return `This action returns a #${id} logout`;
  }

  /**
   *
   * @param id
   * @param updateLogoutDto
   */
  update(id: number, updateLogoutDto: UpdateLogoutDto) {
    return `This action updates a #${id} logout`;
  }

  /**
   *
   * @param id
   */
  remove(id: number) {
    return `This action removes a #${id} logout`;
  }
}
