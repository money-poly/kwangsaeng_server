import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../global/common/base.entity';

@Entity({ name: 'tokens' })
export class Token extends BaseEntity {
    @Column({ name: 'f_id', comment: 'firebase uid' })
    fId: string;

    @Column({ name: 'refresh_token', comment: 'refresh token' })
    refreshToken: string;
}
