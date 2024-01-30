import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SearchReqDto {
    @Expose()
    @IsNotEmpty()
    @IsString()
    @MinLength(2, { message: '검색어 최소 2글자 이상 입력해주세요' })
    q: string;

    @Expose()
    @IsNotEmpty()
    size: number;
}
