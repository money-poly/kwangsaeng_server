import { AbstractEntity } from 'src/global/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Tag extends AbstractEntity<Tag> {
    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    icon: string;

    @Column()
    content: string;

    @Column()
    textColor: string;

    @Column()
    backgroundColor: string;
}
