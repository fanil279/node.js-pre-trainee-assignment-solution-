import type { Status } from '../entities/Todo';

export interface CreateTodo {
    title: string;
    description: string;
    status: Status;
    userId: number;
}
