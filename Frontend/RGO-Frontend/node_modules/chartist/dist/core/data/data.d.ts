import type { Multi, AxisName, FlatSeriesValue, Series, SeriesObject } from '../types';
/**
 * Get meta data of a specific value in a series.
 */
export declare function getMetaData(seriesData: FlatSeriesValue | Series | SeriesObject, index: number): any;
/**
 * Checks if a value is considered a hole in the data series.
 * @returns True if the value is considered a data hole
 */
export declare function isDataHoleValue(value: unknown): value is null | undefined;
/**
 * Checks if value is array of series objects.
 */
export declare function isArrayOfSeries(value: unknown): value is (Series | SeriesObject)[];
/**
 * Checks if provided value object is multi value (contains x or y properties)
 */
export declare function isMultiValue(value: unknown): value is Multi;
/**
 * Gets a value from a dimension `value.x` or `value.y` while returning value directly if it's a valid numeric value. If the value is not numeric and it's falsey this function will return `defaultValue`.
 */
export declare function getMultiValue(value: Multi | number | unknown, dimension?: AxisName): number | undefined;
//# sourceMappingURL=data.d.ts.map