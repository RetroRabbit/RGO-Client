import type { ChartPadding, ChartRect, Options, Label } from './types';
import type { EventEmitter } from '../event';
import type { Axis } from '../axes';
import { Svg } from '../svg/Svg';
/**
 * Create or reinitialize the SVG element for the chart
 * @param container The containing DOM Node object that will be used to plant the SVG element
 * @param width Set the width of the SVG element. Default is 100%
 * @param height Set the height of the SVG element. Default is 100%
 * @param className Specify a class to be added to the SVG element
 * @return The created/reinitialized SVG element
 */
export declare function createSvg(container: Element, width?: number | string, height?: number | string, className?: string): Svg;
/**
 * Converts a number into a padding object.
 * @param padding
 * @param fallback This value is used to fill missing values if a incomplete padding object was passed
 * @returns Returns a padding object containing top, right, bottom, left properties filled with the padding number passed in as argument. If the argument is something else than a number (presumably already a correct padding object) then this argument is directly returned.
 */
export declare function normalizePadding(padding: number | Partial<ChartPadding> | undefined): {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
/**
 * Initialize chart drawing rectangle (area where chart is drawn) x1,y1 = bottom left / x2,y2 = top right
 * @param svg The svg element for the chart
 * @param options The Object that contains all the optional values for the chart
 * @return The chart rectangles coordinates inside the svg element plus the rectangles measurements
 */
export declare function createChartRect(svg: Svg, options: Options): {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    padding: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    width(): number;
    height(): number;
};
/**
 * Creates a grid line based on a projected value.
 */
export declare function createGrid(position: number, index: number, axis: Axis, offset: number, length: number, group: Svg, classes: string[], eventEmitter: EventEmitter): void;
/**
 * Creates a grid background rect and emits the draw event.
 */
export declare function createGridBackground(gridGroup: Svg, chartRect: ChartRect, className: string, eventEmitter: EventEmitter): void;
/**
 * Creates a label based on a projected value and an axis.
 */
export declare function createLabel(position: number, length: number, index: number, label: Label, axis: Axis, axisOffset: number, labelOffset: {
    x: number;
    y: number;
}, group: Svg, classes: string[], eventEmitter: EventEmitter): void;
//# sourceMappingURL=creation.d.ts.map