import { UserStatus } from '../enum/user-status.enum';
import { Column, Entity, OneToMany } from 'typeorm';
import { SoftDeleteEntity } from 'src/global/common/abstract.entity';
import { Store } from 'src/stores/entity/store.entity';
import { Roles } from '../enum/roles.enum';

@Entity({ name: 'users' })
export class User extends SoftDeleteEntity<User> {
    @Column({ name: 'f_id', comment: 'firebase uid', unique: true })
    fId: string;

    @Column({ comment: '유저 이름' })
    name: string;

    @Column({ length: 15, comment: '전화번호 000-0000-0000' })
    phone: string;

    @Column({ type: 'enum', enum: Roles, default: Roles.USER, comment: '역할' })
    role: Roles;

    @Column({ type: 'decimal', precision: 13, scale: 10, comment: '위도', default: null })
    latitude: number;

    @Column({ type: 'decimal', precision: 13, scale: 10, comment: '경도', default: null })
    longitude: number;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVATE, comment: '유저 상태' })
    status: string;

    @Column({ name: 'pass_auth', comment: 'Pass 인증 유무', default: false })
    passAuth: boolean;

    @OneToMany(() => Store, (store) => store.user, { cascade: true })
    stores: Store[];
}
