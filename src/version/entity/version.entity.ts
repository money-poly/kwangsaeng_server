import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MobileOS } from '../mobile-os.enum';

@Entity({ name: 'version' })
export class Version {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: MobileOS, unique: true })
    platform: MobileOS;

    @Column()
    version: string;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    modifiedDate: Date;
}
