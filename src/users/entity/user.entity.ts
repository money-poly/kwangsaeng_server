import { UserStatus } from '../enum/user-status.enum';
import { Column, Entity, OneToOne } from 'typeorm';
import { SoftDeleteEntity } from 'src/global/common/abstract.entity';
import { Store } from 'src/stores/entity/store.entity';
import { Roles } from '../enum/roles.enum';

@Entity({ name: 'users' })
export class User extends SoftDeleteEntity<User> {
    @Column({ comment: 'firebase uid', unique: true })
    fId: string;

    @Column({ comment: '유저 이름' })
    name: string;

    @Column({ length: 15, comment: '전화번호 000-0000-0000' })
    phone: string;

    @Column({ type: 'enum', enum: Roles, default: Roles.USER, comment: '역할' })
    role: Roles;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVATE, comment: '유저 상태' })
    status: string;

    @Column({ comment: '문자 인증 유무', default: false })
    isAuth: boolean;

    @OneToOne(() => Store, (store) => store.user)
    store: Store;
}
