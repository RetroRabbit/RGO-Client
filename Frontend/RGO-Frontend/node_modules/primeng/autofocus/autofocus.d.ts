import { ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * AutoFocus manages focus on focusable element on load.
 * @group Components
 */
export declare class AutoFocus {
    private host;
    constructor(host: ElementRef);
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus: boolean | undefined;
    focused: boolean;
    ngAfterContentChecked(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AutoFocus, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AutoFocus, "[pAutoFocus]", never, { "autofocus": { "alias": "autofocus"; "required": false; }; }, {}, never, never, false, never>;
}
export declare class AutoFocusModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<AutoFocusModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<AutoFocusModule, [typeof AutoFocus], [typeof i1.CommonModule], [typeof AutoFocus]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<AutoFocusModule>;
}
