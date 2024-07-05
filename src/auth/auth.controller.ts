import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { Public } from 'src/common/decorators/public-route.decorator';
import { Tokens } from './types/tokens.type';
import { SignInDto } from './dto/signIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signUp')
  async signUp(@Body() signUpDto: SignUpDto): Promise<Tokens> {
    return await this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('/signIn')
  async signIn(@Body() signInDto: SignInDto): Promise<Tokens> {
    return await this.authService.signIn(signInDto);
  }

  @Post('/logOut')
  logOut() {}

  @Post('/refreshTokens')
  refreshTokens() {}
}
