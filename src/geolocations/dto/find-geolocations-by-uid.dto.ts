import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Geolocation } from '../schemas/geolocation.schema';

export class FindGeolocationsByUid {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

export class FindGeoByUidResponseDTO {
  @ApiProperty()
  @IsNumber()
  status: number;

  @ApiProperty()
  data: Geolocation[];
}
