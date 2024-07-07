import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';
import axios from 'axios';
import { Model } from 'mongoose';
import { findIpByUrl } from 'utils/dnsLookup';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { findAddressPattern } from 'utils/addressType';
import { GeoLocation } from './schemas/geolocation.schema';
import { AddGeolocationServiceDTO } from './dto/addGeolocation.dto';
import { FindGeolocationsByUid } from './dto/findGeolocationsByUid.dto';
import { FindGeolocationByIpDTO } from './dto/findGeolocationsByIp.dto';
import { FindGeolocationByUrlDTO } from './dto/findGeolocationsByUrl.dto';
import { DeleteGeolocationByIpDTO } from './dto/deleteGeolocationByIp.dto';
import { DeleteGeolocatiosnByUrlDTO } from './dto/deleteGeolocationsByUrl.dto';
@Injectable()
export class GeolocationsService implements OnApplicationShutdown {
  private readonly logger = new Logger(GeolocationsService.name);

  constructor(
    @InjectModel(GeoLocation.name) private geolocationModel: Model<GeoLocation>,
    private config: ConfigService,
  ) {}

  onApplicationShutdown(signal?: string) {
    this.logger.log(signal);
  }

  async addGeolocation({ user, address }: AddGeolocationServiceDTO) {
    let hostname = null;
    let ipAddresses = [];

    const addressPattern = findAddressPattern({ address });

    if (!addressPattern)
      throw new HttpException('Address not found!', HttpStatus.BAD_REQUEST);

    if (addressPattern === 'url') {
      if (!/^https?:\/\//i.test(address)) address = `http://${address}`;
      hostname = new URL(address).hostname;
      ipAddresses = await findIpByUrl(hostname);
    } else ipAddresses.push(address);

    const responseData = [];

    for await (const ipAddress of ipAddresses) {
      const geolocationExists = await this.geolocationModel
        .findOne({
          ip: ipAddress,
          uid: user.sub,
        })
        .catch((error) => {
          console.error(error);
          throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
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

      const { data } = await axios
        .get<GeoLocation>(
          `http://api.ipstack.com/${ipAddress}?access_key=${this.config.get<string>('IPSTACK_SECRET')}`,
        )
        .catch((error) => {
          console.error(error);
          throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
        });

      const geolocationBody = {
        uid: user.sub,
        url: hostname,
        ip: ipAddress,
        type: data.type,
        continent_name: data.continent_name,
        country_name: data.country_name,
        city: data.city,
        zip: data.zip,
      };

      await this.geolocationModel.create(geolocationBody).catch((error) => {
        this.logger.error(error);
        throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
      });

      responseData.push(geolocationBody);
    }

    return { status: HttpStatus.CREATED, data: responseData };
  }

  async findGeolocationsByUid({ userId }: FindGeolocationsByUid) {
    try {
      return await this.geolocationModel.find({ uid: userId });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async findGeolocationByIp({ userId, ip }: FindGeolocationByIpDTO) {
    try {
      return await this.geolocationModel.find({ uid: userId, ip });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async findGeolocationsByUrl({ userId, url }: FindGeolocationByUrlDTO) {
    try {
      return await this.geolocationModel.find({ uid: userId, url });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async deleteGeolocationByIp({ userId, ip }: DeleteGeolocationByIpDTO) {
    try {
      return await this.geolocationModel.deleteOne({ uid: userId, ip });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async deleteGeolocationsByUrl({ userId, url }: DeleteGeolocatiosnByUrlDTO) {
    try {
      return await this.geolocationModel.deleteMany({ uid: userId, url });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }
}
