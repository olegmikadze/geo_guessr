import { Controller, Get } from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/jwtPayload.type';
import { User } from 'src/common/decorators/user.decorator';
import { UsersService } from './users.service';
import { GetProfileResponseDTO } from './dto/get-profile.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/me')
  async getProfile(@User() user: JwtPayload): Promise<GetProfileResponseDTO> {
    return await this.userService.getProfile({ uid: user.sub });
  }
}
