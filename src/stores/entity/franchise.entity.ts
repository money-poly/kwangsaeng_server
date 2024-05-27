import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Store } from './store.entity';
import { WithoutTimestampEntity } from 'src/global/common/abstract.entity';

@Entity({ name: 'franchise' })
export class Franchise extends WithoutTimestampEntity<Franchise> {
    @Column({ comment: '이름' })
    name: string;

    @Column({ comment: '심볼(동그란 형식의 로고)' })
    symbol: string;

    @Column({ comment: '글자로고' })
    wordMark: string;

    @OneToMany(() => Store, (store) => store.franchise, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn()
    store: Store[];
}
