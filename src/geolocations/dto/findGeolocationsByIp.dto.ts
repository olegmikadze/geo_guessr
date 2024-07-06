import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FindGeolocationByIpParam {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ip: string;
}

export class FindGeolocationByIpDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ip: string;
}
