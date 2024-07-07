import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class DeleteGeoByUrlBodyDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class DeleteGeoByUrlDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class DeleteGeoByUrlResponseDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  status: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  data: string;
}
