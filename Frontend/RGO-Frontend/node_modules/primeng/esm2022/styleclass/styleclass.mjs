import { CommonModule } from '@angular/common';
import { Directive, HostListener, Input, NgModule } from '@angular/core';
import { DomHandler } from 'primeng/dom';
import * as i0 from "@angular/core";
/**
 * StyleClass manages css classes declaratively to during enter/leave animations or just to toggle classes on an element.
 * @group Components
 */
class StyleClass {
    el;
    renderer;
    zone;
    constructor(el, renderer, zone) {
        this.el = el;
        this.renderer = renderer;
        this.zone = zone;
    }
    /**
     * Selector to define the target element. Available selectors are '@next', '@prev', '@parent' and '@grandparent'.
     * @group Props
     */
    selector;
    /**
     * Style class to add when item begins to get displayed.
     * @group Props
     */
    enterClass;
    /**
     * Style class to add during enter animation.
     * @group Props
     */
    enterActiveClass;
    /**
     * Style class to add when item begins to get displayed.
     * @group Props
     */
    enterToClass;
    /**
     * Style class to add when item begins to get hidden.
     * @group Props
     */
    leaveClass;
    /**
     * Style class to add during leave animation.
     * @group Props
     */
    leaveActiveClass;
    /**
     * Style class to add when leave animation is completed.
     * @group Props
     */
    leaveToClass;
    /**
     * Whether to trigger leave animation when outside of the element is clicked.
     * @group Props
     */
    hideOnOutsideClick;
    /**
     * Adds or removes a class when no enter-leave animation is required.
     * @group Props
     */
    toggleClass;
    /**
     * Whether to trigger leave animation when escape key pressed.
     * @group Props
     */
    hideOnEscape;
    eventListener;
    documentClickListener;
    documentKeydownListener;
    target;
    enterListener;
    leaveListener;
    animating;
    clickListener() {
        this.target = this.resolveTarget();
        if (this.toggleClass) {
            this.toggle();
        }
        else {
            if (this.target.offsetParent === null)
                this.enter();
            else
                this.leave();
        }
    }
    toggle() {
        if (DomHandler.hasClass(this.target, this.toggleClass))
            DomHandler.removeClass(this.target, this.toggleClass);
        else
            DomHandler.addClass(this.target, this.toggleClass);
    }
    enter() {
        if (this.enterActiveClass) {
            if (!this.animating) {
                this.animating = true;
                if (this.enterActiveClass === 'slidedown') {
                    this.target.style.height = '0px';
                    DomHandler.removeClass(this.target, 'hidden');
                    this.target.style.maxHeight = this.target.scrollHeight + 'px';
                    DomHandler.addClass(this.target, 'hidden');
                    this.target.style.height = '';
                }
                DomHandler.addClass(this.target, this.enterActiveClass);
                if (this.enterClass) {
                    DomHandler.removeClass(this.target, this.enterClass);
                }
                this.enterListener = this.renderer.listen(this.target, 'animationend', () => {
                    DomHandler.removeClass(this.target, this.enterActiveClass);
                    if (this.enterToClass) {
                        DomHandler.addClass(this.target, this.enterToClass);
                    }
                    this.enterListener && this.enterListener();
                    if (this.enterActiveClass === 'slidedown') {
                        this.target.style.maxHeight = '';
                    }
                    this.animating = false;
                });
            }
        }
        else {
            if (this.enterClass) {
                DomHandler.removeClass(this.target, this.enterClass);
            }
            if (this.enterToClass) {
                DomHandler.addClass(this.target, this.enterToClass);
            }
        }
        if (this.hideOnOutsideClick) {
            this.bindDocumentClickListener();
        }
        if (this.hideOnEscape) {
            this.bindDocumentKeydownListener();
        }
    }
    leave() {
        if (this.leaveActiveClass) {
            if (!this.animating) {
                this.animating = true;
                DomHandler.addClass(this.target, this.leaveActiveClass);
                if (this.leaveClass) {
                    DomHandler.removeClass(this.target, this.leaveClass);
                }
                this.leaveListener = this.renderer.listen(this.target, 'animationend', () => {
                    DomHandler.removeClass(this.target, this.leaveActiveClass);
                    if (this.leaveToClass) {
                        DomHandler.addClass(this.target, this.leaveToClass);
                    }
                    this.leaveListener && this.leaveListener();
                    this.animating = false;
                });
            }
        }
        else {
            if (this.leaveClass) {
                DomHandler.removeClass(this.target, this.leaveClass);
            }
            if (this.leaveToClass) {
                DomHandler.addClass(this.target, this.leaveToClass);
            }
        }
        if (this.hideOnOutsideClick) {
            this.unbindDocumentClickListener();
        }
        if (this.hideOnEscape) {
            this.unbindDocumentKeydownListener();
        }
    }
    resolveTarget() {
        if (this.target) {
            return this.target;
        }
        switch (this.selector) {
            case '@next':
                return this.el.nativeElement.nextElementSibling;
            case '@prev':
                return this.el.nativeElement.previousElementSibling;
            case '@parent':
                return this.el.nativeElement.parentElement;
            case '@grandparent':
                return this.el.nativeElement.parentElement.parentElement;
            default:
                return document.querySelector(this.selector);
        }
    }
    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen(this.el.nativeElement.ownerDocument, 'click', (event) => {
                if (!this.isVisible() || getComputedStyle(this.target).getPropertyValue('position') === 'static')
                    this.unbindDocumentClickListener();
                else if (this.isOutsideClick(event))
                    this.leave();
            });
        }
    }
    bindDocumentKeydownListener() {
        if (!this.documentKeydownListener) {
            this.zone.runOutsideAngular(() => {
                this.documentKeydownListener = this.renderer.listen(this.el.nativeElement.ownerDocument, 'keydown', (event) => {
                    const { key, keyCode, which, type } = event;
                    if (!this.isVisible() || getComputedStyle(this.target).getPropertyValue('position') === 'static')
                        this.unbindDocumentKeydownListener();
                    if (this.isVisible() && key === 'Escape' && keyCode === 27 && which === 27)
                        this.leave();
                });
            });
        }
    }
    isVisible() {
        return this.target.offsetParent !== null;
    }
    isOutsideClick(event) {
        return !this.el.nativeElement.isSameNode(event.target) && !this.el.nativeElement.contains(event.target) && !this.target.contains(event.target);
    }
    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }
    unbindDocumentKeydownListener() {
        if (this.documentKeydownListener) {
            this.documentKeydownListener();
            this.documentKeydownListener = null;
        }
    }
    ngOnDestroy() {
        this.target = null;
        if (this.eventListener) {
            this.eventListener();
        }
        this.unbindDocumentClickListener();
        this.unbindDocumentKeydownListener();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: StyleClass, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.0", type: StyleClass, selector: "[pStyleClass]", inputs: { selector: ["pStyleClass", "selector"], enterClass: "enterClass", enterActiveClass: "enterActiveClass", enterToClass: "enterToClass", leaveClass: "leaveClass", leaveActiveClass: "leaveActiveClass", leaveToClass: "leaveToClass", hideOnOutsideClick: "hideOnOutsideClick", toggleClass: "toggleClass", hideOnEscape: "hideOnEscape" }, host: { listeners: { "click": "clickListener($event)" }, classAttribute: "p-element" }, ngImport: i0 });
}
export { StyleClass };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: StyleClass, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pStyleClass]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.NgZone }]; }, propDecorators: { selector: [{
                type: Input,
                args: ['pStyleClass']
            }], enterClass: [{
                type: Input
            }], enterActiveClass: [{
                type: Input
            }], enterToClass: [{
                type: Input
            }], leaveClass: [{
                type: Input
            }], leaveActiveClass: [{
                type: Input
            }], leaveToClass: [{
                type: Input
            }], hideOnOutsideClick: [{
                type: Input
            }], toggleClass: [{
                type: Input
            }], hideOnEscape: [{
                type: Input
            }], clickListener: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
class StyleClassModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: StyleClassModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.0", ngImport: i0, type: StyleClassModule, declarations: [StyleClass], imports: [CommonModule], exports: [StyleClass] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: StyleClassModule, imports: [CommonModule] });
}
export { StyleClassModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: StyleClassModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [StyleClass],
                    declarations: [StyleClass]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGVjbGFzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9zdHlsZWNsYXNzL3N0eWxlY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQWdDLE1BQU0sZUFBZSxDQUFDO0FBQ25ILE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7O0FBRXpDOzs7R0FHRztBQUNILE1BTWEsVUFBVTtJQUNBO0lBQXVCO0lBQTZCO0lBQXZFLFlBQW1CLEVBQWMsRUFBUyxRQUFtQixFQUFVLElBQVk7UUFBaEUsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFTLGFBQVEsR0FBUixRQUFRLENBQVc7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFRO0lBQUcsQ0FBQztJQUN2Rjs7O09BR0c7SUFDbUIsUUFBUSxDQUFxQjtJQUNuRDs7O09BR0c7SUFDTSxVQUFVLENBQXFCO0lBQ3hDOzs7T0FHRztJQUNNLGdCQUFnQixDQUFxQjtJQUM5Qzs7O09BR0c7SUFDTSxZQUFZLENBQXFCO0lBQzFDOzs7T0FHRztJQUNNLFVBQVUsQ0FBcUI7SUFDeEM7OztPQUdHO0lBQ00sZ0JBQWdCLENBQXFCO0lBQzlDOzs7T0FHRztJQUNNLFlBQVksQ0FBcUI7SUFDMUM7OztPQUdHO0lBQ00sa0JBQWtCLENBQXNCO0lBQ2pEOzs7T0FHRztJQUNNLFdBQVcsQ0FBcUI7SUFDekM7OztPQUdHO0lBQ00sWUFBWSxDQUFzQjtJQUUzQyxhQUFhLENBQWU7SUFFNUIscUJBQXFCLENBQWU7SUFFcEMsdUJBQXVCLENBQWU7SUFFdEMsTUFBTSxDQUFpQztJQUV2QyxhQUFhLENBQWU7SUFFNUIsYUFBYSxDQUFlO0lBRTVCLFNBQVMsQ0FBc0I7SUFHL0IsYUFBYTtRQUNULElB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SUFDekMsQ0FBQzt1R0FwUFEsVUFBVTsyRkFBVixVQUFVOztTQUFWLFVBQVU7MkZBQVYsVUFBVTtrQkFOdEIsU0FBUzttQkFBQztvQkFDUCxRQUFRLEVBQUUsZUFBZTtvQkFDekIsSUFBSSxFQUFFO3dCQUNGLEtBQUssRUFBRSxXQUFXO3FCQUNyQjtpQkFDSjs4SUFPeUIsUUFBUTtzQkFBN0IsS0FBSzt1QkFBQyxhQUFhO2dCQUtYLFVBQVU7c0JBQWxCLEtBQUs7Z0JBS0csZ0JBQWdCO3NCQUF4QixLQUFLO2dCQUtHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBS0csVUFBVTtzQkFBbEIsS0FBSztnQkFLRyxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBS0csWUFBWTtzQkFBcEIsS0FBSztnQkFLRyxrQkFBa0I7c0JBQTFCLEtBQUs7Z0JBS0csV0FBVztzQkFBbkIsS0FBSztnQkFLRyxZQUFZO3NCQUFwQixLQUFLO2dCQWlCTixhQUFhO3NCQURaLFlBQVk7dUJBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDOztBQW9MckMsTUFLYSxnQkFBZ0I7dUdBQWhCLGdCQUFnQjt3R0FBaEIsZ0JBQWdCLGlCQTVQaEIsVUFBVSxhQXdQVCxZQUFZLGFBeFBiLFVBQVU7d0dBNFBWLGdCQUFnQixZQUpmLFlBQVk7O1NBSWIsZ0JBQWdCOzJGQUFoQixnQkFBZ0I7a0JBTDVCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUM7b0JBQ3JCLFlBQVksRUFBRSxDQUFDLFVBQVUsQ0FBQztpQkFDN0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIElucHV0LCBOZ01vZHVsZSwgTmdab25lLCBPbkRlc3Ryb3ksIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRG9tSGFuZGxlciB9IGZyb20gJ3ByaW1lbmcvZG9tJztcbmltcG9ydCB7IFZvaWRMaXN0ZW5lciB9IGZyb20gJ3ByaW1lbmcvdHMtaGVscGVycyc7XG4vKipcbiAqIFN0eWxlQ2xhc3MgbWFuYWdlcyBjc3MgY2xhc3NlcyBkZWNsYXJhdGl2ZWx5IHRvIGR1cmluZyBlbnRlci9sZWF2ZSBhbmltYXRpb25zIG9yIGp1c3QgdG8gdG9nZ2xlIGNsYXNzZXMgb24gYW4gZWxlbWVudC5cbiAqIEBncm91cCBDb21wb25lbnRzXG4gKi9cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BTdHlsZUNsYXNzXScsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFN0eWxlQ2xhc3MgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgem9uZTogTmdab25lKSB7fVxuICAgIC8qKlxuICAgICAqIFNlbGVjdG9yIHRvIGRlZmluZSB0aGUgdGFyZ2V0IGVsZW1lbnQuIEF2YWlsYWJsZSBzZWxlY3RvcnMgYXJlICdAbmV4dCcsICdAcHJldicsICdAcGFyZW50JyBhbmQgJ0BncmFuZHBhcmVudCcuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCdwU3R5bGVDbGFzcycpIHNlbGVjdG9yOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogU3R5bGUgY2xhc3MgdG8gYWRkIHdoZW4gaXRlbSBiZWdpbnMgdG8gZ2V0IGRpc3BsYXllZC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBlbnRlckNsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogU3R5bGUgY2xhc3MgdG8gYWRkIGR1cmluZyBlbnRlciBhbmltYXRpb24uXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgZW50ZXJBY3RpdmVDbGFzczogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFN0eWxlIGNsYXNzIHRvIGFkZCB3aGVuIGl0ZW0gYmVnaW5zIHRvIGdldCBkaXNwbGF5ZWQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgZW50ZXJUb0NsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogU3R5bGUgY2xhc3MgdG8gYWRkIHdoZW4gaXRlbSBiZWdpbnMgdG8gZ2V0IGhpZGRlbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBsZWF2ZUNsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogU3R5bGUgY2xhc3MgdG8gYWRkIGR1cmluZyBsZWF2ZSBhbmltYXRpb24uXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgbGVhdmVBY3RpdmVDbGFzczogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFN0eWxlIGNsYXNzIHRvIGFkZCB3aGVuIGxlYXZlIGFuaW1hdGlvbiBpcyBjb21wbGV0ZWQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgbGVhdmVUb0NsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byB0cmlnZ2VyIGxlYXZlIGFuaW1hdGlvbiB3aGVuIG91dHNpZGUgb2YgdGhlIGVsZW1lbnQgaXMgY2xpY2tlZC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBoaWRlT25PdXRzaWRlQ2xpY2s6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogQWRkcyBvciByZW1vdmVzIGEgY2xhc3Mgd2hlbiBubyBlbnRlci1sZWF2ZSBhbmltYXRpb24gaXMgcmVxdWlyZWQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgdG9nZ2xlQ2xhc3M6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRvIHRyaWdnZXIgbGVhdmUgYW5pbWF0aW9uIHdoZW4gZXNjYXBlIGtleSBwcmVzc2VkLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGhpZGVPbkVzY2FwZTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAgIGV2ZW50TGlzdGVuZXI6IFZvaWRMaXN0ZW5lcjtcblxuICAgIGRvY3VtZW50Q2xpY2tMaXN0ZW5lcjogVm9pZExpc3RlbmVyO1xuXG4gICAgZG9jdW1lbnRLZXlkb3duTGlzdGVuZXI6IFZvaWRMaXN0ZW5lcjtcblxuICAgIHRhcmdldDogSFRNTEVsZW1lbnQgfCBudWxsIHwgdW5kZWZpbmVkO1xuXG4gICAgZW50ZXJMaXN0ZW5lcjogVm9pZExpc3RlbmVyO1xuXG4gICAgbGVhdmVMaXN0ZW5lcjogVm9pZExpc3RlbmVyO1xuXG4gICAgYW5pbWF0aW5nOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gICAgQEhvc3RMaXN0ZW5lcignY2xpY2snLCBbJyRldmVudCddKVxuICAgIGNsaWNrTGlzdGVuZXIoKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGhpcy5yZXNvbHZlVGFyZ2V0KCk7XG5cbiAgICAgICAgaWYgKHRoaXMudG9nZ2xlQ2xhc3MpIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoKHRoaXMudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5vZmZzZXRQYXJlbnQgPT09IG51bGwpIHRoaXMuZW50ZXIoKTtcbiAgICAgICAgICAgIGVsc2UgdGhpcy5sZWF2ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgICBpZiAoRG9tSGFuZGxlci5oYXNDbGFzcyh0aGlzLnRhcmdldCwgdGhpcy50b2dnbGVDbGFzcyBhcyBzdHJpbmcpKSBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKHRoaXMudGFyZ2V0LCB0aGlzLnRvZ2dsZUNsYXNzIGFzIHN0cmluZyk7XG4gICAgICAgIGVsc2UgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLnRhcmdldCwgdGhpcy50b2dnbGVDbGFzcyBhcyBzdHJpbmcpO1xuICAgIH1cblxuICAgIGVudGVyKCkge1xuICAgICAgICBpZiAodGhpcy5lbnRlckFjdGl2ZUNsYXNzKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZW50ZXJBY3RpdmVDbGFzcyA9PT0gJ3NsaWRlZG93bicpIHtcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5zdHlsZS5oZWlnaHQgPSAnMHB4JztcbiAgICAgICAgICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLnRhcmdldCwgJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICAodGhpcy50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLm1heEhlaWdodCA9ICh0aGlzLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLnRhcmdldCwgJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICAodGhpcy50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLmhlaWdodCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy50YXJnZXQsIHRoaXMuZW50ZXJBY3RpdmVDbGFzcyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZW50ZXJDbGFzcykge1xuICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKHRoaXMudGFyZ2V0LCB0aGlzLmVudGVyQ2xhc3MpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuZW50ZXJMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMudGFyZ2V0LCAnYW5pbWF0aW9uZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKHRoaXMudGFyZ2V0LCB0aGlzLmVudGVyQWN0aXZlQ2xhc3MgYXMgc3RyaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZW50ZXJUb0NsYXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMudGFyZ2V0LCB0aGlzLmVudGVyVG9DbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbnRlckxpc3RlbmVyICYmIHRoaXMuZW50ZXJMaXN0ZW5lcigpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmVudGVyQWN0aXZlQ2xhc3MgPT09ICdzbGlkZWRvd24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAodGhpcy50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLm1heEhlaWdodCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5lbnRlckNsYXNzKSB7XG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLnRhcmdldCwgdGhpcy5lbnRlckNsYXNzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuZW50ZXJUb0NsYXNzKSB7XG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLnRhcmdldCwgdGhpcy5lbnRlclRvQ2xhc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaGlkZU9uT3V0c2lkZUNsaWNrKSB7XG4gICAgICAgICAgICB0aGlzLmJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhpZGVPbkVzY2FwZSkge1xuICAgICAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnRLZXlkb3duTGlzdGVuZXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxlYXZlKCkge1xuICAgICAgICBpZiAodGhpcy5sZWF2ZUFjdGl2ZUNsYXNzKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy50YXJnZXQsIHRoaXMubGVhdmVBY3RpdmVDbGFzcyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGVhdmVDbGFzcykge1xuICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKHRoaXMudGFyZ2V0LCB0aGlzLmxlYXZlQ2xhc3MpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMubGVhdmVMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMudGFyZ2V0LCAnYW5pbWF0aW9uZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKHRoaXMudGFyZ2V0LCB0aGlzLmxlYXZlQWN0aXZlQ2xhc3MgYXMgc3RyaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubGVhdmVUb0NsYXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMudGFyZ2V0LCB0aGlzLmxlYXZlVG9DbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWF2ZUxpc3RlbmVyICYmIHRoaXMubGVhdmVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMubGVhdmVDbGFzcykge1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy50YXJnZXQsIHRoaXMubGVhdmVDbGFzcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxlYXZlVG9DbGFzcykge1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy50YXJnZXQsIHRoaXMubGVhdmVUb0NsYXNzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhpZGVPbk91dHNpZGVDbGljaykge1xuICAgICAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhpZGVPbkVzY2FwZSkge1xuICAgICAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudEtleWRvd25MaXN0ZW5lcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzb2x2ZVRhcmdldCgpIHtcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50YXJnZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHRoaXMuc2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGNhc2UgJ0BuZXh0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm5leHRFbGVtZW50U2libGluZztcblxuICAgICAgICAgICAgY2FzZSAnQHByZXYnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZztcblxuICAgICAgICAgICAgY2FzZSAnQHBhcmVudCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWwubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50O1xuXG4gICAgICAgICAgICBjYXNlICdAZ3JhbmRwYXJlbnQnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2VsZWN0b3IgYXMgc3RyaW5nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbC5uYXRpdmVFbGVtZW50Lm93bmVyRG9jdW1lbnQsICdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1Zpc2libGUoKSB8fCBnZXRDb21wdXRlZFN0eWxlKHRoaXMudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdwb3NpdGlvbicpID09PSAnc3RhdGljJykgdGhpcy51bmJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLmlzT3V0c2lkZUNsaWNrKGV2ZW50KSkgdGhpcy5sZWF2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRLZXlkb3duTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5kb2N1bWVudEtleWRvd25MaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRvY3VtZW50S2V5ZG93bkxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbC5uYXRpdmVFbGVtZW50Lm93bmVyRG9jdW1lbnQsICdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsga2V5LCBrZXlDb2RlLCB3aGljaCwgdHlwZSB9ID0gZXZlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1Zpc2libGUoKSB8fCBnZXRDb21wdXRlZFN0eWxlKHRoaXMudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdwb3NpdGlvbicpID09PSAnc3RhdGljJykgdGhpcy51bmJpbmREb2N1bWVudEtleWRvd25MaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1Zpc2libGUoKSAmJiBrZXkgPT09ICdFc2NhcGUnICYmIGtleUNvZGUgPT09IDI3ICYmIHdoaWNoID09PSAyNykgdGhpcy5sZWF2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc1Zpc2libGUoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLm9mZnNldFBhcmVudCAhPT0gbnVsbDtcbiAgICB9XG5cbiAgICBpc091dHNpZGVDbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuZWwubmF0aXZlRWxlbWVudC5pc1NhbWVOb2RlKGV2ZW50LnRhcmdldCkgJiYgIXRoaXMuZWwubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQpICYmICEodGhpcy50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNvbnRhaW5zKDxIVE1MRWxlbWVudD5ldmVudC50YXJnZXQpO1xuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kRG9jdW1lbnRLZXlkb3duTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50S2V5ZG93bkxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50S2V5ZG93bkxpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50S2V5ZG93bkxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLnRhcmdldCA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRLZXlkb3duTGlzdGVuZXIoKTtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW1N0eWxlQ2xhc3NdLFxuICAgIGRlY2xhcmF0aW9uczogW1N0eWxlQ2xhc3NdXG59KVxuZXhwb3J0IGNsYXNzIFN0eWxlQ2xhc3NNb2R1bGUge31cbiJdfQ==