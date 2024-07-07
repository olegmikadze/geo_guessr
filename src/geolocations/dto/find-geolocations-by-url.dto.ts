import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Geolocation } from '../schemas/geolocation.schema';

export class FindGeoByUrlBodyDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class FindGeoByUrlDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class FindGeoByUrlResponseDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  status: number;

  @ApiProperty()
  data: Geolocation[];
}
