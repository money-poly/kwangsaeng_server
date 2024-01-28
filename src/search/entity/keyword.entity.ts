import { BaseEntity } from 'src/global/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'keywords' })
export class Keyword extends BaseEntity {
    @Column({ unique: true, comment: '검색어 내용' })
    content: string;

    @Column({ comment: '검색어 종류' })
    type: string;

    static create(content: string, type: string): Keyword {
        const keyword = new Keyword();
        keyword.content = content;
        keyword.type = type;
        return keyword;
    }
}
