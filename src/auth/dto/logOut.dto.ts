import { IsNotEmpty, IsNumber } from 'class-validator';

export class LogOutDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
