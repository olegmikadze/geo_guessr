import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SignUpDTO } from './dto/signup.dto';
import { SignInDTO } from './dto/signin.dto';
import { LogOutResponse } from './types/logout.types';
import { UserRefreshPayload } from './types/user-payload.type';
import { JwtPayload } from './types/jwt-payload.type';
import { Tokens } from './types/tokens.type';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/publicRoute.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { RefreshGuard } from './guards/refresh-jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() body: SignUpDTO): Promise<Tokens> {
    return await this.authService.signUp(body);
  }

  @Post('/sign-in')
  @Public()
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: SignInDTO): Promise<Tokens> {
    return await this.authService.signIn(body);
  }

  @ApiBearerAuth()
  @Post('/log-out')
  async logOut(@User() user: JwtPayload): Promise<LogOutResponse> {
    return await this.authService.logOut({ userId: user.sub });
  }

  @Post('/refresh-token')
  @Public()
  @UseGuards(RefreshGuard)
  @ApiBearerAuth()
  async refreshToken(@User() user: UserRefreshPayload) {
    return this.authService.refreshToken({
      userId: user.sub,
      refreshToken: user.refreshToken,
    });
  }
}
