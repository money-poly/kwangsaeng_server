import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class AbstractEntity<T> {
    constructor(entity: Partial<T>) {
        Object.assign(this, entity);
    }

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @CreateDateColumn({ name: 'created_date' })
    createdDate: Date;

    @UpdateDateColumn({ name: 'modified_date' })
    modifiedDate: Date;
}

export class SoftDeleteEntity<T> extends AbstractEntity<T> {
    @DeleteDateColumn({ name: 'deleted_date' })
    deletedDate: Date;
}
