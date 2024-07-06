import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { JwtPayload } from 'src/auth/types/jwtPayload.type';

export class AddGeolocationControllerDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;
}

export class AddGeolocationServiceDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  user: JwtPayload;
}
