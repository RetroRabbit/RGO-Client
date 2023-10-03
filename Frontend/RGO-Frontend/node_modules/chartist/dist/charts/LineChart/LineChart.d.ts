import type { LineChartData, LineChartOptions, LineChartOptionsWithDefaults, LineChartEventsTypes } from './LineChart.types';
import type { Series, SeriesObject, ResponsiveOptions } from '../../core';
import { BaseChart } from './../BaseChart';
export declare function getSeriesOption<T extends keyof Omit<LineChartOptionsWithDefaults, 'series'>>(series: Series | SeriesObject, options: LineChartOptionsWithDefaults, key: T): LineChartOptionsWithDefaults[T];
export declare class LineChart extends BaseChart<LineChartEventsTypes> {
    protected data: LineChartData;
    /**
     * This method creates a new line chart.
     * @param query A selector query string or directly a DOM element
     * @param data The data object that needs to consist of a labels and a series array
     * @param options The options object with options that override the default options. Check the examples for a detailed list.
     * @param responsiveOptions Specify an array of responsive option arrays which are a media query and options object pair => [[mediaQueryString, optionsObject],[more...]]
     * @return An object which exposes the API for the created chart
     *
     * @example
     * ```ts
     * // Create a simple line chart
     * const data = {
     *   // A labels array that can contain any sort of values
     *   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
     *   // Our series array that contains series objects or in this case series data arrays
     *   series: [
     *     [5, 2, 4, 2, 0]
     *   ]
     * };
     *
     * // As options we currently only set a static size of 300x200 px
     * const options = {
     *   width: '300px',
     *   height: '200px'
     * };
     *
     * // In the global name space Chartist we call the Line function to initialize a line chart. As a first parameter we pass in a selector where we would like to get our chart created. Second parameter is the actual data object and as a third parameter we pass in our options
     * new LineChart('.ct-chart', data, options);
     * ```
     *
     * @example
     * ```ts
     * // Use specific interpolation function with configuration from the Chartist.Interpolation module
     *
     * const chart = new LineChart('.ct-chart', {
     *   labels: [1, 2, 3, 4, 5],
     *   series: [
     *     [1, 1, 8, 1, 7]
     *   ]
     * }, {
     *   lineSmooth: Chartist.Interpolation.cardinal({
     *     tension: 0.2
     *   })
     * });
     * ```
     *
     * @example
     * ```ts
     * // Create a line chart with responsive options
     *
     * const data = {
     *   // A labels array that can contain any sort of values
     *   labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
     *   // Our series array that contains series objects or in this case series data arrays
     *   series: [
     *     [5, 2, 4, 2, 0]
     *   ]
     * };
     *
     * // In addition to the regular options we specify responsive option overrides that will override the default configutation based on the matching media queries.
     * const responsiveOptions = [
     *   ['screen and (min-width: 641px) and (max-width: 1024px)', {
     *     showPoint: false,
     *     axisX: {
     *       labelInterpolationFnc: function(value) {
     *         // Will return Mon, Tue, Wed etc. on medium screens
     *         return value.slice(0, 3);
     *       }
     *     }
     *   }],
     *   ['screen and (max-width: 640px)', {
     *     showLine: false,
     *     axisX: {
     *       labelInterpolationFnc: function(value) {
     *         // Will return M, T, W etc. on small screens
     *         return value[0];
     *       }
     *     }
     *   }]
     * ];
     *
     * new LineChart('.ct-chart', data, null, responsiveOptions);
     * ```
     */
    constructor(query: string | Element | null, data: LineChartData, options?: LineChartOptions, responsiveOptions?: ResponsiveOptions<LineChartOptions>);
    /**
     * Creates a new chart
     */
    createChart(options: LineChartOptionsWithDefaults): void;
}
//# sourceMappingURL=LineChart.d.ts.map