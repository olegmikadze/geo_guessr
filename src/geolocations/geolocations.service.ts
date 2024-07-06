import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddGeolocationServiceDTO } from './dto/addGeolocation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { findAddressPattern } from 'utils/addressType';
import { findIpByUrl } from 'utils/dnsLookup';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { GeoLocation } from './schemas/geolocation.schema';
import { FindGeolocationsByUid } from './dto/findGeolocationsByUid.dto';
import { FindGeolocationByIpDTO } from './dto/findGeolocationsByIP.dto';
import { FindGeolocationByUrlDTO } from './dto/findGeolocationsByUrl.dto';
import { DeleteGeolocationByIpDTO } from './dto/deleteGeolocationByIp.dto';
import { DeleteGeolocatiosnByUrlDTO } from './dto/deleteGeolocationsByUrl.dto';

@Injectable()
export class GeolocationsService {
  constructor(
    @InjectModel(GeoLocation.name) private geolocationModel: Model<GeoLocation>,
    private readonly httpService: HttpService,
    private config: ConfigService,
  ) {}

  async findGeolocationsByUid({ userId }: FindGeolocationsByUid) {
    try {
      return await this.geolocationModel.find({ uid: userId });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async findGeolocationByIp({ userId, ip }: FindGeolocationByIpDTO) {
    try {
      return await this.geolocationModel.find({ uid: userId, ip });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async findGeolocationsByUrl({ userId, url }: FindGeolocationByUrlDTO) {
    try {
      return await this.geolocationModel.find({ uid: userId, url });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async addGeolocation({ user, address }: AddGeolocationServiceDTO) {
    let hostname = null;
    let ipAddresses = [];

    const addressPattern = findAddressPattern({ address });

    if (addressPattern === 'url') {
      if (!/^https?:\/\//i.test(address)) address = `http://${address}`;
      hostname = new URL(address).hostname;
      ipAddresses = await findIpByUrl(hostname);
    } else ipAddresses.push(address);

    for await (const ipAddress of ipAddresses) {
      const geolocationExists = await this.geolocationModel.findOne({
        ip: ipAddress,
        uid: user.sub,
      });

      if (geolocationExists) {
        if (hostname && !geolocationExists.url)
          // in case user didn't provide hostname but only ip address and such location exists - update hostname for him
          await this.geolocationModel.updateOne(
            { _id: geolocationExists._id },
            { url: hostname },
          );

        //idempotent request
        // if already exists so we skip this iteration,
        // because if we have 2+ locations, response will be an exception for whole request
        continue;
      }

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

  async deleteGeolocationByIp({ userId, ip }: DeleteGeolocationByIpDTO) {
    try {
      return await this.geolocationModel.deleteOne({ uid: userId, ip });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async deleteGeolocationsByUrl({ userId, url }: DeleteGeolocatiosnByUrlDTO) {
    try {
      return await this.geolocationModel.deleteMany({ uid: userId, url });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);
    }
  }
}
