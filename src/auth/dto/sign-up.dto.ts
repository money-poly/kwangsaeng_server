import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    fId: string;

    @IsString()
    @IsNotEmpty()
    phone: string;
}
