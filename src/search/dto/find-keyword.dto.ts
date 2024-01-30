import { KeywordType } from '../enum/keyword-type.enum';

export class FindKeywordDto {
    private readonly id: number;
    private readonly keyword: string[];
    private readonly type: KeywordType;

    constructor(keywords: string[]) {
        this.keyword = keywords;
        Object.seal(this);
    }
}
