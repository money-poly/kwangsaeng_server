import { UserStatus } from '../enum/user-status.enum';
import { Column, Entity, OneToMany } from 'typeorm';
import { SoftDeleteEntity } from 'src/global/common/abstract.entity';
import { Store } from 'src/stores/entity/store.entity';
import { Roles } from '../enum/roles.enum';

@Entity({ name: 'users' })
export class User extends SoftDeleteEntity<User> {
    @Column({ comment: 'firebase uid' })
    fId: string;

    @Column({ type: 'enum', enum: Roles, default: Roles.USER, comment: '역할' })
    role: Roles;

    @Column({ type: 'decimal', precision: 13, scale: 10, comment: '위도', default: null })
    latitude: number;

    @Column({ type: 'decimal', precision: 13, scale: 10, comment: '경도', default: null })
    longitude: number;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVATE, comment: '유저 상태' })
    status: string;

    @Column({ comment: 'Pass 인증 유무', default: false })
    passAuth: boolean;

    @OneToMany(() => Store, (store) => store.user, { cascade: true })
    stores: Store[];
}
