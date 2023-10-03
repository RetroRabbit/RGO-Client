import { ElementRef, AfterContentInit, AfterViewChecked, QueryList, TemplateRef, EventEmitter, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { PrimeTemplate, FilterService } from 'primeng/api';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Nullable, VoidListener } from 'primeng/ts-helpers';
import { PickListMoveAllToSourceEvent, PickListMoveAllToTargetEvent, PickListMoveToSourceEvent, PickListMoveToTargetEvent, PickListSourceFilterEvent, PickListSourceReorderEvent, PickListSourceSelectEvent, PickListTargetFilterEvent, PickListTargetReorderEvent, PickListTargetSelectEvent, PickListFilterOptions } from './picklist.interface';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/button";
import * as i3 from "primeng/api";
import * as i4 from "primeng/ripple";
import * as i5 from "@angular/cdk/drag-drop";
import * as i6 from "primeng/icons/angledoubledown";
import * as i7 from "primeng/icons/angledoubleleft";
import * as i8 from "primeng/icons/angledoubleright";
import * as i9 from "primeng/icons/angledoubleup";
import * as i10 from "primeng/icons/angledown";
import * as i11 from "primeng/icons/angleleft";
import * as i12 from "primeng/icons/angleright";
import * as i13 from "primeng/icons/angleup";
import * as i14 from "primeng/icons/search";
import * as i15 from "primeng/icons/home";
/**
 * PickList is used to reorder items between different lists.
 * @group Components
 */
