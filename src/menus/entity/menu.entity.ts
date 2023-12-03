import { AbstractEntity } from 'src/global/common/abstract.entity';
import { Store } from 'src/stores/entity/store.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { MenuTags } from '../enum/menu-tag.enum';
import { MenuStatus } from '../enum/menu-status.enum';

@Entity({ name: 'menus' })
export class Menu extends AbstractEntity<Menu> {
    @Column({ comment: '메뉴 이름' })
    name: string;

    @Column({ name: 'sale_rate', comment: 'price 컬럼 기준으로의 할인율' })
    saleRate: number;

    @Column({ comment: '메뉴의 할인 전 가격' })
    price: number;

    @Column({ name: 'count', comment: '판매 예정 개수', default: 0 })
    count: number;

    @Column({ type: 'enum', enum: MenuTags, comment: '메뉴 할인 태그', nullable: true })
    tag: MenuTags;

    @Column({ comment: '메뉴 사진 URL', nullable: true })
    menuPictureUrl: string;

    @Column({ comment: '인기 메뉴 여부', nullable: true })
    popularity: boolean;

    @Column({ type: 'enum', enum: MenuStatus, comment: '메뉴 상태' })
    status: MenuStatus;

    @Column({ name: 'expired_date', comment: '메뉴 유통기한', nullable: true })
    expiredDate: Date;

    @Column({ name: 'view_count', comment: '조회수', default: 0 })
    viewCount: number;

    @Column({ comment: '메뉴에 관한 설명' })
    description: string;

    @ManyToOne(() => Store, (store) => store.menus, { cascade: ['soft-remove'] })
    store: Store;
}
