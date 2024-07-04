import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signIn')
  async signIn() {
    return await this.authService.signIn();
  }

  @Post('/signUp')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @Post('/logOut')
  logOut() {}

  @Post('/refreshTokens')
  refreshTokens() {}
}
