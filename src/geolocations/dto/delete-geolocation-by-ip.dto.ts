import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DeleteGeoByIpParamDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ip: string;
}

export class DeleteGeoByIpDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ip: string;
}

export class DeleteGeoByIpResponseDTO {
  @ApiProperty()
  @IsNumber()
  status: number;

  @ApiProperty()
  @IsString()
  data: string;
}
