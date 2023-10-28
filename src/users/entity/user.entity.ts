import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../global/common/base.entity';
import { Role } from 'src/users/enum/role.enum';

@Entity({ name: 'users' })
export class User extends BaseEntity {
    @Column({ name: 'f_id', comment: 'firebase uid' })
    fId: string;

    @Column({ type: 'enum', enum: Role, default: Role.USER, comment: '역할' })
    role: Role[];

    @Column({ comment: '위도' })
    latitude: number;

    @Column({ comment: '경도' })
    longitude: number;

    @Column()
    status: string;

    @Column({ name: 'pass_auth', comment: 'Pass 인증 유무' })
    passAuth: boolean;
}
