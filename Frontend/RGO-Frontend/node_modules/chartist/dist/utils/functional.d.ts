/**
 * Helps to simplify functional style code
 * @param n This exact value will be returned by the noop function
 * @return The same value that was provided to the n parameter
 */
export declare const noop: <T>(n: T) => T;
/**
 * Functional style helper to produce array with given length initialized with undefined values
 */
export declare function times(length: number): undefined[];
export declare function times<T = unknown>(length: number, filler: (index: number) => T): T[];
/**
 * Sum helper to be used in reduce functions
 */
export declare const sum: (previous: number, current: number) => number;
/**
 * Map for multi dimensional arrays where their nested arrays will be mapped in serial. The output array will have the length of the largest nested array. The callback function is called with variable arguments where each argument is the nested array value (or undefined if there are no more values).
 *
 * For example:
 * @example
 * ```ts
 * const data = [[1, 2], [3], []];
 * serialMap(data, cb);
 *
 * // where cb will be called 2 times
 * // 1. call arguments: (1, 3, undefined)
 * // 2. call arguments: (2, undefined, undefined)
 * ```
 */
export declare const serialMap: <T, K>(array: T[][], callback: (...args: T[]) => K) => K[];
//# sourceMappingURL=functional.d.ts.map