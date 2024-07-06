import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddGeolocationServiceDTO } from './dto/addGeolocation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { findAddressPattern } from 'utils/addressType';
import { findIpByUrl } from 'utils/dnsLookup';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { GeoLocation } from './schemas/geolocation.schema';

@Injectable()
export class GeolocationsService {
  constructor(
    @InjectModel(GeoLocation.name) private geolocationModel: Model<GeoLocation>,
    private readonly httpService: HttpService,
    private config: ConfigService,
  ) {}
  async addGeolocation({ user, address }: AddGeolocationServiceDTO) {
    let hostname = null;
    let ipAddresses = [];

    const addressPattern = findAddressPattern({ address });

    if (addressPattern === 'url') {
      hostname = new URL(address).hostname;
      ipAddresses = await findIpByUrl(hostname);
    } else ipAddresses.push(address);

    // hostname - 1 ip
    // hostname - many ip
    // no hostname - 1 ip

    for await (const ipAddress of ipAddresses) {
      const geolocationExists = await this.geolocationModel.find({
        ip: ipAddress,
        uid: user.sub,
      });

      if (geolocationExists.length)
        throw new HttpException(
          'Geolocation with such name already exists!',
          HttpStatus.BAD_GATEWAY,
        );

      const { data } = await firstValueFrom(
        this.httpService
          .get<GeoLocation>(
            `http://api.ipstack.com/${ipAddress}?access_key=${this.config.get<string>('IPSTACK_SECRET')}`,
          )
          .pipe(
            catchError(() => {
              throw 'An error happened!';
            }),
          ),
      );

      console.log(
        '🚀 ~ file: geolocations.service.ts:59 ~ GeolocationsService ~ forawait ~ data:',
        data,
      );

      await this.geolocationModel.create({
        uid: user.sub,
        url: hostname,
        ip: ipAddress,
        type: data.type,
        continent_name: data.continent_name,
        country_name: data.country_name,
        city: data.city,
        zip: data.zip,
      });
    }

    return { status: HttpStatus.CREATED, message: 'Created' };
  }
}
