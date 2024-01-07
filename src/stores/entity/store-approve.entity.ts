import { AbstractEntity } from 'src/global/common/abstract.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Store } from './store.entity';
import { StoreApproveStatus } from '../enum/store-approve-status.enum';

@Entity()
export class StoreApprove extends AbstractEntity<StoreApprove> {
    @Column({ type: 'enum', enum: StoreApproveStatus, default: StoreApproveStatus.BEFORE })
    isApproved: StoreApproveStatus;

    @OneToOne(() => Store, (store) => store.approve, { onDelete: 'CASCADE' })
    @JoinColumn()
    store: Store;
}
