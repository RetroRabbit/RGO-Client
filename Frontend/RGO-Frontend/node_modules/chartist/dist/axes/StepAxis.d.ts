import type { ChartRect, AxisOptions } from '../core';
import { AxisUnits, Axis } from './Axis';
export declare class StepAxis extends Axis {
    private readonly stepLength;
    readonly stretch: boolean;
    constructor(axisUnit: AxisUnits, _data: unknown, chartRect: ChartRect, options: AxisOptions);
    projectValue(_value: unknown, index: number): number;
}
//# sourceMappingURL=StepAxis.d.ts.map