import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SendVerifiactionCodeDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^010[0-9]{4}[0-9]{4}$/, {
        message: '$property 필드는 01012341234 형식의 문자열이어야 합니다.',
    })
    to: string;
}
