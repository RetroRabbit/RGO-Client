import { ElementRef, EventEmitter, QueryList, TemplateRef } from '@angular/core';
import { MenuItem, PrimeTemplate } from 'primeng/api';
import { TieredMenu } from 'primeng/tieredmenu';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/button";
import * as i3 from "primeng/tieredmenu";
import * as i4 from "primeng/icons/chevrondown";
type SplitButtonIconPosition = 'left' | 'right';
/**
 * SplitButton groups a set of commands in an overlay with a default command.
 * @group Components
 */
export declare class SplitButton {
    /**
     * MenuModel instance to define the overlay items.
     * @group Props
     */
    model: MenuItem[] | undefined;
    /**
     * Name of the icon.
     * @group Props
     */
    icon: string | undefined;
    /**
     * Position of the icon.
     * @group Props
     */
    iconPos: SplitButtonIconPosition;
    /**
     * Text of the button.
     * @group Props
     */
    label: string | undefined;
    /**
     * Inline style of the element.
     * @group Props
     */
    style: {
        [klass: string]: any;
    } | null | undefined;
    /**
     * Class of the element.
     * @group Props
     */
    styleClass: string | undefined;
    /**
     * Inline style of the overlay menu.
     * @group Props
     */
    menuStyle: {
        [klass: string]: any;
    } | null | undefined;
    /**
     * Style class of the overlay menu.
     * @group Props
     */
    menuStyleClass: string | undefined;
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    disabled: boolean | undefined;
    /**
     * Index of the element in tabbing order.
     * @group Prop
     */
    tabindex: number | undefined;
    /**
     *  Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @group Props
     */
    appendTo: HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any;
    /**
     * Indicates the direction of the element.
     * @group Props
     */
    dir: string | undefined;
    /**
     * Defines a string that labels the expand button for accessibility.
     * @group Props
     */
    expandAriaLabel: string | undefined;
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
     * Callback to invoke when default command button is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    onClick: EventEmitter<MouseEvent>;
    /**
     * Callback to invoke when dropdown button is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    onDropdownClick: EventEmitter<MouseEvent>;
    containerViewChild: ElementRef | undefined;
    buttonViewChild: ElementRef | undefined;
    menu: TieredMenu | undefined;
    templates: QueryList<PrimeTemplate> | undefined;
    contentTemplate: TemplateRef<any> | undefined;
    dropdownIconTemplate: TemplateRef<any> | undefined;
    ariaId: string | undefined;
    isExpanded: import("@angular/core").WritableSignal<boolean>;
    ngOnInit(): void;
    ngAfterContentInit(): void;
    onDefaultButtonClick(event: MouseEvent): void;
    onDropdownButtonClick(event?: MouseEvent): void;
    onDropdownButtonKeydown(event: KeyboardEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SplitButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SplitButton, "p-splitButton", never, { "model": { "alias": "model"; "required": false; }; "icon": { "alias": "icon"; "required": false; }; "iconPos": { "alias": "iconPos"; "required": false; }; "label": { "alias": "label"; "required": false; }; "style": { "alias": "style"; "required": false; }; "styleClass": { "alias": "styleClass"; "required": false; }; "menuStyle": { "alias": "menuStyle"; "required": false; }; "menuStyleClass": { "alias": "menuStyleClass"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "tabindex": { "alias": "tabindex"; "required": false; }; "appendTo": { "alias": "appendTo"; "required": false; }; "dir": { "alias": "dir"; "required": false; }; "expandAriaLabel": { "alias": "expandAriaLabel"; "required": false; }; "showTransitionOptions": { "alias": "showTransitionOptions"; "required": false; }; "hideTransitionOptions": { "alias": "hideTransitionOptions"; "required": false; }; }, { "onClick": "onClick"; "onDropdownClick": "onDropdownClick"; }, ["templates"], never, false, never>;
}
export declare class SplitButtonModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<SplitButtonModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<SplitButtonModule, [typeof SplitButton], [typeof i1.CommonModule, typeof i2.ButtonModule, typeof i3.TieredMenuModule, typeof i4.ChevronDownIcon], [typeof SplitButton, typeof i2.ButtonModule, typeof i3.TieredMenuModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<SplitButtonModule>;
}
export {};
