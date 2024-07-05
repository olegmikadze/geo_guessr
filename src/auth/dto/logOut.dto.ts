import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogOutDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
