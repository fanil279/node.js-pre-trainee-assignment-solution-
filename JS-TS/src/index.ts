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
import { type Todo, TodoStatus } from './solutions/types.ts';

// Array helpers
const numbers = [1, 2, 3, 4, 5];
const numbers2 = [
    { id: 1, tag: 'home' },
    { id: 2, tag: 'work' },
    { id: 3, tag: 'home' },
];

console.log(mapArray(numbers, (num, _i) => num * 2));
console.log(filterArray(numbers, (num, _i) => num > 2));
console.log(reduceArray(numbers, (acc, num, _i) => acc + num, 0));
console.log(partition(numbers, (num) => num % 2 === 0));
console.log(groupBy(numbers2, (num2) => num2.tag));

// Todo factory
const a = createTodo({ title: 'Learn TypeScript', description: 'In 10 days' });
const b = createTodo({ title: 'Refactor code' });

console.log(a.id);
console.log(b.id);

// Todo crud
const state: Todo[] = [];

const todo = createTodo({ title: 'Write tests' });
const state2 = addTodo(state, todo);
const state3 = addTodo(state2, createTodo({ title: 'Refactor code' }));
const state4 = updateTodo(state3, todo.id, { status: TodoStatus.COMPLETED });

console.log(state);
console.log(state2);
console.log(state3);
console.log(state4);

// Todo bulk
const state5 = toggleAll(state4, true);
const count = countByStatus(state5, TodoStatus.COMPLETED);
const state6 = clearCompleted(state5);

console.log(state5);
console.log(count);
console.log(state6);
