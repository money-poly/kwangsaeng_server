import { AbstractEntity } from 'src/global/common/abstract.entity';
import { Store } from 'src/stores/entity/store.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'tags' })
export class Tag extends AbstractEntity<Tag> {
    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    icon: string;

    @Column()
    content: string;

    @Column()
    textColor: string;

    @Column()
    backgroundColor: string;

    @OneToMany(() => Store, (store) => store.tag)
    stores: Store[];
}
