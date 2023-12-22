import { AbstractEntity } from 'src/global/common/abstract.entity';
import { Store } from 'src/stores/entity/store.entity';
import { Column, Entity, ManyToMany, Tree, TreeChildren, TreeParent } from 'typeorm';

@Entity({ name: 'categories' })
@Tree('materialized-path')
export class Category extends AbstractEntity<Category> {
    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @TreeParent()
    super: Category;

    @TreeChildren()
    subs: Category[];

    @ManyToMany(() => Store, (store) => store.categories)
    store: Store[];
}
