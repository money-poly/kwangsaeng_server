import { Keyword } from '../entity/keyword.entity';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { KeywordType } from '../enum/keyword-type.enum';

export class CreateKeywordDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(1, { message: 'Content is too short' })
    content: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    public static toEntity(dto: CreateKeywordDto): Keyword | undefined {
        if (KeywordType.hasRecommandType(dto.type)) {
            return Keyword.create(dto.content, dto.type);
        }
        return undefined;
    }
}
