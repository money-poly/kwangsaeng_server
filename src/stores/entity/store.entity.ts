import { SoftDeleteEntity } from 'src/global/common/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Menu } from 'src/menus/entity/menu.entity';
import { StoreCategory } from '../enum/store-category.enum';
import { StoreStatus } from '../enum/store-status.enum';
import { User } from 'src/users/entity/user.entity';

@Entity({ name: 'stores' })
export class Store extends SoftDeleteEntity<Store> {
    @Column({ comment: '가게 이름', unique: true })
    name: string;

    @Column({ type: 'enum', enum: StoreCategory, comment: '음식 카테고리' })
    category: StoreCategory;

    @Column()
    address: string;

    @Column({ type: 'decimal', precision: 6, scale: 4, comment: '가게 위도' })
    latitude: number;

    @Column({ type: 'decimal', precision: 7, scale: 4, comment: '가게 경도' })
    longitude: number;

    @Column({ nullable: true, comment: '가게 소개 사진' })
    storePictureUrl: string;

    @Column({ nullable: true, comment: '가게 전화번호' })
    phone: string;

    @Column({ nullable: true, comment: '가게 소개글' })
    content: string;

    @Column({ nullable: true, comment: '운영시간' })
    operationHours: string;

    @Column({ nullable: true, comment: '고정 휴무일' })
    closedDays: string;

    @Column({ type: 'enum', enum: StoreStatus, default: StoreStatus.OPEN })
    status: string;

    @ManyToOne(() => User, (user) => user.stores, { onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => Menu, (menu) => menu.store, { cascade: true })
    menus: Menu[];
}
