import { Column, Entity, OneToMany } from 'typeorm';
import { SoftDeleteEntity } from 'src/global/common/abstract.entity';
import { Order } from 'src/orders/entity/order.entity';

@Entity({ name: 'customers' })
export class Customer extends SoftDeleteEntity<Customer> {
    @Column({ comment: 'firebase uid', unique: true })
    fId: string;

    @Column({ nullable: true, comment: '유저 이름' })
    name: string;

    @Column({ length: 15, comment: '전화번호 000-0000-0000' })
    phone: string;

    @Column({ comment: '문자 인증 유무', default: false })
    isAuth: boolean;

    @Column({ comment: '비회원 주문시 저장 비밀번호/회원시 null', nullable: true })
    orderPassword: number;

    @Column({ comment: '비회원 여부(비회원시 true)', default: false })
    isNonmember: boolean;

    @OneToMany(() => Order, (order) => order.customer)
    order: Order;
}
