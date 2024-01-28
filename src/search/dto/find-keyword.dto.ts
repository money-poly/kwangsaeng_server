import { Keyword } from '../entity/keyword.entity';
import { KeywordType } from '../enum/keyword-type.enum';

export class FindKeywordDto {
    private readonly id: number;
    private readonly content: string;
    private readonly type: KeywordType;

    constructor(keyword: Keyword) {
        this.id = keyword.id;
        this.content = keyword.content;
        Object.seal(this);
    }
}
