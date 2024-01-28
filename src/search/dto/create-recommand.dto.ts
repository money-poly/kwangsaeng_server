import { Keyword } from '../entity/keyword.entity';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { KeywordType } from '../enum/keyword-type.enum';

export class CreateRecommandDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(1, { message: 'Content is too short' })
    content: string;

    type: string;

    public toEntity(): Keyword {
        if (KeywordType.hasRecommandType(this.type)) return Keyword.create(this.content, this.type);
    }
}
