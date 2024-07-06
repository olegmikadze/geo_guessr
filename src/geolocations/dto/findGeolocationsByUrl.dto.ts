import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FindGeolocationByIpBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class FindGeolocationByUrlDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;
}
