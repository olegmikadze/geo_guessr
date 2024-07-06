import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DeleteGeolocationsByUrlBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class DeleteGeolocatiosnByUrlDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;
}
