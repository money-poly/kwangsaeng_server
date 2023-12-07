import { SoftDeleteEntity } from 'src/global/common/abstract.entity';
import { Store } from 'src/stores/entity/store.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { MenuStatus } from '../enum/menu-status.enum';

@Entity({ name: 'menus' })
export class Menu extends SoftDeleteEntity<Menu> {
    @Column({ comment: '메뉴 이름' })
    name: string;

    @Column({ comment: 'price 컬럼 기준으로의 할인율' })
    discountRate: number;

    @Column({ comment: '메뉴의 할인 전 가격' })
    price: number;

    @Column({ comment: '판매 예정 개수', default: 0 })
    count: number;

    @Column({ comment: '메뉴 사진 URL', nullable: true })
    menuPictureUrl: string;

    @Column({ comment: '인기 메뉴 여부', nullable: true })
    popularity: boolean;

    @Column({ type: 'enum', enum: MenuStatus, comment: '메뉴 상태' })
    status: MenuStatus;

    @Column({ comment: '메뉴 유통기한', nullable: true })
    expiredDate: Date;

    @Column({ comment: '조회수', default: 0 })
    viewCount: number;

    @Column({ comment: '메뉴에 관한 설명' })
    description: string;

    @ManyToOne(() => Store, (store) => store.menus, { cascade: ['soft-remove'] })
    store: Store;
}
