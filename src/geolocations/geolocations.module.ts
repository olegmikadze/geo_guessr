import { Module } from '@nestjs/common';
import { GeolocationsController } from './geolocations.controller';
import { GeolocationsService } from './geolocations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GeoLocation, GeoLocationSchema } from './schemas/geolocation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GeoLocation.name, schema: GeoLocationSchema },
    ]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [GeolocationsController],
  providers: [GeolocationsService],
})
export class GeolocationsModule {}
