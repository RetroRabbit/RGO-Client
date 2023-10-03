/**
 * This function serializes arbitrary data to a string. In case of data that can't be easily converted to a string, this function will create a wrapper object and serialize the data using JSON.stringify. The outcoming string will always be escaped using Chartist.escapingMap.
 * If called with null or undefined the function will return immediately with null or undefined.
 */
export declare function serialize(data: number | string | object): string;
export declare function serialize(data: number | string | object | null | undefined | unknown): string | null | undefined;
/**
 * This function de-serializes a string previously serialized with Chartist.serialize. The string will always be unescaped using Chartist.escapingMap before it's returned. Based on the input value the return type can be Number, String or Object. JSON.parse is used with try / catch to see if the unescaped string can be parsed into an Object and this Object will be returned on success.
 */
export declare function deserialize<T extends object | number | string = object>(data: string): T;
export declare function deserialize<T extends object | number | string = object>(data: string | null | undefined): T | null | undefined;
//# sourceMappingURL=serialize.d.ts.map