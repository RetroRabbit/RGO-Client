/**
 * Simple recursive object extend
 * @param target Target object where the source will be merged into
 * @param sources This object (objects) will be merged into target and then target is returned
 * @return An object that has the same reference as target but is extended and merged with the properties of source
 */
export declare function extend<T>(target: T): T;
export declare function extend<T, A>(target: T, a: A): T & A;
export declare function extend<T, A, B>(target: T, a: A, b: B): T & A & B;
//# sourceMappingURL=extend.d.ts.map