import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class AbstractEntity<T> {
    constructor(entity: Partial<T>) {
        Object.assign(this, entity);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    modifiedDate: Date;
}

export class SoftDeleteEntity<T> extends AbstractEntity<T> {
    @DeleteDateColumn()
    deletedDate: Date;
}
