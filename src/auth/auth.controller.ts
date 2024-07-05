import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { Public } from 'src/common/decorators/public-route.decorator';
import { Tokens } from './types/tokens.type';
import { SignInDto } from './dto/signIn.dto';
import { LogOutResponse } from './types/logOut.types';
import { User } from 'src/common/decorators/user.decorator';
import { RefreshGuard } from './guards/refresh-jwt.guard';
import { UserRefreshPayload } from './types/userPayload.type';
import { JwtPayload } from './types/jwtPayload.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto): Promise<Tokens> {
    return await this.authService.signUp(signUpDto);
  }

  @Post('/signIn')
  @Public()
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto): Promise<Tokens> {
    return await this.authService.signIn(signInDto);
  }

  @Post('/logOut')
  async logOut(@User() user: JwtPayload): LogOutResponse {
    return await this.authService.logOut({ userId: user.sub });
  }

  @Post('/refreshTokens')
  @Public()
  @UseGuards(RefreshGuard)
  async refreshTokens(@User() user: UserRefreshPayload) {
    return this.authService.refreshTokens({
      userId: user.sub,
      refreshToken: user.refreshToken,
    });
  }
}
