import { AbstractEntity } from 'src/global/common/abstract.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { Order } from './order.entity';
import { Menu } from 'src/menus/entity/menu.entity';

@Entity({ name: 'order_detail' })
export class OrderDetail extends AbstractEntity<OrderDetail> {
    @Column({ comment: '단일 메뉴 가격' })
    price: number;

    @Column({ comment: '구매 수량', default: 1 })
    count: number;

    @ManyToOne(() => Menu, (menu) => menu.orderDetail)
    menu: Menu;

    @ManyToOne(() => Order, (order) => order.orderDetail)
    order: Order;
}
