import { AbstractEntity } from 'src/global/common/abstract.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Store } from './store.entity';

@Entity()
export class StoreApprove extends AbstractEntity<StoreApprove> {
    @Column({ default: false })
    isApproved: boolean;

    @OneToOne(() => Store, (store) => store.approve, { onDelete: 'CASCADE' })
    @JoinColumn()
    store: Store;
}
