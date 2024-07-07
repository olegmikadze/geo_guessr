import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { Geolocation } from '../schemas/geolocation.schema';

export class AddGeoBodyDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;
}

export class AddGeoServiceDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  user: JwtPayload;
}

export class AddGeoResponseDTO {
  @ApiProperty()
  status: number;

  @ApiProperty()
  data: Geolocation[];
}
