import { AbstractEntity } from 'src/global/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'banners' })
export class Banner extends AbstractEntity<Banner> {
    @Column({})
    name: string;

    @Column({})
    url: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    orders: number;

    @Column({ default: 0 })
    isVisible: boolean;
}
