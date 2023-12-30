import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumberString, Length } from 'class-validator';
import { SendVerifiactionCodeDto } from './send-verification-code.dto';

export class VerifyCodeDto extends PickType(SendVerifiactionCodeDto, ['to']) {
    @IsNotEmpty()
    @IsNumberString(
        {},
        {
            message: '$property 필드는 숫자로만 이루어진 문자열이어야 합니다.',
        },
    )
    @Length(6, 6)
    code: string;
}
