import { WithoutTimestampEntity } from 'src/global/common/abstract.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Menu } from './menu.entity';

@Entity({ name: 'menu_views' })
export class MenuView extends WithoutTimestampEntity<MenuView> {
    @Column()
    viewCount: number;

    @OneToOne(() => Menu)
    @JoinColumn()
    menu: Menu;
}
