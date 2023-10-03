import { AfterViewInit, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/api";
/**
 * Badge Directive is directive usage of badge component.
 * @group Components
 */
export declare class BadgeDirective implements AfterViewInit, OnDestroy {
    private document;
    el: ElementRef;
    private renderer;
    /**
     * Icon position of the component.
     * @group Props
     */
    iconPos: 'left' | 'right' | 'top' | 'bottom';
    /**
     * When specified, disables the component.
     * @group Props
     */
    get disabled(): boolean;
    set disabled(val: boolean);
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    get size(): 'large' | 'xlarge';
    set size(val: 'large' | 'xlarge');
    /**
     * Value to display inside the badge.
     * @group Props
     */
    get value(): string;
    set value(val: string);
    /**
     * Severity type of the badge.
     * @group Props
     */
    severity: 'success' | 'info' | 'warning' | 'danger' | null | undefined;
    _value: string;
    initialized: boolean;
    private id;
    private _disabled;
    private _size;
    constructor(document: Document, el: ElementRef, renderer: Renderer2);
    ngAfterViewInit(): any;
    private setSizeClasses;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BadgeDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BadgeDirective, "[pBadge]", never, { "iconPos": { "alias": "iconPos"; "required": false; }; "disabled": { "alias": "badgeDisabled"; "required": false; }; "size": { "alias": "size"; "required": false; }; "value": { "alias": "value"; "required": false; }; "severity": { "alias": "severity"; "required": false; }; }, {}, never, never, false, never>;
}
/**
 * Badge is a small status indicator for another element.
 * @group Components
 */
export declare class Badge {
    /**
     * Class of the element.
     * @group Props
     */
    styleClass: string | undefined;
    /**
     * Inline style of the element.
     * @group Props
     */
    style: {
        [klass: string]: any;
    } | null | undefined;
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    size: 'large' | 'xlarge' | undefined;
    /**
     * Severity type of the badge.
     * @group Props
     */
    severity: 'success' | 'info' | 'warning' | 'danger' | null | undefined;
    /**
     * Value to display inside the badge.
     * @group Props
     */
    value: string | null | undefined;
    /**
     * When specified, disables the component.
     * @group Props
     */
    badgeDisabled: boolean;
    containerClass(): {
        'p-badge p-component': boolean;
        'p-badge-no-gutter': boolean;
        'p-badge-lg': boolean;
        'p-badge-xl': boolean;
        'p-badge-info': boolean;
        'p-badge-success': boolean;
        'p-badge-warning': boolean;
        'p-badge-danger': boolean;
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<Badge, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Badge, "p-badge", never, { "styleClass": { "alias": "styleClass"; "required": false; }; "style": { "alias": "style"; "required": false; }; "size": { "alias": "size"; "required": false; }; "severity": { "alias": "severity"; "required": false; }; "value": { "alias": "value"; "required": false; }; "badgeDisabled": { "alias": "badgeDisabled"; "required": false; }; }, {}, never, never, false, never>;
}
export declare class BadgeModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<BadgeModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<BadgeModule, [typeof Badge, typeof BadgeDirective], [typeof i1.CommonModule], [typeof Badge, typeof BadgeDirective, typeof i2.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<BadgeModule>;
}
