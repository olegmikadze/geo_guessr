import { Module } from '@nestjs/common';
import { GeolocationsController } from './geolocations.controller';
import { GeolocationsService } from './geolocations.service';

@Module({
  controllers: [GeolocationsController],
  providers: [GeolocationsService],
})
export class GeolocationsModule {}
