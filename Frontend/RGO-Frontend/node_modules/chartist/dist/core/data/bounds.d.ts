import type { Bounds } from '../types';
/**
 * Calculate and retrieve all the bounds for the chart and return them in one array
 * @param axisLength The length of the Axis used for
 * @param highLow An object containing a high and low property indicating the value range of the chart.
 * @param scaleMinSpace The minimum projected length a step should result in
 * @param onlyInteger
 * @return All the values to set the bounds of the chart
 */
export declare function getBounds(axisLength: number, highLow: {
    high: number;
    low: number;
}, scaleMinSpace: number, onlyInteger?: boolean): Bounds;
//# sourceMappingURL=bounds.d.ts.map