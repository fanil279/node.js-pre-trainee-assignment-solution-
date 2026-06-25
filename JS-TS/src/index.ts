import {
    mapArray,
    filterArray,
    reduceArray,
    partition,
    groupBy,
} from './solutions/array-helpers.ts';

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
