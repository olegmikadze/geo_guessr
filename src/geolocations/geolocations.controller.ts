import { Controller, Delete, HttpStatus, Post } from '@nestjs/common';

@Controller('geolocations')
export class GeolocationsController {
  @Post('/')
  async addGelolocation() {
    return { code: HttpStatus.CREATED, status: 'Created' };
  }

  @Delete('/:locationId')
  async removeGelolocation() {
    return { code: HttpStatus.OK, status: 'OK' };
  }
}
