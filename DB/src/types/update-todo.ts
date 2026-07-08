import { Status } from '../entities/Todo';

export interface UpdateTodo {
    title?: string;
    description?: string;
    status?: Status;
}
