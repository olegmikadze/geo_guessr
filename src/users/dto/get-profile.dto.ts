import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Types } from 'mongoose';

export class GetProfileServiceDTO {
  @ApiProperty()
  uid: number;
}

export class GetProfileResponseDTO {
  @ApiProperty()
  @Exclude()
  _id: Types.ObjectId;

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
