import { IsNotEmpty, IsString } from 'class-validator';
export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    fId: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    phone: string;
}
export class SignInDto {
    @IsString()
    @IsNotEmpty()
    fId: string;
}
export class ReissueTokensDto {
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
