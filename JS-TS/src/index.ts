import {
    mapArray,
    filterArray,
    reduceArray,
    partition,
    groupBy,
} from './solutions/array-helpers.ts';

import { createTodo } from './solutions/todo-factory.ts';
import { addTodo, updateTodo } from './solutions/todo-crud.ts';
import { toggleAll, clearCompleted, countByStatus } from './solutions/todo-bulk.ts';

import { TodoApi } from './solutions/todo-api.ts';
import { TodoNotFoundError } from './solutions/repository.ts';
import { type Todo, TodoStatus } from './solutions/types.ts';

async function main(): Promise<void> {
    // Task 2 - Array helpers
    const numbers = [1, 2, 3, 4, 5];

    const objects = [
        { id: 1, tag: 'home' },
        { id: 2, tag: 'work' },
        { id: 3, tag: 'home' },
    ];

    console.log(
        'mapArray:',
        mapArray(numbers, (n) => n * 2),
    );
    console.log(
        'filterArray:',
        filterArray(numbers, (n) => n > 2),
    );
    console.log(
        'reduceArray:',
        reduceArray(numbers, (acc, n) => acc + n, 0),
    );
    console.log(
        'partition:',
        partition(numbers, (n) => n % 2 === 0),
    );
    console.log(
        'groupBy:',
        groupBy(objects, (obj) => obj.tag),
    );

    // Task 3 - Todo Factory
    const firstTodo = createTodo({
        title: 'Learn TypeScript',
        description: 'In 10 days',
    });

    const secondTodo = createTodo({
        title: 'Refactor code',
    });

    console.log('Factory Todo 1:', firstTodo);
    console.log('Factory Todo 2:', secondTodo);

    // Task 4 - CRUD
    const state: Todo[] = [];

    const todo = createTodo({
        title: 'Write tests',
    });

    const state2 = addTodo(state, todo);

    const state3 = addTodo(
        state2,
        createTodo({
            title: 'Refactor code',
        }),
    );

    const state4 = updateTodo(state3, todo.id, {
        status: TodoStatus.COMPLETED,
    });

    console.log('Initial state:', state);
    console.log('After add:', state2);
    console.log('After second add:', state3);
    console.log('After update:', state4);

    // ==========================
    // Task 5 - Bulk operations
    const completedState = toggleAll(state4, true);

    console.log('Toggle all:', completedState);

    console.log('Completed count:', countByStatus(completedState, TodoStatus.COMPLETED));

    console.log('After clearCompleted:', clearCompleted(completedState));

    // Task 6 & 7 - Todo API + Repository
    const api = new TodoApi();

    const addedTodo = await api.add({
        title: 'Learn TypeScript',
        description: 'Practice every day',
    });

    console.log('Added:', addedTodo);

    console.log('All todos:', await api.getAll());

    const updatedTodo = await api.update(addedTodo.id, {
        status: TodoStatus.COMPLETED,
    });

    console.log('Updated:', updatedTodo);

    await api.remove(addedTodo.id);

    console.log('After remove:', await api.getAll());
}

main().catch((error) => {
    if (error instanceof TodoNotFoundError) {
        console.error(error.message);
    } else {
        console.error('Unexpected error:', error);
    }
});
