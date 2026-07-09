import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { TodoEntity } from './Todo';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 50 })
    name!: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    email!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @OneToMany(() => TodoEntity, (todo) => todo.user, { cascade: ['insert'] })
    todos!: TodoEntity[];
}
