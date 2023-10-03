import type { Data, Options, ResponsiveOptions } from '../core';
import type { Svg } from '../svg';
import type { BaseChartEventsTypes } from './types';
import { EventListener, AllEventsListener, EventEmitter } from '../event';
export declare abstract class BaseChart<TEventsTypes = BaseChartEventsTypes> {
    protected data: Data;
    private readonly defaultOptions;
    private options;
    private readonly responsiveOptions?;
    protected svg?: Svg;
    protected readonly container: Element;
    protected readonly eventEmitter: EventEmitter;
    private readonly resizeListener;
    private initializeTimeoutId;
    private optionsProvider?;
    constructor(query: string | Element | null, data: Data, defaultOptions: Options, options: Options, responsiveOptions?: ResponsiveOptions<Options<import("../core").AxisOptions, import("../core").AxisOptions>> | undefined);
    abstract createChart(options: Options): void;
    /**
     * Updates the chart which currently does a full reconstruction of the SVG DOM
     * @param data Optional data you'd like to set for the chart before it will update. If not specified the update method will use the data that is already configured with the chart.
     * @param options Optional options you'd like to add to the previous options for the chart before it will update. If not specified the update method will use the options that have been already configured with the chart.
     * @param override If set to true, the passed options will be used to extend the options that have been configured already. Otherwise the chart default options will be used as the base
     */
    update(data?: Data, options?: Options, override?: boolean): this;
    /**
     * This method can be called on the API object of each chart and will un-register all event listeners that were added to other components. This currently includes a window.resize listener as well as media query listeners if any responsive options have been provided. Use this function if you need to destroy and recreate Chartist charts dynamically.
     */
    detach(): this;
    /**
     * Use this function to register event handlers. The handler callbacks are synchronous and will run in the main thread rather than the event loop.
     * @param event Name of the event. Check the examples for supported events.
     * @param listener The handler function that will be called when an event with the given name was emitted. This function will receive a data argument which contains event data. See the example for more details.
     */
    on<T extends keyof TEventsTypes>(event: T, listener: EventListener<TEventsTypes[T]>): this;
    on(event: '*', listener: AllEventsListener): this;
    on(event: string, listener: EventListener): this;
    /**
     * Use this function to un-register event handlers. If the handler function parameter is omitted all handlers for the given event will be un-registered.
     * @param event Name of the event for which a handler should be removed
     * @param listener The handler function that that was previously used to register a new event handler. This handler will be removed from the event handler list. If this parameter is omitted then all event handlers for the given event are removed from the list.
     */
    off<T extends keyof TEventsTypes>(event: T, listener?: EventListener<TEventsTypes[T]>): this;
    off(event: '*', listener?: AllEventsListener): this;
    off(event: string, listener?: EventListener): this;
    initialize(): void;
}
//# sourceMappingURL=BaseChart.d.ts.map