import { IsNotEmpty, IsString, IsDate } from 'class-validator';
export class TokensModel {
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @IsString()
    @IsNotEmpty()
    refreshToken: string;

    @IsDate()
    @IsNotEmpty()
    accessTokenExp: Date;

    @IsDate()
    @IsNotEmpty()
    refreshTokenExp: Date;
}
