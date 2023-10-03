import type { Options, AxisName, NormalizedSeries } from '../types';
/**
 * Get highest and lowest value of data array. This Array contains the data that will be visualized in the chart.
 * @param data The array that contains the data to be visualized in the chart
 * @param options The Object that contains the chart options
 * @param dimension Axis dimension 'x' or 'y' used to access the correct value and high / low configuration
 * @return An object that contains the highest and lowest value that will be visualized on the chart.
 */
export declare function getHighLow(data: NormalizedSeries[], options: Options, dimension?: AxisName): {
    high: number;
    low: number;
};
//# sourceMappingURL=highLow.d.ts.map