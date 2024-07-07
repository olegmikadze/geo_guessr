import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class GetProfileServiceDTO {
  @ApiProperty()
  uid: number;
}

export class GetProfileResponseDTO {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  @Exclude()
  password: string;

  @ApiProperty()
  @Exclude()
  refreshToken?: string;
}
