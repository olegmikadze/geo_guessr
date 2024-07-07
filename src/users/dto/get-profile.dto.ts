import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class GetProfileServiceDTO {
  @ApiProperty()
  @IsNumber()
  uid: number;
}

export class GetProfileResponseDTO {
  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  @Exclude()
  password: string;

  @ApiProperty()
  @IsString()
  @Exclude()
  refreshToken?: string;
}
