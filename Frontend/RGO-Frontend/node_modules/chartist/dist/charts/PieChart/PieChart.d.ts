import type { LabelDirection, AnchorPosition, Dot, PieChartData, PieChartOptions, PieChartOptionsWithDefaults, PieChartEventsTypes } from './PieChart.types';
import type { ResponsiveOptions } from '../../core';
import { BaseChart } from '../BaseChart';
/**
 * Determines SVG anchor position based on direction and center parameter
 */
export declare function determineAnchorPosition(center: Dot, label: Dot, direction: LabelDirection): AnchorPosition;
export declare class PieChart extends BaseChart<PieChartEventsTypes> {
    protected data: PieChartData;
    /**
     * This method creates a new pie chart and returns an object that can be used to redraw the chart.
     * @param query A selector query string or directly a DOM element
     * @param data The data object in the pie chart needs to have a series property with a one dimensional data array. The values will be normalized against each other and don't necessarily need to be in percentage. The series property can also be an array of value objects that contain a value property and a className property to override the CSS class name for the series group.
     * @param options The options object with options that override the default options. Check the examples for a detailed list.
     * @param responsiveOptions Specify an array of responsive option arrays which are a media query and options object pair => [[mediaQueryString, optionsObject],[more...]]
     *
     * @example
     * ```ts
     * // Simple pie chart example with four series
     * new PieChart('.ct-chart', {
     *   series: [10, 2, 4, 3]
     * });
     * ```
     *
     * @example
     * ```ts
     * // Drawing a donut chart
     * new PieChart('.ct-chart', {
     *   series: [10, 2, 4, 3]
     * }, {
     *   donut: true
     * });
     * ```
     *
     * @example
     * ```ts
     * // Using donut, startAngle and total to draw a gauge chart
     * new PieChart('.ct-chart', {
     *   series: [20, 10, 30, 40]
     * }, {
     *   donut: true,
     *   donutWidth: 20,
     *   startAngle: 270,
     *   total: 200
     * });
     * ```
     *
     * @example
     * ```ts
     * // Drawing a pie chart with padding and labels that are outside the pie
     * new PieChart('.ct-chart', {
     *   series: [20, 10, 30, 40]
     * }, {
     *   chartPadding: 30,
     *   labelOffset: 50,
     *   labelDirection: 'explode'
     * });
     * ```
     *
     * @example
     * ```ts
     * // Overriding the class names for individual series as well as a name and meta data.
     * // The name will be written as ct:series-name attribute and the meta data will be serialized and written
     * // to a ct:meta attribute.
     * new PieChart('.ct-chart', {
     *   series: [{
     *     value: 20,
     *     name: 'Series 1',
     *     className: 'my-custom-class-one',
     *     meta: 'Meta One'
     *   }, {
     *     value: 10,
     *     name: 'Series 2',
     *     className: 'my-custom-class-two',
     *     meta: 'Meta Two'
     *   }, {
     *     value: 70,
     *     name: 'Series 3',
     *     className: 'my-custom-class-three',
     *     meta: 'Meta Three'
     *   }]
     * });
     * ```
     */
    constructor(query: string | Element | null, data: PieChartData, options?: PieChartOptions, responsiveOptions?: ResponsiveOptions<PieChartOptions>);
    /**
     * Creates the pie chart
     *
     * @param options
     */
    createChart(options: PieChartOptionsWithDefaults): void;
}
//# sourceMappingURL=PieChart.d.ts.map