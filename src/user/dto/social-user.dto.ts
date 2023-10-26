import { IsString, IsNotEmpty } from 'class-validator';

export class SocialUserDto {
  @IsNotEmpty()
  @IsString()
  fireUid: string;
}
