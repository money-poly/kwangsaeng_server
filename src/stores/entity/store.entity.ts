import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../global/common/base.entity';

@Entity({ name: 'stores' })
export class Store extends BaseEntity {
    @Column({ comment: '가게 이름' })
    name: string;

    @Column({ type: 'json', comment: '음식 카테고리' })
    category: string;

    @Column()
    address: string;

    @Column({ comment: '가게 위도' })
    latitude: number;

    @Column({ comment: '가게 경도' })
    longitude: number;

    @Column({ comment: '가게 소개 사진' })
    storePictureUrl: string;

    @Column({ nullable: true, comment: '가게 전화번호' })
    phone: string;

    @Column({ nullable: true, comment: '가게 소개글' })
    content: string;

    @Column({ nullable: true, comment: '운영시간' })
    operationHours: string;

    @Column({ nullable: true, comment: '고정 휴무일' })
    closedDays: string;

    @Column()
    status: string;
}
