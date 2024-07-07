import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogOutServiceDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
