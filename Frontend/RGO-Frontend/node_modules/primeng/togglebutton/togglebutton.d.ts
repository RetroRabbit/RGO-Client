import { ChangeDetectorRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { ToggleButtonChangeEvent } from './togglebutton.interface';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/ripple";
export declare const TOGGLEBUTTON_VALUE_ACCESSOR: any;
/**
 * ToggleButton is used to select a boolean value using a button.
 * @group Components
 */
export declare class ToggleButton implements ControlValueAccessor {
    cd: ChangeDetectorRef;
    /**
     * Label for the on state.
     * @group Props
     */
    onLabel: string | undefined;
    /**
     * Label for the off state.
     * @group Props
     */
    offLabel: string | undefined;
    /**
     * Icon for the on state.
     * @group Props
     */
    onIcon: string | undefined;
    /**
     * Icon for the off state.
     * @group Props
     */
    offIcon: string | undefined;
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy: string | undefined;
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    disabled: boolean | undefined;
    /**
     * Inline style of the element.
     * @group Props
     */
    style: any;
    /**
     * Style class of the element.
     * @group Props
     */
    styleClass: string | undefined;
    /**
     * Identifier of the focus input to match a label defined for the component.
     * @group Props
     */
    inputId: string | undefined;
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex: number | undefined;
    /**
     * Position of the icon.
     * @group Props
     */
    iconPos: 'left' | 'right';
    /**
     * Callback to invoke on value change.
     * @param {ToggleButtonChangeEvent} event - Custom change event.
     * @group Emits
     */
    onChange: EventEmitter<ToggleButtonChangeEvent>;
    checked: boolean;
    onModelChange: Function;
    onModelTouched: Function;
    constructor(cd: ChangeDetectorRef);
    toggle(event: Event): void;
    onBlur(): void;
    writeValue(value: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    setDisabledState(val: boolean): void;
    get hasOnLabel(): boolean;
    get hasOffLabel(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ToggleButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ToggleButton, "p-toggleButton", never, { "onLabel": { "alias": "onLabel"; "required": false; }; "offLabel": { "alias": "offLabel"; "required": false; }; "onIcon": { "alias": "onIcon"; "required": false; }; "offIcon": { "alias": "offIcon"; "required": false; }; "ariaLabelledBy": { "alias": "ariaLabelledBy"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "style": { "alias": "style"; "required": false; }; "styleClass": { "alias": "styleClass"; "required": false; }; "inputId": { "alias": "inputId"; "required": false; }; "tabindex": { "alias": "tabindex"; "required": false; }; "iconPos": { "alias": "iconPos"; "required": false; }; }, { "onChange": "onChange"; }, never, never, false, never>;
}
export declare class ToggleButtonModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ToggleButtonModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ToggleButtonModule, [typeof ToggleButton], [typeof i1.CommonModule, typeof i2.RippleModule], [typeof ToggleButton]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ToggleButtonModule>;
}
