import type { SegmentData } from '../core/types';
import { SvgPath } from '../svg';
export interface SimpleInteractionOptions {
    divisor?: number;
    fillHoles?: boolean;
}
/**
 * Simple smoothing creates horizontal handles that are positioned with a fraction of the length between two data points. You can use the divisor option to specify the amount of smoothing.
 *
 * Simple smoothing can be used instead of `Chartist.Smoothing.cardinal` if you'd like to get rid of the artifacts it produces sometimes. Simple smoothing produces less flowing lines but is accurate by hitting the points and it also doesn't swing below or above the given data point.
 *
 * All smoothing functions within Chartist are factory functions that accept an options parameter. The simple interpolation function accepts one configuration parameter `divisor`, between 1 and ∞, which controls the smoothing characteristics.
 *
 * @example
 * ```ts
 * const chart = new LineChart('.ct-chart', {
 *   labels: [1, 2, 3, 4, 5],
 *   series: [[1, 2, 8, 1, 7]]
 * }, {
 *   lineSmooth: Interpolation.simple({
 *     divisor: 2,
 *     fillHoles: false
 *   })
 * });
 * ```
 *
 * @param options The options of the simple interpolation factory function.
 */
export declare function simple(options?: SimpleInteractionOptions): (pathCoordinates: number[], valueData: SegmentData[]) => SvgPath;
//# sourceMappingURL=simple.d.ts.map