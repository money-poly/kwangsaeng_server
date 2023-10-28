import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../global/common/base.entity';

@Entity({ name: 'menus' })
export class Menu extends BaseEntity {
    @Column()
    category: string;

    @Column({ comment: '메뉴 이름' })
    name: string;

    @Column({ name: 'sale_rate', comment: 'price 컬럼 기준으로의 할인율' })
    saleRate: number;

    @Column({ comment: '메뉴의 할인 전 가격' })
    price: number;

    @Column({ comment: '메뉴 사진 URL' })
    menuPictureUrl: string;

    @Column({ comment: '인기 메뉴 여부' })
    popularity: boolean;

    @Column()
    status: string;

    @Column({ comment: '메뉴 유통기한' })
    expiredDate: Date;

    @Column({ comment: '조회수' })
    viewCount: number;

    @Column({ comment: '원산지 표기' })
    countryOfOrigin: string;

    @Column({ comment: '메뉴에 관한 설명' })
    description: string;
}
