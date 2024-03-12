import { SoftDeleteEntity } from 'src/global/common/abstract.entity';
import { Store } from 'src/stores/entity/store.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { MenuStatus } from '../enum/menu-status.enum';
import { MenuView } from './menu-view.entity';

@Entity({ name: 'menus' })
export class Menu extends SoftDeleteEntity<Menu> {
    @Column({ comment: '메뉴 이름' })
    name: string;

    @Column({ comment: '할인율', nullable: true })
    discountRate: number;

    @Column({ comment: '판매가' })
    salePrice: number;

    @Column({ comment: '정가' })
    price: number;

    @Column({ comment: '판매 예정 개수', default: 1 })
    count: number;

    @Column({ comment: '메뉴 사진 URL', nullable: true })
    menuPictureUrl: string;

    @Column({ comment: '인기 메뉴 여부', nullable: true })
    popularity: boolean;

    @Column({ type: 'enum', enum: MenuStatus, comment: '메뉴 상태' })
    status: MenuStatus;

    @Column({ type: 'json', comment: '원산지 표기', nullable: true })
    countryOfOrigin: { ingredient: string; origin: string }[];

    @Column({ comment: '메뉴 유통기한', nullable: true })
    expiredDate: Date;

    @Column({ comment: '메뉴에 관한 설명', nullable: true })
    description: string;

    @ManyToOne(() => Store, (store) => store.menus, { onDelete: 'CASCADE', cascade: ['soft-remove'] })
    store: Store;

    @OneToOne(() => MenuView, (view) => view.menu, { cascade: ['insert'] })
    view: MenuView;
}
