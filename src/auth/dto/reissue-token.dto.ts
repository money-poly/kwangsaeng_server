import { IsNotEmpty, IsString } from 'class-validator';

export class ReissueTokensDto {
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
