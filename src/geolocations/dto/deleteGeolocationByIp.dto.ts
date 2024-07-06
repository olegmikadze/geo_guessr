import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DeleteGeolocationByIpParam {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ip: string;
}

export class DeleteGeolocationByIpDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ip: string;
}
