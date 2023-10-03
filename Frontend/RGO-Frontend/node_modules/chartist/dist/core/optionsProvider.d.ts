import type { EventEmitter } from '../event';
import type { ResponsiveOptions } from './types';
export interface OptionsProvider<T = unknown> {
    removeMediaQueryListeners(): void;
    getCurrentOptions(): T;
}
/**
 * Provides options handling functionality with callback for options changes triggered by responsive options and media query matches
 * @param options Options set by user
 * @param responsiveOptions Optional functions to add responsive behavior to chart
 * @param eventEmitter The event emitter that will be used to emit the options changed events
 * @return The consolidated options object from the defaults, base and matching responsive options
 */
export declare function optionsProvider<T = unknown>(options: T, responsiveOptions: ResponsiveOptions<T> | undefined, eventEmitter: EventEmitter): OptionsProvider<T>;
//# sourceMappingURL=optionsProvider.d.ts.map