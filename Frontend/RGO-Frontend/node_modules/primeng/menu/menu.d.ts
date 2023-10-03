import { ElementRef, OnDestroy, EventEmitter, Renderer2, ChangeDetectorRef, TemplateRef, PipeTransform } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { ConnectedOverlayScrollHandler } from 'primeng/dom';
import { MenuItem, OverlayService, PrimeNGConfig } from 'primeng/api';
import { Nullable, VoidListener } from 'primeng/ts-helpers';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/tooltip";
export declare class SafeHtmlPipe implements PipeTransform {
    private readonly platformId;
    private readonly sanitizer;
    constructor(platformId: any, sanitizer: DomSanitizer);
    transform(value: string): SafeHtml;
    static ɵfac: i0.ɵɵFactoryDeclaration<SafeHtmlPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<SafeHtmlPipe, "safeHtml", false>;
}
export declare class MenuItemContent {
    item: MenuItem | undefined;
    id: string;
    onMenuItemClick: EventEmitter<any>;
    menu: Menu;
    constructor(menu: Menu);
    onItemClick(event: any, item: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MenuItemContent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MenuItemContent, "[pMenuItemContent]", never, { "item": { "alias": "pMenuItemContent"; "required": false; }; "id": { "alias": "id"; "required": false; }; }, { "onMenuItemClick": "onMenuItemClick"; }, never, never, false, never>;
}
/**
 * Menu is a navigation / command component that supports dynamic and static positioning.
 * @group Components
 */
export declare class Menu implements OnDestroy {
    private document;
    private platformId;
    el: ElementRef;
    renderer: Renderer2;
    private cd;
    config: PrimeNGConfig;
    overlayService: OverlayService;
    /**
     * An array of menuitems.
     * @group Props
     */
    model: MenuItem[] | undefined;
    /**
     * Defines if menu would displayed as a popup.
     * @group Props
     */
    popup: boolean | undefined;
    /**
     * Inline style of the component.
     * @group Props
     */
    style: {
        [klass: string]: any;
    } | null | undefined;
    /**
     * Style class of the component.
     * @group Props
     */
    styleClass: string | undefined;
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @group Props
     */
    appendTo: HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any;
    /**
     * Whether to automatically manage layering.
     * @group Props
     */
    autoZIndex: boolean;
    /**
     * Base zIndex value to use in layering.
     * @group Props
     */
    baseZIndex: number;
    /**
     * Transition options of the show animation.
     * @group Props
     */
    showTransitionOptions: string;
    /**
     * Transition options of the hide animation.
     * @group Props
     */
    hideTransitionOptions: string;
    /**
     * Defines a string value that labels an interactive element.
     * @group Props
     */
    ariaLabel: string | undefined;
    /**
     * Identifier of the underlying input element.
     * @group Props
     */
    ariaLabelledBy: string | undefined;
    /**
     * Current id state as a string.
     * @group Props
     */
    id: string | undefined;
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex: number;
    /**
     * Callback to invoke when overlay menu is shown.
     * @group Emits
     */
    onShow: EventEmitter<any>;
    /**
     * Callback to invoke when overlay menu is hidden.
     * @group Emits
     */
    onHide: EventEmitter<any>;
    /**
     * Callback to invoke when the list loses focus.
     * @param {Event} event - blur event.
     * @group Emits
     */
    onBlur: EventEmitter<Event>;
    /**
     * Callback to invoke when the list receives focus.
     * @param {Event} event - focus event.
     * @group Emits
     */
    onFocus: EventEmitter<Event>;
    listViewChild: Nullable<ElementRef>;
    containerViewChild: Nullable<ElementRef>;
    container: HTMLDivElement | undefined;
    scrollHandler: ConnectedOverlayScrollHandler | null | undefined;
    documentClickListener: VoidListener;
    documentResizeListener: VoidListener;
    preventDocumentDefault: boolean | undefined;
    target: any;
    visible: boolean | undefined;
    focusedOptionId: import("@angular/core").Signal<any>;
    focusedOptionIndex: any;
    selectedOptionIndex: any;
    focused: boolean | undefined;
    overlayVisible: boolean | undefined;
    relativeAlign: boolean | undefined;
    constructor(document: Document, platformId: any, el: ElementRef, renderer: Renderer2, cd: ChangeDetectorRef, config: PrimeNGConfig, overlayService: OverlayService);
    /**
     * Toggles the visibility of the popup menu.
     * @param {Event} event - Browser event.
     * @group Method
     */
    toggle(event: Event): void;
    /**
     * Displays the popup menu.
     * @param {Event} event - Browser event.
     * @group Method
     */
    show(event: any): void;
    ngOnInit(): void;
    onOverlayAnimationStart(event: AnimationEvent): void;
    onOverlayAnimationEnd(event: AnimationEvent): void;
    alignOverlay(): void;
    appendOverlay(): void;
    restoreOverlayAppend(): void;
    moveOnTop(): void;
    /**
     * Hides the popup menu.
     * @group Method
     */
    hide(): void;
    onWindowResize(): void;
    menuitemId(item: MenuItem, id: string, index?: string, childIndex?: string): string;
    isItemFocused(id: any): boolean;
    label(label: any): any;
    disabled(disabled: any): any;
    activedescendant(): any;
    onListFocus(event: Event): void;
    onListBlur(event: FocusEvent | MouseEvent): void;
    onListKeyDown(event: any): void;
    onArrowDownKey(event: any): void;
    onArrowUpKey(event: any): void;
    onHomeKey(event: any): void;
    onEndKey(event: any): void;
    onEnterKey(event: any): void;
    onSpaceKey(event: any): void;
    findNextOptionIndex(index: any): number;
    findPrevOptionIndex(index: any): number;
    changeFocusedOptionIndex(index: any): void;
    itemClick(event: any): void;
    onOverlayClick(event: Event): void;
    bindDocumentClickListener(): void;
    unbindDocumentClickListener(): void;
    bindDocumentResizeListener(): void;
    unbindDocumentResizeListener(): void;
    bindScrollListener(): void;
    unbindScrollListener(): void;
    onOverlayHide(): void;
    ngOnDestroy(): void;
    hasSubMenu(): boolean;
    isItemHidden(item: any): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<Menu, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Menu, "p-menu", never, { "model": { "alias": "model"; "required": false; }; "popup": { "alias": "popup"; "required": false; }; "style": { "alias": "style"; "required": false; }; "styleClass": { "alias": "styleClass"; "required": false; }; "appendTo": { "alias": "appendTo"; "required": false; }; "autoZIndex": { "alias": "autoZIndex"; "required": false; }; "baseZIndex": { "alias": "baseZIndex"; "required": false; }; "showTransitionOptions": { "alias": "showTransitionOptions"; "required": false; }; "hideTransitionOptions": { "alias": "hideTransitionOptions"; "required": false; }; "ariaLabel": { "alias": "ariaLabel"; "required": false; }; "ariaLabelledBy": { "alias": "ariaLabelledBy"; "required": false; }; "id": { "alias": "id"; "required": false; }; "tabindex": { "alias": "tabindex"; "required": false; }; }, { "onShow": "onShow"; "onHide": "onHide"; "onBlur": "onBlur"; "onFocus": "onFocus"; }, never, never, false, never>;
}
export declare class MenuModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MenuModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MenuModule, [typeof Menu, typeof MenuItemContent, typeof SafeHtmlPipe], [typeof i1.CommonModule, typeof i2.RouterModule, typeof i3.RippleModule, typeof i4.TooltipModule], [typeof Menu, typeof i2.RouterModule, typeof i4.TooltipModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MenuModule>;
}
