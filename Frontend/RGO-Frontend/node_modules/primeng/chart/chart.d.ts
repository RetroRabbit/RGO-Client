import { ElementRef, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * Chart groups a collection of contents in tabs.
 * @group Components
 */
export declare class UIChart implements AfterViewInit, OnDestroy {
    private platformId;
    el: ElementRef;
    /**
     * Type of the chart.
     * @group Props
     */
    type: string | undefined;
    /**
     * Array of per-chart plugins to customize the chart behaviour.
     * @group Props
     */
    plugins: any[];
    /**
     * Width of the chart.
     * @group Props
     */
    width: string | undefined;
    /**
     * Height of the chart.
     * @group Props
     */
    height: string | undefined;
    /**
     * Whether the chart is redrawn on screen size change.
     * @group Props
     */
    responsive: boolean;
    /**
     * Data to display.
     * @group Props
     */
    get data(): any;
    set data(val: any);
    /**
     * Options to customize the chart.
     * @group Props
     */
    get options(): any;
    set options(val: any);
    /**
     * Callback to execute when an element on chart is clicked.
     * @group Emits
     */
    onDataSelect: EventEmitter<any>;
    isBrowser: boolean;
    initialized: boolean | undefined;
    _data: any;
    _options: any;
    chart: any;
    constructor(platformId: any, el: ElementRef);
    ngAfterViewInit(): void;
    onCanvasClick(event: Event): void;
    initChart(): void;
    getCanvas(): any;
    getBase64Image(): any;
    generateLegend(): any;
    refresh(): void;
    reinit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<UIChart, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UIChart, "p-chart", never, { "type": { "alias": "type"; "required": false; }; "plugins": { "alias": "plugins"; "required": false; }; "width": { "alias": "width"; "required": false; }; "height": { "alias": "height"; "required": false; }; "responsive": { "alias": "responsive"; "required": false; }; "data": { "alias": "data"; "required": false; }; "options": { "alias": "options"; "required": false; }; }, { "onDataSelect": "onDataSelect"; }, never, never, false, never>;
}
export declare class ChartModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ChartModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ChartModule, [typeof UIChart], [typeof i1.CommonModule], [typeof UIChart]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ChartModule>;
}
