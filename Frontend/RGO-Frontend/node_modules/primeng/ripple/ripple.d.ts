import { AfterViewInit, ElementRef, NgZone, OnDestroy, Renderer2 } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { VoidListener } from 'primeng/ts-helpers';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * Ripple directive adds ripple effect to the host element.
 * @group Components
 */
export declare class Ripple implements AfterViewInit, OnDestroy {
    private document;
    private platformId;
    private renderer;
    el: ElementRef;
    zone: NgZone;
    config: PrimeNGConfig;
    constructor(document: Document, platformId: any, renderer: Renderer2, el: ElementRef, zone: NgZone, config: PrimeNGConfig);
    animationListener: VoidListener;
    mouseDownListener: VoidListener;
    timeout: any;
    ngAfterViewInit(): void;
    onMouseDown(event: MouseEvent): void;
    getInk(): any;
    resetInk(): void;
    onAnimationEnd(event: Event): void;
    create(): void;
    remove(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Ripple, [null, null, null, null, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<Ripple, "[pRipple]", never, {}, {}, never, never, false, never>;
}
export declare class RippleModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<RippleModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<RippleModule, [typeof Ripple], [typeof i1.CommonModule], [typeof Ripple]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<RippleModule>;
}
