import { AbstractEntity } from 'src/global/common/abstract.entity';
import { Tag } from 'src/tags/entity/tag.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { OperationTimes } from '../interfaces/operation-times.interface';
import { Store } from './store.entity';

@Entity({ name: 'store_detail' })
export class StoreDetail extends AbstractEntity<StoreDetail> {
    @Column({ comment: '도로명 주소' })
    address: string;

    @Column({ type: 'decimal', precision: 6, scale: 4, comment: '가게 위도' })
    lat: number;

    @Column({ type: 'decimal', precision: 7, scale: 4, comment: '가게 경도' })
    lon: number;

    @Column({ nullable: true, comment: '가게 소개글' })
    description: string;

    @Column({ nullable: true, comment: '가게 전화번호' })
    phone: string;

    @Column({ nullable: true, comment: '가게 소개 사진' })
    storePictureUrl: string;

    @Column({ nullable: true, comment: '가게 평균 조리 시간' })
    cookingTime: number;

    @Column({ type: 'json', nullable: true, comment: '운영시간' })
    operationTimes: OperationTimes;

    @Column({ nullable: true, comment: '고정 휴무일' })
    closedDays: string;

    @OneToOne(() => Tag, { nullable: true })
    @JoinColumn()
    tag: Tag;

    @OneToOne(() => Store, (store) => store.detail, { onDelete: 'CASCADE' })
    @JoinColumn()
    store: Store;
}
