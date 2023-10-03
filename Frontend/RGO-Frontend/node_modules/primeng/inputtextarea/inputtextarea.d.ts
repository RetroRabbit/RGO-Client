import { ElementRef, EventEmitter, AfterViewInit, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgModel, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * InputTextarea adds styling and autoResize functionality to standard textarea element.
 * @group Components
 */
export declare class InputTextarea implements OnInit, AfterViewInit, OnDestroy {
    el: ElementRef;
    ngModel: NgModel;
    control: NgControl;
    private cd;
    /**
     * When present, textarea size changes as being typed.
     * @group Props
     */
    autoResize: boolean | undefined;
    /**
     * Callback to invoke on textarea resize.
     * @param {(Event | {})} event - Custom resize event.
     * @group Emits
     */
    onResize: EventEmitter<Event | {}>;
    filled: boolean | undefined;
    cachedScrollHeight: number | undefined;
    ngModelSubscription: Subscription | undefined;
    ngControlSubscription: Subscription | undefined;
    constructor(el: ElementRef, ngModel: NgModel, control: NgControl, cd: ChangeDetectorRef);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    onInput(e: Event): void;
    updateFilledState(): void;
    resize(event?: Event): void;
    updateState(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<InputTextarea, [null, { optional: true; }, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<InputTextarea, "[pInputTextarea]", never, { "autoResize": { "alias": "autoResize"; "required": false; }; }, { "onResize": "onResize"; }, never, never, false, never>;
}
export declare class InputTextareaModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<InputTextareaModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<InputTextareaModule, [typeof InputTextarea], [typeof i1.CommonModule], [typeof InputTextarea]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<InputTextareaModule>;
}
