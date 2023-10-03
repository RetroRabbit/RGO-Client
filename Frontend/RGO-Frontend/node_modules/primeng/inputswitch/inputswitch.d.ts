import { EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { InputSwitchOnChangeEvent } from './inputswitch.interface';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export declare const INPUTSWITCH_VALUE_ACCESSOR: any;
/**
 * InputSwitch is used to select a boolean value.
 * @group Components
 */
export declare class InputSwitch implements ControlValueAccessor {
    private cd;
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
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex: number | undefined;
    /**
     * Identifier of the input element.
     * @group Props
     */
    inputId: string | undefined;
    /**
     * Name of the input element.
     * @group Props
     */
    name: string | undefined;
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    disabled: boolean | undefined;
    /**
     * When present, it specifies that the component cannot be edited.
     * @group Props
     */
    readonly: boolean | undefined;
    /**
     * Value in checked state.
     * @group Props
     */
    trueValue: any;
    /**
     * Value in unchecked state.
     * @group Props
     */
    falseValue: any;
    /**
     * Used to define a string that autocomplete attribute the current element.
     * @group Props
     */
    ariaLabel: string | undefined;
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy: string | undefined;
    /**
     * Callback to invoke when the on value change.
     * @param {InputSwitchOnChangeEvent} event - Custom change event.
     * @group Emits
     */
    onChange: EventEmitter<InputSwitchOnChangeEvent>;
    modelValue: any;
    focused: boolean;
    onModelChange: Function;
    onModelTouched: Function;
    constructor(cd: ChangeDetectorRef);
    onClick(event: Event, cb: HTMLInputElement): void;
    onInputChange(event: Event): void;
    toggle(event: Event): void;
    updateModel(event: Event, value: boolean): void;
    onFocus(event: Event): void;
    onBlur(event: Event): void;
    writeValue(value: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    setDisabledState(val: boolean): void;
    checked(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<InputSwitch, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InputSwitch, "p-inputSwitch", never, { "style": { "alias": "style"; "required": false; }; "styleClass": { "alias": "styleClass"; "required": false; }; "tabindex": { "alias": "tabindex"; "required": false; }; "inputId": { "alias": "inputId"; "required": false; }; "name": { "alias": "name"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "readonly": { "alias": "readonly"; "required": false; }; "trueValue": { "alias": "trueValue"; "required": false; }; "falseValue": { "alias": "falseValue"; "required": false; }; "ariaLabel": { "alias": "ariaLabel"; "required": false; }; "ariaLabelledBy": { "alias": "ariaLabelledBy"; "required": false; }; }, { "onChange": "onChange"; }, never, never, false, never>;
}
export declare class InputSwitchModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<InputSwitchModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<InputSwitchModule, [typeof InputSwitch], [typeof i1.CommonModule], [typeof InputSwitch]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<InputSwitchModule>;
}
