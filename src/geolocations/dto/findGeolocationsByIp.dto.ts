import { ApiProperty } from '@nestjs/swagger';
import { IsIP, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Geolocation } from '../schemas/geolocation.schema';

export class FindGeoByIpBodyDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIP()
  ip: string;
}

export class FindGeoByIpServiceDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIP()
  ip: string;
}

export class FindGeoByIpResponseDTO {
  @ApiProperty()
  @IsNumber()
  status: number;

  @ApiProperty()
  data: Geolocation[];
}
