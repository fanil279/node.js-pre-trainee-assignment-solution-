import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { UserEntity } from './User';

export enum Status {
    ACTIVE = 'active',
    COMPLETED = 'completed',
}

@Entity('todos')
export class TodoEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 50 })
    title!: string;

    @Column({ type: 'varchar', length: 200 })
    description!: string;

    @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
    status!: Status;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => UserEntity, (user) => user.todos, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user!: UserEntity;
}
