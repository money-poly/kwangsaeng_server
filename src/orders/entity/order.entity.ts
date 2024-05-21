import { SoftDeleteEntity } from 'src/global/common/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { PayMethod } from '../enum/pay-method.enum';
import { PayStatus } from '../enum/pay-status.enum';
import { OrderDetail } from './order-detail.entity';
import { OrderStatus } from '../enum/order-status.enum';
import { Customer } from 'src/users/entity/customer.entity';
import { Store } from 'src/stores/entity/store.entity';

@Entity({ name: 'orders' })
export class Order extends SoftDeleteEntity<Order> {
    @Column({ comment: '주문번호', unique: true })
    orderId: string;

    @Column({ comment: '가게 이름' })
    storeName: string;

    @Column({ comment: '총 결제금액' })
    totalPrice: number;

    @Column({ comment: '상품명' })
    goodsName: string;

    @Column({ comment: '결제 수단', type: 'enum', enum: PayMethod })
    payMethod: PayMethod;

    @Column({ comment: '결제 완료 시간' })
    paidAt: Date;

    @Column({ comment: '결제 실패 시간' })
    failedAt: Date;

    @Column({ comment: '결제 취소 시간' })
    cancelledAt: Date;

    @Column({ comment: '주문 상태', type: 'enum', enum: OrderStatus, default: OrderStatus.REQUEST })
    status: OrderStatus;

    @Column({ comment: '결제 상태', type: 'enum', enum: PayStatus, default: PayStatus.paid })
    payStatus: PayStatus;

    @Column({ comment: '주문자 성명' })
    buyerName: string;

    @Column({ comment: '주문자 번호' })
    buyerTel: string;

    @Column({ comment: '회원 요청사항', nullable: true })
    requestedTerm: string;

    @ManyToOne(() => Store, (store) => store.order)
    store: Store;

    @ManyToOne(() => Customer, (customer) => customer.order, { nullable: true, onDelete: 'SET NULL' })
    customer: Customer;

    @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
    orderDetail: OrderDetail[];
}
