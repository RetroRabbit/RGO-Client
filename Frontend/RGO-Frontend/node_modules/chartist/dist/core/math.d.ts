import type { Bounds } from './types';
export declare const EPSILON = 2.221e-16;
/**
 * Calculate the order of magnitude for the chart scale
 * @param value The value Range of the chart
 * @return The order of magnitude
 */
export declare function orderOfMagnitude(value: number): number;
/**
 * Project a data length into screen coordinates (pixels)
 * @param axisLength The svg element for the chart
 * @param length Single data value from a series array
 * @param bounds All the values to set the bounds of the chart
 * @return The projected data length in pixels
 */
export declare function projectLength(axisLength: number, length: number, bounds: Bounds): number;
/**
 * This helper function can be used to round values with certain precision level after decimal. This is used to prevent rounding errors near float point precision limit.
 * @param value The value that should be rounded with precision
 * @param [digits] The number of digits after decimal used to do the rounding
 * @returns Rounded value
 */
export declare function roundWithPrecision(value: number, digits?: number): number;
/**
 * Pollard Rho Algorithm to find smallest factor of an integer value. There are more efficient algorithms for factorization, but this one is quite efficient and not so complex.
 * @param num An integer number where the smallest factor should be searched for
 * @returns The smallest integer factor of the parameter num.
 */
export declare function rho(num: number): number;
/**
 * Calculate cartesian coordinates of polar coordinates
 * @param centerX X-axis coordinates of center point of circle segment
 * @param centerY X-axis coordinates of center point of circle segment
 * @param radius Radius of circle segment
 * @param angleInDegrees Angle of circle segment in degrees
 * @return Coordinates of point on circumference
 */
export declare function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number): {
    x: number;
    y: number;
};
//# sourceMappingURL=math.d.ts.map