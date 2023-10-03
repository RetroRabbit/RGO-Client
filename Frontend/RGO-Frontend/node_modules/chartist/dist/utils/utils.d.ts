import type { FilterByKey } from './types';
/**
 * This function safely checks if an objects has an owned property.
 * @param target The object where to check for a property
 * @param property The property name
 * @returns Returns true if the object owns the specified property
 */
export declare function safeHasProperty<T, K extends string>(target: T, property: K): target is FilterByKey<T, K>;
/**
 * Checks if a value can be safely coerced to a number. This includes all values except null which result in finite numbers when coerced. This excludes NaN, since it's not finite.
 */
export declare function isNumeric(value: number): true;
export declare function isNumeric(value: unknown): boolean;
/**
 * Returns true on all falsey values except the numeric value 0.
 */
export declare function isFalseyButZero(value: unknown): value is undefined | null | false | '';
/**
 * Returns a number if the passed parameter is a valid number or the function will return undefined. On all other values than a valid number, this function will return undefined.
 */
export declare function getNumberOrUndefined(value: number): number;
export declare function getNumberOrUndefined(value: unknown): number | undefined;
/**
 * Checks if value is array of arrays or not.
 */
export declare function isArrayOfArrays(data: unknown): data is unknown[][];
/**
 * Loop over array.
 */
export declare function each<T>(list: T[], callback: (item: T, index: number, itemIndex: number) => void, reverse?: boolean): void;
//# sourceMappingURL=utils.d.ts.map