import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../global/common/abstract.entity';

@Entity({ name: 'tokens' })
export class Token extends AbstractEntity<Token> {
    @Column({ name: 'f_id', comment: 'firebase uid' })
    fId: string;

    @Column({ name: 'refresh_token', length: 500, comment: 'refresh token', nullable: true })
    refreshToken: string;
}
