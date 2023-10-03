import type { Data, NormalizedData, AxisName, Series, FlatSeries, NormalizedSeries, NormalizedFlatSeries, SeriesObject } from '../types';
/**
 * Ensures that the data object passed as second argument to the charts is present and correctly initialized.
 * @param data The data object that is passed as second argument to the charts
 * @return The normalized data object
 */
export declare function normalizeData(data: Data<FlatSeries>, reverse?: boolean, multi?: false): NormalizedData<NormalizedFlatSeries>;
export declare function normalizeData(data: Data<(Series | SeriesObject)[]>, reverse: boolean | undefined, multi: true | AxisName): NormalizedData<NormalizedSeries[]>;
export declare function normalizeData(data: Data<FlatSeries | (Series | SeriesObject)[]>, reverse: boolean | undefined, multi: boolean | AxisName, distributed: true): NormalizedData<NormalizedSeries[]>;
export declare function normalizeData(data: Data<FlatSeries | (Series | SeriesObject)[]>, reverse?: boolean, multi?: boolean | AxisName): NormalizedData<NormalizedFlatSeries | NormalizedSeries[]>;
//# sourceMappingURL=normalize.d.ts.map