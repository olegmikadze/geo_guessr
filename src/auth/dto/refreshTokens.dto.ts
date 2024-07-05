import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RefreshTokensDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
