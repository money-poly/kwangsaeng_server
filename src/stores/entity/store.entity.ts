import { BusinessDetail } from './business-detail.entity';
import { SoftDeleteEntity } from 'src/global/common/abstract.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { Menu } from 'src/menus/entity/menu.entity';
import { StoreStatus } from '../enum/store-status.enum';
import { User } from 'src/users/entity/user.entity';
import { StoreDetail } from './store-detail.entity';
import { Category } from 'src/categories/entity/category.entity';
import { StoreApprove } from './store-approve.entity';

@Entity({ name: 'stores' })
export class Store extends SoftDeleteEntity<Store> {
    @Column({ comment: '가게 이름', unique: true })
    name: string;

    @Column({ type: 'enum', enum: StoreStatus, default: StoreStatus.CLOSED })
    status: string;

    @OneToOne(() => User, (user) => user.store, { onDelete: 'CASCADE', lazy: true })
    @JoinColumn()
    user: User;

    @OneToOne(() => StoreApprove, (approve) => approve.store, { cascade: ['insert'] })
    approve: StoreApprove;

    @OneToOne(() => StoreDetail, (detail) => detail.store, { cascade: ['insert', 'update'] })
    detail: StoreDetail;

    @OneToOne(() => BusinessDetail, (businessDetail) => businessDetail.store, { cascade: ['insert'] })
    businessDetail: BusinessDetail;

    @OneToMany(() => Menu, (menu) => menu.store)
    menus: Menu[];

    @ManyToMany(() => Category, (category) => category.store, {
        cascade: ['insert'],
    })
    @JoinTable({ name: 'store_categories' })
    categories: Category[];
}
