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
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { User } from 'src/common/decorators/user.decorator';
import { AddGeoBodyDTO, AddGeoResponseDTO } from './dto/add-geolocation.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GeolocationsService } from './geolocations.service';
import { DeleteGeoByIpParamDTO } from './dto/delete-geolocation-by-ip.dto';
import { DeleteGeoByUrlBodyDTO } from './dto/delete-geolocations-by-url.dto';
import { FindGeoByUrlBodyDTO } from './dto/find-geolocations-by-url.dto';
import { FindGeoByIpBodyDTO } from './dto/find-geolocations-by-ip.dto';

@ApiBearerAuth()
@Controller('geolocations')
export class GeolocationsController {
  constructor(private geolocationService: GeolocationsService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async addGeolocation(
    @User() user: JwtPayload,
    @Body() { address }: AddGeoBodyDTO,
  ): Promise<AddGeoResponseDTO> {
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
    @Body() { url }: FindGeoByUrlBodyDTO,
  ) {
    return await this.geolocationService.findGeolocationsByUrl({
      userId: user.sub,
      url,
    });
  }

  @Delete('/ip/:ip')
  async deleteLocationByIp(
    @User() user: JwtPayload,
    @Param() { ip }: DeleteGeoByIpParamDTO,
  ) {
    return await this.geolocationService.deleteGeolocationByIp({
      userId: user.sub,
      ip,
    });
  }

  @Delete('/url')
  async deleteGeolocationsByUrl(
    @User() user: JwtPayload,
    @Body() { url }: DeleteGeoByUrlBodyDTO,
  ) {
    return await this.geolocationService.deleteGeolocationsByUrl({
      userId: user.sub,
      url,
    });
  }
}
