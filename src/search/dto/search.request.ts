import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SearchReqDto {
    @Expose()
    @IsNotEmpty()
    @IsString()
    @MinLength(1, { message: 'Content is too short' })
    q: string;

    @Expose()
    @IsNotEmpty()
    size: number;
}
