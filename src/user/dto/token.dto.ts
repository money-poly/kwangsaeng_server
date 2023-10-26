import { IsString, IsNotEmpty } from 'class-validator';
import { Timestamp } from 'typeorm';

export class TokenDto {
  @IsNotEmpty()
  @IsString()
  fireUid: String;

  @IsNotEmpty()
  @IsString()
  access: string;

  @IsNotEmpty()
  @IsString()
  refresh: string;

  @IsNotEmpty()
  accessExpired: Timestamp;

  @IsNotEmpty()
  refreshExpired: Timestamp;
}
