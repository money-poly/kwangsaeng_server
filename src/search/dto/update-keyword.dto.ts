import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateKeywordDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(1, { message: 'Content is too short' })
    content: string;

    @IsString()
    @IsNotEmpty()
    type: string;
}
