import { Module } from '@nestjs/common';
import { GeolocationsController } from './geolocations.controller';
import { GeolocationsService } from './geolocations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GeoLocation, GeoLocationSchema } from './schemas/geolocation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GeoLocation.name, schema: GeoLocationSchema },
    ]),
  ],
  controllers: [GeolocationsController],
  providers: [GeolocationsService],
})
export class GeolocationsModule {}
