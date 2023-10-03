import { ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * Focus Trap keeps focus within a certain DOM element while tabbing.
 * @group Components
 */
export declare class FocusTrap {
    el: ElementRef;
    /**
     * When set as true, focus wouldn't be managed.
     * @group Props
     */
    pFocusTrapDisabled: boolean;
    constructor(el: ElementRef);
    onkeydown(e: KeyboardEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FocusTrap, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<FocusTrap, "[pFocusTrap]", never, { "pFocusTrapDisabled": { "alias": "pFocusTrapDisabled"; "required": false; }; }, {}, never, never, false, never>;
}
export declare class FocusTrapModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<FocusTrapModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<FocusTrapModule, [typeof FocusTrap], [typeof i1.CommonModule], [typeof FocusTrap]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<FocusTrapModule>;
}
