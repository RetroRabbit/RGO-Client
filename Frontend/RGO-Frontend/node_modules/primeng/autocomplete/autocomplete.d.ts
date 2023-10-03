import { AnimationEvent } from '@angular/animations';
import { AfterContentInit, AfterViewChecked, ChangeDetectorRef, ElementRef, EventEmitter, IterableDiffers, NgZone, OnDestroy, QueryList, Renderer2, TemplateRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { OverlayOptions, OverlayService, PrimeNGConfig, PrimeTemplate } from 'primeng/api';
import { ConnectedOverlayScrollHandler } from 'primeng/dom';
import { Overlay } from 'primeng/overlay';
import { Scroller } from 'primeng/scroller';
import { ScrollerOptions } from 'primeng/api';
import { Nullable, VoidListener } from 'primeng/ts-helpers';
import { AutoCompleteCompleteEvent, AutoCompleteDropdownClickEvent, AutoCompleteLazyLoadEvent } from './autocomplete.interface';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/overlay";
import * as i3 from "primeng/inputtext";
import * as i4 from "primeng/button";
import * as i5 from "primeng/api";
import * as i6 from "primeng/ripple";
import * as i7 from "primeng/scroller";
import * as i8 from "primeng/autofocus";
import * as i9 from "primeng/icons/timescircle";
import * as i10 from "primeng/icons/spinner";
import * as i11 from "primeng/icons/times";
import * as i12 from "primeng/icons/chevrondown";
export declare const AUTOCOMPLETE_VALUE_ACCESSOR: any;
/**
 * AutoComplete is an input component that provides real-time suggestions when being typed.
 * @group Components
 */
export declare class AutoComplete implements AfterViewChecked, AfterContentInit, OnDestroy, ControlValueAccessor {
    private document;
    el: ElementRef;
    renderer: Renderer2;
    cd: ChangeDetectorRef;
    differs: IterableDiffers;
    config: PrimeNGConfig;
    overlayService: OverlayService;
    private zone;
    /**
     * Minimum number of characters to initiate a search.
     * @group Props
     */
    minLength: number;
    /**
     * Delay between keystrokes to wait before sending a query.
     * @group Props
     */
    delay: number;
    /**
     * Inline style of the component.
     * @group Props
     */
    style: {
        [klass: string]: any;
    } | null | undefined;
    /**
     * Inline style of the overlay panel element.
     * @group Props
     */
    panelStyle: {
        [klass: string]: any;
    } | null | undefined;
    /**
     * Style class of the component.
     * @group Props
     */
    styleClass: string | undefined;
    /**
     * Style class of the overlay panel element.
     * @group Props
     */
    panelStyleClass: string | undefined;
    /**
     * Inline style of the input field.
     * @group Props
     */
    inputStyle: {
        [klass: string]: any;
    } | null | undefined;
    /**
     * Identifier of the focus input to match a label defined for the component.
     * @group Props
     */
    inputId: string | undefined;
    /**
     * Inline style of the input field.
     * @group Props
     */
    inputStyleClass: string | undefined;
    /**
     * Hint text for the input field.
     * @group Props
     */
    placeholder: string | undefined;
    /**
     * When present, it specifies that the input cannot be typed.
     * @group Props
     */
    readonly: boolean | undefined;
    /**
     * When present, it specifies that the component should be disabled.
     * @group Props
     */
    disabled: boolean | undefined;
    /**
     * Maximum height of the suggestions panel.
     * @group Props
     */
    scrollHeight: string;
    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    lazy: boolean;
    /**
     * Whether the data should be loaded on demand during scroll.
     * @group Props
     */
    virtualScroll: boolean | undefined;
    /**
     * Height of an item in the list for VirtualScrolling.
     * @group Props
     */
    virtualScrollItemSize: number | undefined;
    /**
     * Whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    virtualScrollOptions: ScrollerOptions | undefined;
    /**
     * Maximum number of character allows in the input field.
     * @group Props
     */
    maxlength: number | undefined;
    /**
     * Name of the input element.
     * @group Props
     */
    name: string | undefined;
    /**
     * When present, it specifies that an input field must be filled out before submitting the form.
     * @group Props
     */
    required: boolean | undefined;
    /**
     * Size of the input field.
     * @group Props
     */
    size: number | undefined;
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @group Props
     */
    appendTo: HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any;
    /**
     * When enabled, highlights the first item in the list by default.
     * @group Props
     */
    autoHighlight: boolean | undefined;
    /**
     * When present, autocomplete clears the manual input if it does not match of the suggestions to force only accepting values from the suggestions.
     * @group Props
     */
    forceSelection: boolean | undefined;
    /**
     * Type of the input, defaults to "text".
     * @group Props
     */
    type: string;
    _autoZIndex: boolean;
    get autoZIndex(): boolean;
    set autoZIndex(val: boolean);
    _baseZIndex: number;
    get baseZIndex(): number;
    set baseZIndex(val: number);
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    ariaLabel: string | undefined;
    /**
     * Defines a string that labels the dropdown button for accessibility.
     * @group Props
     */
    dropdownAriaLabel: string | undefined;
    /**
     * Specifies one or more IDs in the DOM that labels the input field.
     * @group Props
     */
    ariaLabelledBy: string | undefined;
    /**
     * Icon class of the dropdown icon.
     * @group Props
     */
    dropdownIcon: string | undefined;
    /**
     * Ensures uniqueness of selected items on multiple mode.
     * @group Props
     */
    unique: boolean;
    /**
     * Whether to display options as grouped when nested options are provided.
     * @group Props
     */
    group: boolean | undefined;
    /**
     * Whether to run a query when input receives focus.
     * @group Props
     */
    completeOnFocus: boolean;
    /**
     * When enabled, a clear icon is displayed to clear the value.
     * @group Props
     */
    showClear: boolean;
    /**
     * Field of a suggested object to resolve and display.
     * @group Props
     */
    field: string | undefined;
    /**
     * Displays a button next to the input field when enabled.
     * @group Props
     */
    dropdown: boolean | undefined;
    /**
     * Whether to show the empty message or not.
     * @group Props
     */
    showEmptyMessage: boolean | undefined;
    /**
     * Specifies the behavior dropdown button. Default "blank" mode sends an empty string and "current" mode sends the input value.
     * @group Props
     */
    dropdownMode: string;
    /**
     * Specifies if multiple values can be selected.
     * @group Props
     */
    multiple: boolean | undefined;
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex: number | undefined;
    /**
     * A property to uniquely identify a value in options.
     * @group Props
     */
    dataKey: string | undefined;
    /**
     * Text to display when there is no data. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    emptyMessage: string | undefined;
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
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus: boolean | undefined;
    /**
     * Used to define a string that autocomplete attribute the current element.
     * @group Props
     */
    autocomplete: string;
    /**
     * Name of the options field of an option group.
     * @group Props
     */
    optionGroupChildren: string | undefined;
    /**
     * Name of the label field of an option group.
     * @group Props
     */
    optionGroupLabel: string | undefined;
    /**
     * Options for the overlay element.
     * @group Props
     */
    overlayOptions: OverlayOptions | undefined;
    /**
     * An array of suggestions to display.
     * @group Props
     */
    get suggestions(): any[];
    set suggestions(value: any[]);
    /**
     * Element dimensions of option for virtual scrolling.
     * @group Props
     * @deprecated use virtualScrollItemSize property instead.
     */
    get itemSize(): number;
    set itemSize(val: number);
    /**
     * Callback to invoke to search for suggestions.
     * @param {AutoCompleteCompleteEvent} event - Custom complete event.
     * @group Emits
     */
    completeMethod: EventEmitter<AutoCompleteCompleteEvent>;
    /**
     * Callback to invoke when a suggestion is selected.
     * @param {*} value - selected value.
     * @group Emits
     */
    onSelect: EventEmitter<any>;
    /**
     * Callback to invoke when a selected value is removed.
     * @param {*} value - removed value.
     * @group Emits
     */
    onUnselect: EventEmitter<any>;
    /**
     * Callback to invoke when the component receives focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onFocus: EventEmitter<Event>;
    /**
     * Callback to invoke when the component loses focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onBlur: EventEmitter<Event>;
    /**
     * Callback to invoke to when dropdown button is clicked.
     * @param {AutoCompleteDropdownClickEvent} event - custom dropdown click event.
     * @group Emits
     */
    onDropdownClick: EventEmitter<AutoCompleteDropdownClickEvent>;
    /**
     * Callback to invoke when clear button is clicked.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onClear: EventEmitter<Event | undefined>;
    /**
     * Callback to invoke on input key up.
     * @param {KeyboardEvent} event - Keyboard event.
     * @group Emits
     */
    onKeyUp: EventEmitter<KeyboardEvent>;
    /**
     * Callback to invoke on overlay is shown.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onShow: EventEmitter<Event>;
    /**
     * Callback to invoke on overlay is hidden.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onHide: EventEmitter<Event>;
    /**
     * Callback to invoke on lazy load data.
     * @param {AutoCompleteLazyLoadEvent} event - Lazy load event.
     * @group Emits
     */
    onLazyLoad: EventEmitter<AutoCompleteLazyLoadEvent>;
    containerEL: Nullable<ElementRef>;
    inputEL: Nullable<ElementRef>;
    multiInputEl: Nullable<ElementRef>;
    multiContainerEL: Nullable<ElementRef>;
    dropdownButton: Nullable<ElementRef>;
    itemsViewChild: Nullable<ElementRef>;
    scroller: Nullable<Scroller>;
    overlayViewChild: Overlay;
    templates: Nullable<QueryList<PrimeTemplate>>;
    _itemSize: Nullable<number>;
    itemsWrapper: Nullable<HTMLDivElement>;
    itemTemplate: Nullable<TemplateRef<any>>;
    emptyTemplate: Nullable<TemplateRef<any>>;
    headerTemplate: Nullable<TemplateRef<any>>;
    footerTemplate: Nullable<TemplateRef<any>>;
    selectedItemTemplate: Nullable<TemplateRef<any>>;
    groupTemplate: Nullable<TemplateRef<any>>;
    loaderTemplate: Nullable<TemplateRef<any>>;
    removeIconTemplate: Nullable<TemplateRef<any>>;
    loadingIconTemplate: Nullable<TemplateRef<any>>;
    clearIconTemplate: Nullable<TemplateRef<any>>;
    dropdownIconTemplate: Nullable<TemplateRef<any>>;
    value: string | any;
    _suggestions: any;
    onModelChange: Function;
    onModelTouched: Function;
    timeout: Nullable<any>;
    overlayVisible: boolean;
    suggestionsUpdated: Nullable<boolean>;
    highlightOption: any;
    highlightOptionChanged: Nullable<boolean>;
    focus: boolean;
    filled: number | boolean | undefined;
    inputClick: Nullable<boolean>;
    inputKeyDown: Nullable<boolean>;
    noResults: Nullable<boolean>;
    differ: any;
    inputFieldValue: Nullable<string>;
    loading: Nullable<boolean>;
    scrollHandler: Nullable<ConnectedOverlayScrollHandler>;
    documentResizeListener: VoidListener;
    forceSelectionUpdateModelTimeout: any;
    listId: string | undefined;
    itemClicked: boolean | undefined;
    inputValue: Nullable<string>;
    isSearching: boolean;
    constructor(document: Document, el: ElementRef, renderer: Renderer2, cd: ChangeDetectorRef, differs: IterableDiffers, config: PrimeNGConfig, overlayService: OverlayService, zone: NgZone);
    ngAfterViewChecked(): void;
    handleSuggestionsChange(): void;
    ngAfterContentInit(): void;
    writeValue(value: any): void;
    getOptionGroupChildren(optionGroup: any): any;
    getOptionGroupLabel(optionGroup: any): any;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    setDisabledState(val: boolean): void;
    onInput(event: Event): void;
    onInputClick(event: MouseEvent): void;
    search(event: any, query: string): void;
    selectItem(option: any, focus?: boolean): void;
    show(event?: Event): void;
    clear(): void;
    onOverlayAnimationStart(event: AnimationEvent): void;
    resolveFieldData(value: any): any;
    hide(event?: any): void;
    handleDropdownClick(event: Event): void;
    focusInput(): void;
    get emptyMessageLabel(): string;
    removeItem(item: any): void;
    onKeydown(event: Event): void;
    onKeyup(event: KeyboardEvent): void;
    onInputFocus(event: Event): void;
    onInputBlur(event: Event): void;
    onInputChange(event: Event): void;
    onInputPaste(event: ClipboardEvent): void;
    isSelected(val: any): boolean;
    findOptionIndex(option: any, suggestions: any): number;
    findOptionGroupIndex(val: any, opts: any[]): any;
    updateFilledState(): void;
    updateInputField(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AutoComplete, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AutoComplete, "p-autoComplete", never, { "minLength": { "alias": "minLength"; "required": false; }; "delay": { "alias": "delay"; "required": false; }; "style": { "alias": "style"; "required": false; }; "panelStyle": { "alias": "panelStyle"; "required": false; }; "styleClass": { "alias": "styleClass"; "required": false; }; "panelStyleClass": { "alias": "panelStyleClass"; "required": false; }; "inputStyle": { "alias": "inputStyle"; "required": false; }; "inputId": { "alias": "inputId"; "required": false; }; "inputStyleClass": { "alias": "inputStyleClass"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "readonly": { "alias": "readonly"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "scrollHeight": { "alias": "scrollHeight"; "required": false; }; "lazy": { "alias": "lazy"; "required": false; }; "virtualScroll": { "alias": "virtualScroll"; "required": false; }; "virtualScrollItemSize": { "alias": "virtualScrollItemSize"; "required": false; }; "virtualScrollOptions": { "alias": "virtualScrollOptions"; "required": false; }; "maxlength": { "alias": "maxlength"; "required": false; }; "name": { "alias": "name"; "required": false; }; "required": { "alias": "required"; "required": false; }; "size": { "alias": "size"; "required": false; }; "appendTo": { "alias": "appendTo"; "required": false; }; "autoHighlight": { "alias": "autoHighlight"; "required": false; }; "forceSelection": { "alias": "forceSelection"; "required": false; }; "type": { "alias": "type"; "required": false; }; "autoZIndex": { "alias": "autoZIndex"; "required": false; }; "baseZIndex": { "alias": "baseZIndex"; "required": false; }; "ariaLabel": { "alias": "ariaLabel"; "required": false; }; "dropdownAriaLabel": { "alias": "dropdownAriaLabel"; "required": false; }; "ariaLabelledBy": { "alias": "ariaLabelledBy"; "required": false; }; "dropdownIcon": { "alias": "dropdownIcon"; "required": false; }; "unique": { "alias": "unique"; "required": false; }; "group": { "alias": "group"; "required": false; }; "completeOnFocus": { "alias": "completeOnFocus"; "required": false; }; "showClear": { "alias": "showClear"; "required": false; }; "field": { "alias": "field"; "required": false; }; "dropdown": { "alias": "dropdown"; "required": false; }; "showEmptyMessage": { "alias": "showEmptyMessage"; "required": false; }; "dropdownMode": { "alias": "dropdownMode"; "required": false; }; "multiple": { "alias": "multiple"; "required": false; }; "tabindex": { "alias": "tabindex"; "required": false; }; "dataKey": { "alias": "dataKey"; "required": false; }; "emptyMessage": { "alias": "emptyMessage"; "required": false; }; "showTransitionOptions": { "alias": "showTransitionOptions"; "required": false; }; "hideTransitionOptions": { "alias": "hideTransitionOptions"; "required": false; }; "autofocus": { "alias": "autofocus"; "required": false; }; "autocomplete": { "alias": "autocomplete"; "required": false; }; "optionGroupChildren": { "alias": "optionGroupChildren"; "required": false; }; "optionGroupLabel": { "alias": "optionGroupLabel"; "required": false; }; "overlayOptions": { "alias": "overlayOptions"; "required": false; }; "suggestions": { "alias": "suggestions"; "required": false; }; "itemSize": { "alias": "itemSize"; "required": false; }; }, { "completeMethod": "completeMethod"; "onSelect": "onSelect"; "onUnselect": "onUnselect"; "onFocus": "onFocus"; "onBlur": "onBlur"; "onDropdownClick": "onDropdownClick"; "onClear": "onClear"; "onKeyUp": "onKeyUp"; "onShow": "onShow"; "onHide": "onHide"; "onLazyLoad": "onLazyLoad"; }, ["templates"], never, false, never>;
}
export declare class AutoCompleteModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<AutoCompleteModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<AutoCompleteModule, [typeof AutoComplete], [typeof i1.CommonModule, typeof i2.OverlayModule, typeof i3.InputTextModule, typeof i4.ButtonModule, typeof i5.SharedModule, typeof i6.RippleModule, typeof i7.ScrollerModule, typeof i8.AutoFocusModule, typeof i9.TimesCircleIcon, typeof i10.SpinnerIcon, typeof i11.TimesIcon, typeof i12.ChevronDownIcon], [typeof AutoComplete, typeof i2.OverlayModule, typeof i5.SharedModule, typeof i7.ScrollerModule, typeof i8.AutoFocusModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<AutoCompleteModule>;
}
