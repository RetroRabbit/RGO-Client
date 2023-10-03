import type { ChartRect, AxisOptions, NormalizedSeries, NormalizedSeriesPrimitiveValue } from '../core';
import { AxisUnits, Axis } from './Axis';
export declare class FixedScaleAxis extends Axis {
    readonly range: {
        min: number;
        max: number;
    };
    constructor(axisUnit: AxisUnits, data: NormalizedSeries[], chartRect: ChartRect, options: AxisOptions);
    projectValue(value: NormalizedSeriesPrimitiveValue): number;
}
//# sourceMappingURL=FixedScaleAxis.d.ts.map