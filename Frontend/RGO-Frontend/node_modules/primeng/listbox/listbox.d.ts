import { ElementRef, EventEmitter, AfterContentInit, QueryList, TemplateRef, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { PrimeTemplate, FilterService, PrimeNGConfig } from 'primeng/api';
import { ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Nullable } from 'primeng/ts-helpers';
import { ListboxChangeEvent, ListboxClickEvent, ListboxDoubleClickEvent, ListboxFilterOptions } from './listbox.interface';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/api";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/icons/search";
import * as i5 from "primeng/icons/check";
export declare const LISTBOX_VALUE_ACCESSOR: any;
/**
 * ListBox is used to select one or more values from a list of items.
 * @group Components
 */
export declare class Listbox implements AfterContentInit, OnInit, ControlValueAccessor, OnDestroy {
    el: ElementRef;
    cd: ChangeDetectorRef;
    filterService: FilterService;
    config: PrimeNGConfig;
    /**
     * When specified, allows selecting multiple values.
     * @group Props
     */
    multiple: boolean | undefined;
    /**
     * Inline style of the container.
     * @group Props
     */
    style: {
        [klass: string]: any;
    } | null | undefined;
    /**
     * Style class of the container.
     * @group Props
     */
    styleClass: string | undefined;
    /**
     * Inline style of the list element.
     * @group Props
     */
    listStyle: {
        [klass: string]: any;
    } | null | undefined;
    /**
     * Style class of the list element.
     * @group Props
     */
    listStyleClass: string | undefined;
    /**
     * When present, it specifies that the element value cannot be changed.
     * @group Props
     */
    readonly: boolean | undefined;
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    disabled: boolean | undefined;
    /**
     * When specified, allows selecting items with checkboxes.
     * @group Props
     */
    checkbox: boolean;
    /**
     * When specified, displays a filter input at header.
     * @group Props
     */
    filter: boolean;
    /**
     * When filtering is enabled, filterBy decides which field or fields (comma separated) to search against.
     * @group Props
     */
    filterBy: string | undefined;
    /**
     * Defines how the items are filtered.
     * @group Props
     */
    filterMatchMode: 'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte';
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    filterLocale: string | undefined;
    /**
     * Defines how multiple items can be selected, when true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    metaKeySelection: boolean;
    /**
     * A property to uniquely identify a value in options.
     * @group Props
     */
    dataKey: string | undefined;
    /**
     * Whether header checkbox is shown in multiple mode.
     * @group Props
     */
    showToggleAll: boolean;
    /**
     * Name of the label field of an option.
     * @group Props
     */
    optionLabel: string | undefined;
    /**
     * Name of the value field of an option.
     * @group Props
     */
    optionValue: string | undefined;
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
     * Name of the disabled field of an option.
     * @group Props
     */
    optionDisabled: string | undefined;
    /**
     * Defines a string that labels the filter input.
     * @group Props
     */
    ariaFilterLabel: string | undefined;
    /**
     * Defines placeholder of the filter input.
     * @group Props
     */
    filterPlaceHolder: string | undefined;
    /**
     * Text to display when filtering does not return any results.
     * @group Props
     */
    emptyFilterMessage: string | undefined;
    /**
     * Text to display when there is no data. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    emptyMessage: string | undefined;
    /**
     * Whether to display options as grouped when nested options are provided.
     * @group Props
     */
    group: boolean | undefined;
    /**
     * An array of selectitems to display as the available options.
     * @group Props
     */
    get options(): any[];
    set options(val: any[]);
    /**
     * When specified, filter displays with this value.
     * @group Props
     */
    get filterValue(): string;
    set filterValue(val: string);
    /**
     * Callback to invoke on value change.
     * @param {ListboxChangeEvent} event - Custom change event.
     * @group Emits
     */
    onChange: EventEmitter<ListboxChangeEvent>;
    /**
     * Callback to invoke when option is clicked.
     * @param {ListboxClickEvent} event - Custom click event.
     * @group Emits
     */
    onClick: EventEmitter<ListboxClickEvent>;
    /**
     * Callback to invoke when option is double clicked.
     * @param {ListboxDoubleClickEvent} event - Custom double click event.
     * @group Emits
     */
    onDblClick: EventEmitter<ListboxDoubleClickEvent>;
    headerCheckboxViewChild: Nullable<ElementRef>;
    filterViewChild: Nullable<ElementRef>;
    headerFacet: Nullable<TemplateRef<any>>;
    footerFacet: Nullable<TemplateRef<any>>;
    templates: QueryList<PrimeTemplate>;
    _options: any[] | null | undefined;
    itemTemplate: TemplateRef<any> | undefined;
    groupTemplate: TemplateRef<any> | undefined;
    headerTemplate: TemplateRef<any> | undefined;
    filterTemplate: TemplateRef<any> | undefined;
    footerTemplate: TemplateRef<any> | undefined;
    emptyFilterTemplate: TemplateRef<any> | undefined;
    emptyTemplate: TemplateRef<any> | undefined;
    filterIconTemplate: TemplateRef<any> | undefined;
    checkIconTemplate: TemplateRef<any> | undefined;
    _filterValue: string | undefined | null;
    _filteredOptions: any[] | undefined | null;
    filterOptions: ListboxFilterOptions | undefined;
    filtered: boolean | undefined | null;
    value: any | undefined | null;
    onModelChange: Function;
    onModelTouched: Function;
    optionTouched: boolean | undefined | null;
    focus: boolean | undefined | null;
    headerCheckboxFocus: boolean | undefined | null;
    translationSubscription: Nullable<Subscription>;
    constructor(el: ElementRef, cd: ChangeDetectorRef, filterService: FilterService, config: PrimeNGConfig);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    getOptionLabel(option: any): any;
    getOptionGroupChildren(optionGroup: any): any;
    getOptionGroupLabel(optionGroup: any): any;
    getOptionValue(option: any): any;
    isOptionDisabled(option: any): any;
    writeValue(value: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    setDisabledState(val: boolean): void;
    onOptionClick(event: Event, option: any): void;
    onOptionTouchEnd(option: any): void;
    onOptionDoubleClick(event: Event, option: any): any;
    onOptionClickSingle(event: Event, option: any): void;
    onOptionClickMultiple(event: Event, option: any): void;
    onOptionClickCheckbox(event: Event, option: any): void;
    removeOption(option: any): void;
    isSelected(option: any): boolean;
    get allChecked(): boolean;
    get optionsToRender(): any[];
    get emptyMessageLabel(): string;
    get emptyFilterMessageLabel(): string;
    hasFilter(): boolean;
    isEmpty(): boolean;
    onFilter(event: KeyboardEvent): void;
    activateFilter(): void;
    resetFilter(): void;
    get toggleAllDisabled(): boolean;
    toggleAll(event: Event): void;
    checkAll(): void;
    uncheckAll(): void;
    onOptionKeyDown(event: KeyboardEvent, option: any): void;
    findNextItem(item: HTMLElement): HTMLElement | null;
    findPrevItem(item: HTMLElement): HTMLElement | null;
    onHeaderCheckboxFocus(): void;
    onHeaderCheckboxBlur(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Listbox, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Listbox, "p-listbox", never, { "multiple": { "alias": "multiple"; "required": false; }; "style": { "alias": "style"; "required": false; }; "styleClass": { "alias": "styleClass"; "required": false; }; "listStyle": { "alias": "listStyle"; "required": false; }; "listStyleClass": { "alias": "listStyleClass"; "required": false; }; "readonly": { "alias": "readonly"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "checkbox": { "alias": "checkbox"; "required": false; }; "filter": { "alias": "filter"; "required": false; }; "filterBy": { "alias": "filterBy"; "required": false; }; "filterMatchMode": { "alias": "filterMatchMode"; "required": false; }; "filterLocale": { "alias": "filterLocale"; "required": false; }; "metaKeySelection": { "alias": "metaKeySelection"; "required": false; }; "dataKey": { "alias": "dataKey"; "required": false; }; "showToggleAll": { "alias": "showToggleAll"; "required": false; }; "optionLabel": { "alias": "optionLabel"; "required": false; }; "optionValue": { "alias": "optionValue"; "required": false; }; "optionGroupChildren": { "alias": "optionGroupChildren"; "required": false; }; "optionGroupLabel": { "alias": "optionGroupLabel"; "required": false; }; "optionDisabled": { "alias": "optionDisabled"; "required": false; }; "ariaFilterLabel": { "alias": "ariaFilterLabel"; "required": false; }; "filterPlaceHolder": { "alias": "filterPlaceHolder"; "required": false; }; "emptyFilterMessage": { "alias": "emptyFilterMessage"; "required": false; }; "emptyMessage": { "alias": "emptyMessage"; "required": false; }; "group": { "alias": "group"; "required": false; }; "options": { "alias": "options"; "required": false; }; "filterValue": { "alias": "filterValue"; "required": false; }; }, { "onChange": "onChange"; "onClick": "onClick"; "onDblClick": "onDblClick"; }, ["headerFacet", "footerFacet", "templates"], ["p-header", "p-footer"], false, never>;
}
export declare class ListboxModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ListboxModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ListboxModule, [typeof Listbox], [typeof i1.CommonModule, typeof i2.SharedModule, typeof i3.RippleModule, typeof i4.SearchIcon, typeof i5.CheckIcon], [typeof Listbox, typeof i2.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ListboxModule>;
}
