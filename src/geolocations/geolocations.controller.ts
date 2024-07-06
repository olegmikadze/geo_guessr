import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/jwtPayload.type';
import { User } from 'src/common/decorators/user.decorator';
import { AddGeolocationControllerDTO } from './dto/addGeolocation.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GeolocationsService } from './geolocations.service';
import { FindGeolocationByIpParam } from './dto/findGeolocationsByIP.dto';
import { FindGeolocationByIpBody } from './dto/findGeolocationsByUrl.dto';

@ApiBearerAuth()
@Controller('geolocations')
export class GeolocationsController {
  constructor(private geolocationService: GeolocationsService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async addGeolocation(
    @User() user: JwtPayload,
    @Body() { address }: AddGeolocationControllerDTO,
  ) {
    return await this.geolocationService.addGeolocation({ user, address });
  }

  //localhost:3000/geolocations
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findGeolocationsByUid(@User() user: JwtPayload) {
    return await this.geolocationService.findGeolocationsByUid({
      userId: user.sub,
    });
  }

  //localhost:3000/geolocations/ip/104.18.32.7
  @Get('/ip/:ip')
  @HttpCode(HttpStatus.OK)
  async findGeolocationByIP(
    @User() user: JwtPayload,
    @Param() { ip }: FindGeolocationByIpParam,
  ) {
    return await this.geolocationService.findGeolocationByIp({
      userId: user.sub,
      ip,
    });
  }

  @Get('/url')
  @HttpCode(HttpStatus.OK)
  async findGeolocationByUrl(
    @User() user: JwtPayload,
    @Body() { url }: FindGeolocationByIpBody,
  ) {
    return await this.geolocationService.findGeolocationsByUrl({
      userId: user.sub,
      url,
    });
  }
}
