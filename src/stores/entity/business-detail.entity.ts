import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Store } from './store.entity';
import { WithoutTimestampEntity } from 'src/global/common/abstract.entity';

@Entity({ name: 'business_detail' })
export class BusinessDetail extends WithoutTimestampEntity<BusinessDetail> {
    @Column({ comment: '대표자 성명' })
    name: string;

    @Column({ comment: '도로명 주소' })
    address: string;

    @Column({ comment: '사업자 등록 번호' })
    businessNum: string;

    @OneToOne(() => Store, (store) => store.businessDetail, { onDelete: 'CASCADE' })
    @JoinColumn()
    store: Store;
}
