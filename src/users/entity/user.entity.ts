import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../global/common/base.entity';
import { Role } from 'src/users/enum/role.enum';
import { UserStatus } from '../enum/user-status.enum';

@Entity({ name: 'users' })
export class User extends BaseEntity {
    @Column({ name: 'f_id', comment: 'firebase uid', unique: true })
    fId: string;

    @Column({ type: 'enum', enum: Role, default: Role.USER, comment: '역할' })
    role!: Role;

    @Column({ comment: '위도', nullable: true })
    latitude: number;

    @Column({ comment: '경도', nullable: true })
    longitude: number;

    @Column({ default: UserStatus.ACTIVATE })
    status: string;

    @Column({ name: 'pass_auth', default: false, comment: 'Pass 인증 유무' })
    passAuth: boolean;
}
