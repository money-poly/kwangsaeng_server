import { AbstractEntity } from 'src/global/common/abstract.entity';
import { Tag } from 'src/tags/entity/tag.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { OperationTimes } from '../interfaces/operation-times.interface';
import { Store } from './store.entity';
import axios, { AxiosRequestConfig } from 'axios';
import { StoresException } from 'src/global/exception/stores-exception';

@Entity({ name: 'store_detail' })
export class StoreDetail extends AbstractEntity<StoreDetail> {
    @Column({ comment: '도로명주소' })
    address: string;

    @Column({ comment: '도로명주소를 제외한 상세 주소', nullable: true })
    addressDetail?: string;

    @Column({ type: 'decimal', precision: 16, scale: 13, comment: '가게 위도', default: 0 })
    lat: number;

    @Column({ type: 'decimal', precision: 16, scale: 13, comment: '가게 경도', default: 0 })
    lon: number;

    @Column({ comment: '가게 전화번호' })
    phone: string;

    @Column({ nullable: true, comment: '가게 소개글' })
    description: string;

    @Column({ nullable: true, comment: '가게 소개 사진' })
    storePictureUrl: string;

    @Column({ nullable: true, comment: '가게 평균 조리 시간' })
    cookingTime: number;

    @Column({ type: 'json', nullable: true, comment: '운영시간' })
    operationTimes: OperationTimes;

    @Column({ nullable: true, comment: '고정 휴무일' })
    closedDays: string;

    @Column({
        type: 'simple-array',
        nullable: true,
        comment: '메뉴 순서(menuId)',
    })
    menuOrders: number[];

    @OneToOne(() => Tag, { nullable: true })
    @JoinColumn()
    tag: Tag;

    @OneToOne(() => Store, (store) => store.detail, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn()
    store: Store;

    async toLatLon() {
        const config: AxiosRequestConfig = {
            baseURL: 'https://dapi.kakao.com',
            headers: {
                Authorization: `KakaoAK e1b420b9d4d5e0cb6120885145d3c90a`,
            },
        };

        try {
            const res = await axios.get(
                `/v2/local/search/address.json?query=${this.address}&analyze_type=exact`,
                config,
            );

            if (!res.data.documents.length) {
                throw StoresException.INVALID_ADDRESS;
            }

            const { x, y } = res.data?.documents[0]?.road_address;

            return { x, y };
        } catch (error) {
            throw error;
        }
    }

    @BeforeInsert()
    @BeforeUpdate()
    async transformAddressToLatLon() {
        const { x, y } = await this.toLatLon();

        this.lat = parseFloat(y);
        this.lon = parseFloat(x);
    }
}