export declare class PickList implements AfterViewChecked, AfterContentInit {
    private document;
    private platformId;
    private renderer;
    el: ElementRef;
    cd: ChangeDetectorRef;
    filterService: FilterService;
    /**
     * An array of objects for the source list.
     * @group Props
     */
    source: any[] | undefined;
    /**
     * An array of objects for the target list.
     * @group Props
     */
    target: any[] | undefined;
    /**
     * Text for the source list caption
     * @group Props
     */
    sourceHeader: string | undefined;
    /**
     * Defines a string that labels the move to right button for accessibility.
     * @group Props
     */
    rightButtonAriaLabel: string | undefined;
    /**
     * Defines a string that labels the move to left button for accessibility.
     * @group Props
     */
    leftButtonAriaLabel: string | undefined;
    /**
     * Defines a string that labels the move to all right button for accessibility.
     * @group Props
     */
    allRightButtonAriaLabel: string | undefined;
    /**
     * Defines a string that labels the move to all left button for accessibility.
     * @group Props
     */
    allLeftButtonAriaLabel: string | undefined;
    /**
     * Defines a string that labels the move to up button for accessibility.
     * @group Props
     */
    upButtonAriaLabel: string | undefined;
    /**
     * Defines a string that labels the move to down button for accessibility.
     * @group Props
     */
    downButtonAriaLabel: string | undefined;
    /**
     * Defines a string that labels the move to top button for accessibility.
     * @group Props
     */
    topButtonAriaLabel: string | undefined;
    /**
     * Defines a string that labels the move to bottom button for accessibility.
     * @group Props
     */
    bottomButtonAriaLabel: string | undefined;
    /**
     * Text for the target list caption
     * @group Props
     */
    targetHeader: string | undefined;
    /**
     * When enabled orderlist adjusts its controls based on screen size.
     * @group Props
     */
    responsive: boolean | undefined;
    /**
     * When specified displays an input field to filter the items on keyup and decides which field to search (Accepts multiple fields with a comma).
     * @group Props
     */
    filterBy: string | undefined;
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    filterLocale: string | undefined;
    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity. Use sourceTrackBy or targetTrackBy in case different algorithms are needed per list.
     * @group Props
     */
    trackBy: Function;
    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy in source list, default algorithm checks for object identity.
     * @group Props
     */
    sourceTrackBy: Function | undefined;
    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy in target list, default algorithm checks for object identity.
     * @group Props
     */
    targetTrackBy: Function | undefined;
    /**
     * Whether to show filter input for source list when filterBy is enabled.
     * @group Props
     */
    showSourceFilter: boolean;
    /**
     * Whether to show filter input for target list when filterBy is enabled.
     * @group Props
     */
    showTargetFilter: boolean;
    /**
     * Defines how multiple items can be selected, when true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    metaKeySelection: boolean;
    /**
     * Whether to enable dragdrop based reordering.
     * @group Props
     */
    dragdrop: boolean;
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
     * Inline style of the source list element.
     * @group Props
     */
    sourceStyle: any;
    /**
     * Inline style of the target list element.
     * @group Props
     */
    targetStyle: any;
    /**
     * Whether to show buttons of source list.
     * @group Props
     */
    showSourceControls: boolean;
    /**
     * Whether to show buttons of target list.
     * @group Props
     */
    showTargetControls: boolean;
    /**
     * Placeholder text on source filter input.
     * @group Props
     */
    sourceFilterPlaceholder: string | undefined;
    /**
     * Placeholder text on target filter input.
     * @group Props
     */
    targetFilterPlaceholder: string | undefined;
    /**
     * When present, it specifies that the component should be disabled.
     * @group Props
     */
    disabled: boolean;
    /**
     * Defines a string that labels the filter input of source list.
     * @group Props
     */
    ariaSourceFilterLabel: string | undefined;
    /**
     * Defines a string that labels the filter input of target list.
     * @group Props
     */
    ariaTargetFilterLabel: string | undefined;
    /**
     * Defines how the items are filtered.
     * @group Props
     */
    filterMatchMode: 'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte';
    /**
     * Whether to displays rows with alternating colors.
     * @group Props
     */
    stripedRows: boolean | undefined;
    /**
     * Keeps selection on the transfer list.
     * @group Props
     */
    keepSelection: boolean;
    /**
     * Indicates the width of the screen at which the component should change its behavior.
     * @group Props
     */
    get breakpoint(): string;
    set breakpoint(value: string);
    /**
     * Callback to invoke when items are moved from target to source.
     * @param {PickListMoveToSourceEvent} event - Custom move to source event.
     * @group Emits
     */
    onMoveToSource: EventEmitter<PickListMoveToSourceEvent>;
    /**
     * Callback to invoke when all items are moved from target to source.
     * @param {PickListMoveAllToSourceEvent} event - Custom move all to source event.
     * @group Emits
     */
    onMoveAllToSource: EventEmitter<PickListMoveAllToSourceEvent>;
    /**
     * Callback to invoke when all items are moved from source to target.
     * @param {PickListMoveAllToTargetEvent} event - Custom move all to target event.
     * @group Emits
     */
    onMoveAllToTarget: EventEmitter<PickListMoveAllToTargetEvent>;
    /**
     * Callback to invoke when items are moved from source to target.
     * @param {PickListMoveToTargetEvent} event - Custom move to target event.
     * @group Emits
     */
    onMoveToTarget: EventEmitter<PickListMoveToTargetEvent>;
    /**
     * Callback to invoke when items are reordered within source list.
     * @param {PickListSourceReorderEvent} event - Custom source reorder event.
     * @group Emits
     */
    onSourceReorder: EventEmitter<PickListSourceReorderEvent>;
    /**
     * Callback to invoke when items are reordered within target list.
     * @param {PickListTargetReorderEvent} event - Custom target reorder event.
     * @group Emits
     */
    onTargetReorder: EventEmitter<PickListTargetReorderEvent>;
    /**
     * Callback to invoke when items are selected within source list.
     * @param {PickListSourceSelectEvent} event - Custom source select event.
     * @group Emits
     */
    onSourceSelect: EventEmitter<PickListSourceSelectEvent>;
    /**
     * Callback to invoke when items are selected within target list.
     * @param {PickListTargetSelectEvent} event - Custom target select event.
     * @group Emits
     */
    onTargetSelect: EventEmitter<PickListTargetSelectEvent>;
    /**
     * Callback to invoke when the source list is filtered
     * @param {PickListSourceFilterEvent} event - Custom source filter event.
     * @group Emits
     */
    onSourceFilter: EventEmitter<PickListSourceFilterEvent>;
    /**
     * Callback to invoke when the target list is filtered
     * @param {PickListTargetFilterEvent} event - Custom target filter event.
     * @group Emits
     */
    onTargetFilter: EventEmitter<PickListTargetFilterEvent>;
    listViewSourceChild: Nullable<ElementRef>;
    listViewTargetChild: Nullable<ElementRef>;
    sourceFilterViewChild: Nullable<ElementRef>;
    targetFilterViewChild: Nullable<ElementRef>;
    templates: Nullable<QueryList<PrimeTemplate>>;
    _breakpoint: string;
    itemTemplate: TemplateRef<any> | undefined;
    moveTopIconTemplate: Nullable<TemplateRef<any>>;
    moveUpIconTemplate: Nullable<TemplateRef<any>>;
    moveDownIconTemplate: Nullable<TemplateRef<any>>;
    moveBottomIconTemplate: Nullable<TemplateRef<any>>;
    moveToTargetIconTemplate: Nullable<TemplateRef<any>>;
    moveAllToTargetIconTemplate: Nullable<TemplateRef<any>>;
    moveToSourceIconTemplate: Nullable<TemplateRef<any>>;
    moveAllToSourceIconTemplate: Nullable<TemplateRef<any>>;
    targetFilterIconTemplate: Nullable<TemplateRef<any>>;
    sourceFilterIconTemplate: Nullable<TemplateRef<any>>;
    visibleOptionsSource: any[] | undefined | null;
    visibleOptionsTarget: any[] | undefined | null;
    selectedItemsSource: any[];
    selectedItemsTarget: any[];
    reorderedListElement: any;
    movedUp: Nullable<boolean>;
    movedDown: Nullable<boolean>;
    itemTouched: Nullable<boolean>;
    styleElement: any;
    id: string;
    filterValueSource: Nullable<string>;
    filterValueTarget: Nullable<string>;
    fromListType: Nullable<number>;
    emptyMessageSourceTemplate: Nullable<TemplateRef<any>>;
    emptyFilterMessageSourceTemplate: Nullable<TemplateRef<any>>;
    emptyMessageTargetTemplate: Nullable<TemplateRef<any>>;
    emptyFilterMessageTargetTemplate: Nullable<TemplateRef<any>>;
    sourceHeaderTemplate: Nullable<TemplateRef<any>>;
    targetHeaderTemplate: Nullable<TemplateRef<any>>;
    sourceFilterTemplate: Nullable<TemplateRef<any>>;
    targetFilterTemplate: Nullable<TemplateRef<any>>;
    sourceFilterOptions: Nullable<PickListFilterOptions>;
    targetFilterOptions: Nullable<PickListFilterOptions>;
    readonly SOURCE_LIST: number;
    readonly TARGET_LIST: number;
    window: Window;
    media: MediaQueryList | null | undefined;
    viewChanged: boolean | undefined;
    mediaChangeListener: VoidListener;
    constructor(document: Document, platformId: any, renderer: Renderer2, el: ElementRef, cd: ChangeDetectorRef, filterService: FilterService);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngAfterViewChecked(): void;
    onItemClick(event: Event | any, item: any, selectedItems: any[], callback: EventEmitter<any>): void;
    onSourceItemDblClick(): void;
    onTargetItemDblClick(): void;
    onFilter(event: KeyboardEvent, listType: number): void;
    filterSource(value?: any): void;
    filterTarget(value?: any): void;
    filter(data: any[], listType: number): void;
    isItemVisible(item: any, listType: number): boolean | undefined;
    isEmpty(listType: number): boolean;
    isVisibleInList(data: any[], item: any, filterValue: string): boolean | undefined;
    onItemTouchEnd(): void;
    private sortByIndexInList;
    moveUp(listElement: HTMLElement, list: any[], selectedItems: any[], callback: EventEmitter<any>, listType: number): void;
    moveTop(listElement: HTMLElement, list: any[], selectedItems: any[], callback: EventEmitter<any>, listType: number): void;
    moveDown(listElement: HTMLElement, list: any[], selectedItems: any[], callback: EventEmitter<any>, listType: number): void;
    moveBottom(listElement: HTMLElement, list: any[], selectedItems: any[], callback: EventEmitter<any>, listType: number): void;
    moveRight(): void;
    moveAllRight(): void;
    moveLeft(): void;
    moveAllLeft(): void;
    isSelected(item: any, selectedItems: any[]): boolean;
    findIndexInSelection(item: any, selectedItems: any[]): number;
    onDrop(event: CdkDragDrop<string[]>, listType: number): void;
    getDropIndexes(fromIndex: number, toIndex: number, droppedList: number, isTransfer: boolean, data: any[] | any): {
        previousIndex: any;
        currentIndex: any;
    };
    findFilteredCurrentIndex(visibleOptions: any[], index: number, options: any): number;
    resetSourceFilter(): void;
    resetTargetFilter(): void;
    resetFilter(): void;
    onItemKeydown(event: KeyboardEvent, item: any, selectedItems: any[], callback: EventEmitter<any>): void;
    findNextItem(item: any): HTMLElement | null;
    findPrevItem(item: any): HTMLElement | null;
    initMedia(): void;
    destroyMedia(): void;
    bindMediaChangeListener(): void;
    unbindMediaChangeListener(): void;
    createStyle(): void;
    sourceMoveDisabled(): boolean;
    targetMoveDisabled(): boolean;
    moveRightDisabled(): boolean;
    moveLeftDisabled(): boolean;
    moveAllRightDisabled(): boolean;
    moveAllLeftDisabled(): boolean;
    destroyStyle(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PickList, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PickList, "p-pickList", never, { "source": { "alias": "source"; "required": false; }; "target": { "alias": "target"; "required": false; }; "sourceHeader": { "alias": "sourceHeader"; "required": false; }; "rightButtonAriaLabel": { "alias": "rightButtonAriaLabel"; "required": false; }; "leftButtonAriaLabel": { "alias": "leftButtonAriaLabel"; "required": false; }; "allRightButtonAriaLabel": { "alias": "allRightButtonAriaLabel"; "required": false; }; "allLeftButtonAriaLabel": { "alias": "allLeftButtonAriaLabel"; "required": false; }; "upButtonAriaLabel": { "alias": "upButtonAriaLabel"; "required": false; }; "downButtonAriaLabel": { "alias": "downButtonAriaLabel"; "required": false; }; "topButtonAriaLabel": { "alias": "topButtonAriaLabel"; "required": false; }; "bottomButtonAriaLabel": { "alias": "bottomButtonAriaLabel"; "required": false; }; "targetHeader": { "alias": "targetHeader"; "required": false; }; "responsive": { "alias": "responsive"; "required": false; }; "filterBy": { "alias": "filterBy"; "required": false; }; "filterLocale": { "alias": "filterLocale"; "required": false; }; "trackBy": { "alias": "trackBy"; "required": false; }; "sourceTrackBy": { "alias": "sourceTrackBy"; "required": false; }; "targetTrackBy": { "alias": "targetTrackBy"; "required": false; }; "showSourceFilter": { "alias": "showSourceFilter"; "required": false; }; "showTargetFilter": { "alias": "showTargetFilter"; "required": false; }; "metaKeySelection": { "alias": "metaKeySelection"; "required": false; }; "dragdrop": { "alias": "dragdrop"; "required": false; }; "style": { "alias": "style"; "required": false; }; "styleClass": { "alias": "styleClass"; "required": false; }; "sourceStyle": { "alias": "sourceStyle"; "required": false; }; "targetStyle": { "alias": "targetStyle"; "required": false; }; "showSourceControls": { "alias": "showSourceControls"; "required": false; }; "showTargetControls": { "alias": "showTargetControls"; "required": false; }; "sourceFilterPlaceholder": { "alias": "sourceFilterPlaceholder"; "required": false; }; "targetFilterPlaceholder": { "alias": "targetFilterPlaceholder"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "ariaSourceFilterLabel": { "alias": "ariaSourceFilterLabel"; "required": false; }; "ariaTargetFilterLabel": { "alias": "ariaTargetFilterLabel"; "required": false; }; "filterMatchMode": { "alias": "filterMatchMode"; "required": false; }; "stripedRows": { "alias": "stripedRows"; "required": false; }; "keepSelection": { "alias": "keepSelection"; "required": false; }; "breakpoint": { "alias": "breakpoint"; "required": false; }; }, { "onMoveToSource": "onMoveToSource"; "onMoveAllToSource": "onMoveAllToSource"; "onMoveAllToTarget": "onMoveAllToTarget"; "onMoveToTarget": "onMoveToTarget"; "onSourceReorder": "onSourceReorder"; "onTargetReorder": "onTargetReorder"; "onSourceSelect": "onSourceSelect"; "onTargetSelect": "onTargetSelect"; "onSourceFilter": "onSourceFilter"; "onTargetFilter": "onTargetFilter"; }, ["templates"], never, false, never>;
}
export declare class PickListModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<PickListModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<PickListModule, [typeof PickList], [typeof i1.CommonModule, typeof i2.ButtonModule, typeof i3.SharedModule, typeof i4.RippleModule, typeof i5.DragDropModule, typeof i6.AngleDoubleDownIcon, typeof i7.AngleDoubleLeftIcon, typeof i8.AngleDoubleRightIcon, typeof i9.AngleDoubleUpIcon, typeof i10.AngleDownIcon, typeof i11.AngleLeftIcon, typeof i12.AngleRightIcon, typeof i13.AngleUpIcon, typeof i14.SearchIcon, typeof i15.HomeIcon], [typeof PickList, typeof i3.SharedModule, typeof i5.DragDropModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<PickListModule>;
}
