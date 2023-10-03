import * as i0 from '@angular/core';
import { EventEmitter, PLATFORM_ID, Component, ChangeDetectionStrategy, ViewEncapsulation, Inject, Input, Output, NgModule } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

/**
 * Chart groups a collection of contents in tabs.
 * @group Components
 */
class UIChart {
    platformId;
    el;
    /**
     * Type of the chart.
     * @group Props
     */
    type;
    /**
     * Array of per-chart plugins to customize the chart behaviour.
     * @group Props
     */
    plugins = [];
    /**
     * Width of the chart.
     * @group Props
     */
    width;
    /**
     * Height of the chart.
     * @group Props
     */
    height;
    /**
     * Whether the chart is redrawn on screen size change.
     * @group Props
     */
    responsive = true;
    /**
     * Data to display.
     * @group Props
     */
    get data() {
        return this._data;
    }
    set data(val) {
        this._data = val;
        this.reinit();
    }
    /**
     * Options to customize the chart.
     * @group Props
     */
    get options() {
        return this._options;
    }
    set options(val) {
        this._options = val;
        this.reinit();
    }
    /**
     * Callback to execute when an element on chart is clicked.
     * @group Emits
     */
    onDataSelect = new EventEmitter();
    isBrowser = false;
    initialized;
    _data;
    _options = {};
    chart;
    constructor(platformId, el) {
        this.platformId = platformId;
        this.el = el;
    }
    ngAfterViewInit() {
        this.initChart();
        this.initialized = true;
    }
    onCanvasClick(event) {
        if (this.chart) {
            const element = this.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
            const dataset = this.chart.getElementsAtEventForMode(event, 'dataset', { intersect: true }, false);
            if (element && element[0] && dataset) {
                this.onDataSelect.emit({ originalEvent: event, element: element[0], dataset: dataset });
            }
        }
    }
    initChart() {
        if (isPlatformBrowser(this.platformId)) {
            let opts = this.options || {};
            opts.responsive = this.responsive;
            // allows chart to resize in responsive mode
            if (opts.responsive && (this.height || this.width)) {
                opts.maintainAspectRatio = false;
            }
            this.chart = new Chart(this.el.nativeElement.children[0].children[0], {
                type: this.type,
                data: this.data,
                options: this.options,
                plugins: this.plugins
            });
        }
    }
    getCanvas() {
        return this.el.nativeElement.children[0].children[0];
    }
    getBase64Image() {
        return this.chart.toBase64Image();
    }
    generateLegend() {
        if (this.chart) {
            return this.chart.generateLegend();
        }
    }
    refresh() {
        if (this.chart) {
            this.chart.update();
        }
    }
    reinit() {
        if (this.chart) {
            this.chart.destroy();
            this.initChart();
        }
    }
    ngOnDestroy() {
        if (this.chart) {
            this.chart.destroy();
            this.initialized = false;
            this.chart = null;
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: UIChart, deps: [{ token: PLATFORM_ID }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.0", type: UIChart, selector: "p-chart", inputs: { type: "type", plugins: "plugins", width: "width", height: "height", responsive: "responsive", data: "data", options: "options" }, outputs: { onDataSelect: "onDataSelect" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <div style="position:relative" [style.width]="responsive && !width ? null : width" [style.height]="responsive && !height ? null : height">
            <canvas [attr.width]="responsive && !width ? null : width" [attr.height]="responsive && !height ? null : height" (click)="onCanvasClick($event)"></canvas>
        </div>
    `, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: UIChart, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-chart',
                    template: `
        <div style="position:relative" [style.width]="responsive && !width ? null : width" [style.height]="responsive && !height ? null : height">
            <canvas [attr.width]="responsive && !width ? null : width" [attr.height]="responsive && !height ? null : height" (click)="onCanvasClick($event)"></canvas>
        </div>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.ElementRef }]; }, propDecorators: { type: [{
                type: Input
            }], plugins: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], responsive: [{
                type: Input
            }], data: [{
                type: Input
            }], options: [{
                type: Input
            }], onDataSelect: [{
                type: Output
            }] } });
class ChartModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: ChartModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.0", ngImport: i0, type: ChartModule, declarations: [UIChart], imports: [CommonModule], exports: [UIChart] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: ChartModule, imports: [CommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: ChartModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [UIChart],
                    declarations: [UIChart]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { ChartModule, UIChart };
//# sourceMappingURL=primeng-chart.mjs.map
