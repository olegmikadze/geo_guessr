import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/jwtPayload.type';
import { User } from 'src/common/decorators/user.decorator';
import { AddGeolocationControllerDTO } from './dto/addGeolocation.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GeolocationsService } from './geolocations.service';
import { FindGeolocationByIpBody } from './dto/findGeolocationsByUrl.dto';
import { DeleteGeolocationByIpParam } from './dto/deleteGeolocationByIp.dto';
import { DeleteGeolocationsByUrlBody } from './dto/deleteGeolocationsByUrl.dto';
import { FindGeoByIpBodyDTO } from './dto/findGeolocationsByIp.dto';

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

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findGeolocationsByUid(@User() user: JwtPayload) {
    return await this.geolocationService.findGeolocationsByUid({
      userId: user.sub,
    });
  }

  @Get('/ip/:ip')
  @HttpCode(HttpStatus.OK)
  async findGeolocationByIp(
    @User() user: JwtPayload,
    @Param() { ip }: FindGeoByIpBodyDTO,
  ) {
    return await this.geolocationService.findGeolocationByIp({
      userId: user.sub,
      ip,
    });
  }

  @Get('/url')
  @HttpCode(HttpStatus.OK)
  async findGeolocationsByUrl(
    @User() user: JwtPayload,
    @Body() { url }: FindGeolocationByIpBody,
  ) {
    return await this.geolocationService.findGeolocationsByUrl({
      userId: user.sub,
      url,
    });
  }

  @Delete('/ip/:ip')
  async deleteLocationByIP(
    @User() user: JwtPayload,
    @Param() { ip }: DeleteGeolocationByIpParam,
  ) {
    return await this.geolocationService.deleteGeolocationByIp({
      userId: user.sub,
      ip,
    });
  }

  @Delete('/url')
  async deleteGeolocationsByUrl(
    @User() user: JwtPayload,
    @Body() { url }: DeleteGeolocationsByUrlBody,
  ) {
    return await this.geolocationService.deleteGeolocationsByUrl({
      userId: user.sub,
      url,
    });
  }
}
