import { Keyword } from '../entity/keyword.entity';
import { KeywordType } from '../enum/keyword-type.enum';

export class FindRecommandDto {
    private readonly _id: number;
    private readonly _content: string;
    private readonly _type: KeywordType;

    constructor(recommand: Keyword) {
        this._id = recommand.id;
        this._content = recommand.content;
        Object.seal(this);
    }
}
