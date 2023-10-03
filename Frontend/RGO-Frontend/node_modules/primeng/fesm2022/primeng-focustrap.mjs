import { DomHandler } from 'primeng/dom';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Directive, Input, HostListener, NgModule } from '@angular/core';

/**
 * Focus Trap keeps focus within a certain DOM element while tabbing.
 * @group Components
 */
class FocusTrap {
    el;
    /**
     * When set as true, focus wouldn't be managed.
     * @group Props
     */
    pFocusTrapDisabled = false;
    constructor(el) {
        this.el = el;
    }
    onkeydown(e) {
        if (this.pFocusTrapDisabled !== true) {
            e.preventDefault();
            const focusableElement = DomHandler.getNextFocusableElement(this.el.nativeElement, e.shiftKey);
            if (focusableElement) {
                focusableElement.focus();
                focusableElement.select?.();
            }
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: FocusTrap, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.0", type: FocusTrap, selector: "[pFocusTrap]", inputs: { pFocusTrapDisabled: "pFocusTrapDisabled" }, host: { listeners: { "keydown.tab": "onkeydown($event)", "keydown.shift.tab": "onkeydown($event)" }, classAttribute: "p-element" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: FocusTrap, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pFocusTrap]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { pFocusTrapDisabled: [{
                type: Input
            }], onkeydown: [{
                type: HostListener,
                args: ['keydown.tab', ['$event']]
            }, {
                type: HostListener,
                args: ['keydown.shift.tab', ['$event']]
            }] } });
class FocusTrapModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: FocusTrapModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.0", ngImport: i0, type: FocusTrapModule, declarations: [FocusTrap], imports: [CommonModule], exports: [FocusTrap] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: FocusTrapModule, imports: [CommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: FocusTrapModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [FocusTrap],
                    declarations: [FocusTrap]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { FocusTrap, FocusTrapModule };
//# sourceMappingURL=primeng-focustrap.mjs.map
