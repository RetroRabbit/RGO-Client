/**
 * Converts a number to a string with a unit. If a string is passed then this will be returned unmodified.
 * @return Returns the passed number value with unit.
 */
export declare function ensureUnit<T>(value: T, unit: string): string | T;
/**
 * Converts a number or string to a quantity object.
 * @return Returns an object containing the value as number and the unit as string.
 */
export declare function quantity<T>(input: T): {
    value: number;
    unit: string | undefined;
} | {
    value: number;
    unit?: undefined;
};
/**
 * Generates a-z from a number 0 to 26
 * @param n A number from 0 to 26 that will result in a letter a-z
 * @return A character from a-z based on the input number n
 */
export declare function alphaNumerate(n: number): string;
//# sourceMappingURL=lang.d.ts.map