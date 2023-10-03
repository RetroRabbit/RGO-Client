export declare type EventListener<T = any> = (data: T) => void;
export declare type AllEventsListener<T = any> = (event: string, data: T) => void;
export declare class EventEmitter {
    private readonly listeners;
    private readonly allListeners;
    /**
     * Add an event handler for a specific event
     * @param event The event name
     * @param listener A event handler function
     */
    on(event: '*', listener: AllEventsListener): void;
    on(event: string, listener: EventListener): void;
    /**
     * Remove an event handler of a specific event name or remove all event handlers for a specific event.
     * @param event The event name where a specific or all handlers should be removed
     * @param [listener] An optional event handler function. If specified only this specific handler will be removed and otherwise all handlers are removed.
     */
    off(event: '*', listener?: AllEventsListener): void;
    off(event: string, listener?: EventListener): void;
    /**
     * Use this function to emit an event. All handlers that are listening for this event will be triggered with the data parameter.
     * @param event The event name that should be triggered
     * @param data Arbitrary data that will be passed to the event handler callback functions
     */
    emit<T = any>(event: string, data: T): void;
}
//# sourceMappingURL=EventEmitter.d.ts.map