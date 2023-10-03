import type { Label, ChartRect, OptionsWithDefaults, NormalizedSeriesPrimitiveValue, NormalizedSeries } from '../core';
import type { Svg } from '../svg';
import type { EventEmitter } from '../event';
export declare const axisUnits: {
    readonly x: {
        readonly pos: "x";
        readonly len: "width";
        readonly dir: "horizontal";
        readonly rectStart: "x1";
        readonly rectEnd: "x2";
        readonly rectOffset: "y2";
    };
    readonly y: {
        readonly pos: "y";
        readonly len: "height";
        readonly dir: "vertical";
        readonly rectStart: "y2";
        readonly rectEnd: "y1";
        readonly rectOffset: "x1";
    };
};
export declare type XAxisUnits = typeof axisUnits.x;
export declare type YAxisUnits = typeof axisUnits.y;
export declare type AxisUnits = XAxisUnits | YAxisUnits;
export declare abstract class Axis {
    readonly units: AxisUnits;
    private readonly chartRect;
    private readonly ticks;
    readonly counterUnits: AxisUnits;
    readonly range: {
        min: number;
        max: number;
    } | undefined;
    readonly axisLength: number;
    private readonly gridOffset;
    constructor(units: AxisUnits, chartRect: ChartRect, ticks: Label[]);
    abstract projectValue(value: NormalizedSeriesPrimitiveValue | Label, index?: number, series?: NormalizedSeries): number;
    createGridAndLabels(gridGroup: Svg, labelGroup: Svg, chartOptions: OptionsWithDefaults, eventEmitter: EventEmitter): void;
}
//# sourceMappingURL=Axis.d.ts.map