import type { SegmentData } from '../core';
import { SvgPath } from '../svg';
export interface CardinalInterpolationOptions {
    tension?: number;
    fillHoles?: boolean;
}
/**
 * Cardinal / Catmull-Rome spline interpolation is the default smoothing function in Chartist. It produces nice results where the splines will always meet the points. It produces some artifacts though when data values are increased or decreased rapidly. The line may not follow a very accurate path and if the line should be accurate this smoothing function does not produce the best results.
 *
 * Cardinal splines can only be created if there are more than two data points. If this is not the case this smoothing will fallback to `Chartist.Smoothing.none`.
 *
 * All smoothing functions within Chartist are factory functions that accept an options parameter. The cardinal interpolation function accepts one configuration parameter `tension`, between 0 and 1, which controls the smoothing intensity.
 *
 * @example
 * ```ts
 * const chart = new LineChart('.ct-chart', {
 *   labels: [1, 2, 3, 4, 5],
 *   series: [[1, 2, 8, 1, 7]]
 * }, {
 *   lineSmooth: Interpolation.cardinal({
 *     tension: 1,
 *     fillHoles: false
 *   })
 * });
 * ```
 *
 * @param options The options of the cardinal factory function.
 */
export declare function cardinal(options?: CardinalInterpolationOptions): (pathCoordinates: number[], valueData: SegmentData[]) => SvgPath;
//# sourceMappingURL=cardinal.d.ts.map