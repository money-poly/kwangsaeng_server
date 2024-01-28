import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class KeywordType extends EnumType<KeywordType>() {
    static readonly RECOMMAND = new KeywordType('RECOMMAND', '추천 검색어');
    static readonly RELATED = new KeywordType('RELATED', '연관 검색어');
    static readonly REALTIME = new KeywordType('REALTIME', '실시간 검색어');

    private constructor(
        readonly code: string,
        readonly text: string,
    ) {
        super();
    }

    static hasRecommandType(type: string) {
        return type === this.RECOMMAND.code;
    }
}
