import { DomHandler } from 'primeng/dom';
import { CommonModule } from '@angular/common';
import { Directive, HostListener, Input, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
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
export { FocusTrap };
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
export { FocusTrapModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: FocusTrapModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [FocusTrap],
                    declarations: [FocusTrap]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9jdXN0cmFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2ZvY3VzdHJhcC9mb2N1c3RyYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUV6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFNBQVMsRUFBYyxZQUFZLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFDckY7OztHQUdHO0FBQ0gsTUFNYSxTQUFTO0lBT0M7SUFObkI7OztPQUdHO0lBQ00sa0JBQWtCLEdBQVksS0FBSyxDQUFDO0lBRTdDLFlBQW1CLEVBQWM7UUFBZCxPQUFFLEdBQUYsRUFBRSxDQUFZO0lBQUcsQ0FBQztJQUlyQyxTQUFTLENBQUMsQ0FBZ0I7UUFDdEIsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEtBQUssSUFBSSxFQUFFO1lBQ2xDLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNuQixNQUFNLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFL0YsSUFBSSxnQkFBZ0IsRUFBRTtnQkFDbEIsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ3pCLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7YUFDL0I7U0FDSjtJQUNMLENBQUM7dUdBckJRLFNBQVM7MkZBQVQsU0FBUzs7U0FBVCxTQUFTOzJGQUFULFNBQVM7a0JBTnJCLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLElBQUksRUFBRTt3QkFDRixLQUFLLEVBQUUsV0FBVztxQkFDckI7aUJBQ0o7aUdBTVksa0JBQWtCO3NCQUExQixLQUFLO2dCQU1OLFNBQVM7c0JBRlIsWUFBWTt1QkFBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRLENBQUM7O3NCQUN0QyxZQUFZO3VCQUFDLG1CQUFtQixFQUFFLENBQUMsUUFBUSxDQUFDOztBQWNqRCxNQUthLGVBQWU7dUdBQWYsZUFBZTt3R0FBZixlQUFlLGlCQTdCZixTQUFTLGFBeUJSLFlBQVksYUF6QmIsU0FBUzt3R0E2QlQsZUFBZSxZQUpkLFlBQVk7O1NBSWIsZUFBZTsyRkFBZixlQUFlO2tCQUwzQixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDO29CQUNwQixZQUFZLEVBQUUsQ0FBQyxTQUFTLENBQUM7aUJBQzVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRG9tSGFuZGxlciB9IGZyb20gJ3ByaW1lbmcvZG9tJztcblxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBJbnB1dCwgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbi8qKlxuICogRm9jdXMgVHJhcCBrZWVwcyBmb2N1cyB3aXRoaW4gYSBjZXJ0YWluIERPTSBlbGVtZW50IHdoaWxlIHRhYmJpbmcuXG4gKiBAZ3JvdXAgQ29tcG9uZW50c1xuICovXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twRm9jdXNUcmFwXScsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIEZvY3VzVHJhcCB7XG4gICAgLyoqXG4gICAgICogV2hlbiBzZXQgYXMgdHJ1ZSwgZm9jdXMgd291bGRuJ3QgYmUgbWFuYWdlZC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwRm9jdXNUcmFwRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZikge31cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24udGFiJywgWyckZXZlbnQnXSlcbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLnNoaWZ0LnRhYicsIFsnJGV2ZW50J10pXG4gICAgb25rZXlkb3duKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMucEZvY3VzVHJhcERpc2FibGVkICE9PSB0cnVlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50ID0gRG9tSGFuZGxlci5nZXROZXh0Rm9jdXNhYmxlRWxlbWVudCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIGUuc2hpZnRLZXkpO1xuXG4gICAgICAgICAgICBpZiAoZm9jdXNhYmxlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGZvY3VzYWJsZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICBmb2N1c2FibGVFbGVtZW50LnNlbGVjdD8uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW0ZvY3VzVHJhcF0sXG4gICAgZGVjbGFyYXRpb25zOiBbRm9jdXNUcmFwXVxufSlcbmV4cG9ydCBjbGFzcyBGb2N1c1RyYXBNb2R1bGUge31cbiJdfQ==