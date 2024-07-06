import { Body, Controller, Delete, HttpStatus, Post } from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/jwtPayload.type';
import { User } from 'src/common/decorators/user.decorator';
import { AddGeolocationControllerDTO } from './dto/addGeolocation.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GeolocationsService } from './geolocations.service';

@ApiBearerAuth()
@Controller('geolocations')
export class GeolocationsController {
  constructor(private geolocationService: GeolocationsService) {}
  @Post('/')
  async addGeolocation(
    @User() user: JwtPayload,
    @Body() { address }: AddGeolocationControllerDTO,
  ) {
    return await this.geolocationService.addGeolocation({ user, address });
  }

  @Delete('/:locationId')
  async removeGelolocation() {
    return { code: HttpStatus.OK, status: 'OK' };
  }
}
