const validateSource = <T>(source: readonly T[]): void => {
    if (source === null || source === undefined) {
        throw new TypeError('Source array cannot be null or undefined');
    }
};

export const mapArray = <T, R>(
    source: readonly T[],
    mapper: (item: T, index: number) => R,
): R[] => {
    validateSource(source);

    const result: R[] = [];

    for (let i = 0; i < source.length; i++) {
        result.push(mapper(source[i]!, i));
    }

    return result;
};

export const filterArray = <T>(
    source: readonly T[],
    predicate: (item: T, index: number) => boolean,
): T[] => {
    validateSource(source);

    const result: T[] = [];

    for (let i = 0; i < source.length; i++) {
        if (predicate(source[i]!, i)) {
            result.push(source[i]!);
        }
    }

    return result;
};

export const reduceArray = <T, R>(
    source: readonly T[],
    reducer: (acc: R, item: T, index: number) => R,
    initial: R,
): R => {
    validateSource(source);

    let accumulator: R = initial;

    for (let i = 0; i < source.length; i++) {
        accumulator = reducer(accumulator, source[i]!, i);
    }

    return accumulator;
};

export const partition = <T>(source: readonly T[], predicate: (item: T) => boolean): [T[], T[]] => {
    validateSource(source);

    const truthy: T[] = [];
    const falsy: T[] = [];

    for (const item of source) {
        if (predicate(item)) {
            truthy.push(item);
        } else {
            falsy.push(item);
        }
    }

    return [truthy, falsy];
};

export const groupBy = <T, K extends PropertyKey>(
    source: readonly T[],
    keySelector: (item: T) => K,
): Record<K, T[]> => {
    validateSource(source);

    const result = {} as Record<K, T[]>;

    for (const item of source) {
        const key = keySelector(item);

        if (!result[key]) {
            result[key] = [];
        }

        result[key].push(item);
    }

    return result;
};
