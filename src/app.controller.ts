import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from './common/decorators/publicRoute.decorator';

@Controller('')
export class AppController {
  @Get('/')
  @Public()
  @HttpCode(HttpStatus.OK)
  async helloWorld() {
    return { code: 200, message: 'Hello World!' };
  }
}
