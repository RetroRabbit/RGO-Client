import type { SegmentData } from '../core';
import { SvgPath } from '../svg';
export interface NoneInterpolationOptions {
    fillHoles?: boolean;
}
/**
 * This interpolation function does not smooth the path and the result is only containing lines and no curves.
 *
 * @example
 * ```ts
 * const chart = new LineChart('.ct-chart', {
 *   labels: [1, 2, 3, 4, 5],
 *   series: [[1, 2, 8, 1, 7]]
 * }, {
 *   lineSmooth: Interpolation.none({
 *     fillHoles: false
 *   })
 * });
 * ```
 */
export declare function none(options?: NoneInterpolationOptions): (pathCoordinates: number[], valueData: SegmentData[]) => SvgPath;
//# sourceMappingURL=none.d.ts.map