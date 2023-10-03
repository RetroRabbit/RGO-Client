import { NgModule, Directive, HostListener, Input, Output, EventEmitter, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
/**
 * InputTextarea adds styling and autoResize functionality to standard textarea element.
 * @group Components
 */
class InputTextarea {
    el;
    ngModel;
    control;
    cd;
    /**
     * When present, textarea size changes as being typed.
     * @group Props
     */
    autoResize;
    /**
     * Callback to invoke on textarea resize.
     * @param {(Event | {})} event - Custom resize event.
     * @group Emits
     */
    onResize = new EventEmitter();
    filled;
    cachedScrollHeight;
    ngModelSubscription;
    ngControlSubscription;
    constructor(el, ngModel, control, cd) {
        this.el = el;
        this.ngModel = ngModel;
        this.control = control;
        this.cd = cd;
    }
    ngOnInit() {
        if (this.ngModel) {
            this.ngModelSubscription = this.ngModel.valueChanges.subscribe(() => {
                this.updateState();
            });
        }
        if (this.control) {
            this.ngControlSubscription = this.control.valueChanges.subscribe(() => {
                this.updateState();
            });
        }
    }
    ngAfterViewInit() {
        if (this.autoResize)
            this.resize();
        this.updateFilledState();
        this.cd.detectChanges();
    }
    onInput(e) {
        this.updateState();
    }
    updateFilledState() {
        this.filled = this.el.nativeElement.value && this.el.nativeElement.value.length;
    }
    resize(event) {
        this.el.nativeElement.style.height = 'auto';
        this.el.nativeElement.style.height = this.el.nativeElement.scrollHeight + 'px';
        if (parseFloat(this.el.nativeElement.style.height) >= parseFloat(this.el.nativeElement.style.maxHeight)) {
            this.el.nativeElement.style.overflowY = 'scroll';
            this.el.nativeElement.style.height = this.el.nativeElement.style.maxHeight;
        }
        else {
            this.el.nativeElement.style.overflow = 'hidden';
        }
        this.onResize.emit(event || {});
    }
    updateState() {
        this.updateFilledState();
        if (this.autoResize) {
            this.resize();
        }
    }
    ngOnDestroy() {
        if (this.ngModelSubscription) {
            this.ngModelSubscription.unsubscribe();
        }
        if (this.ngControlSubscription) {
            this.ngControlSubscription.unsubscribe();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: InputTextarea, deps: [{ token: i0.ElementRef }, { token: i1.NgModel, optional: true }, { token: i1.NgControl, optional: true }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.0", type: InputTextarea, selector: "[pInputTextarea]", inputs: { autoResize: "autoResize" }, outputs: { onResize: "onResize" }, host: { listeners: { "input": "onInput($event)" }, properties: { "class.p-filled": "filled", "class.p-inputtextarea-resizable": "autoResize" }, classAttribute: "p-inputtextarea p-inputtext p-component p-element" }, ngImport: i0 });
}
export { InputTextarea };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: InputTextarea, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pInputTextarea]',
                    host: {
                        class: 'p-inputtextarea p-inputtext p-component p-element',
                        '[class.p-filled]': 'filled',
                        '[class.p-inputtextarea-resizable]': 'autoResize'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.NgModel, decorators: [{
                    type: Optional
                }] }, { type: i1.NgControl, decorators: [{
                    type: Optional
                }] }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { autoResize: [{
                type: Input
            }], onResize: [{
                type: Output
            }], onInput: [{
                type: HostListener,
                args: ['input', ['$event']]
            }] } });
class InputTextareaModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: InputTextareaModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.0", ngImport: i0, type: InputTextareaModule, declarations: [InputTextarea], imports: [CommonModule], exports: [InputTextarea] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: InputTextareaModule, imports: [CommonModule] });
}
export { InputTextareaModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: InputTextareaModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [InputTextarea],
                    declarations: [InputTextarea]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXR0ZXh0YXJlYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9pbnB1dHRleHRhcmVhL2lucHV0dGV4dGFyZWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBdUQsTUFBTSxlQUFlLENBQUM7QUFFMUssT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDOzs7QUFFL0M7OztHQUdHO0FBQ0gsTUFRYSxhQUFhO0lBcUJIO0lBQW1DO0lBQXFDO0lBQTRCO0lBcEJ2SDs7O09BR0c7SUFDTSxVQUFVLENBQXNCO0lBQ3pDOzs7O09BSUc7SUFDTyxRQUFRLEdBQTZCLElBQUksWUFBWSxFQUFjLENBQUM7SUFFOUUsTUFBTSxDQUFzQjtJQUU1QixrQkFBa0IsQ0FBcUI7SUFFdkMsbUJBQW1CLENBQTJCO0lBRTlDLHFCQUFxQixDQUEyQjtJQUVoRCxZQUFtQixFQUFjLEVBQXFCLE9BQWdCLEVBQXFCLE9BQWtCLEVBQVUsRUFBcUI7UUFBekgsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFxQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQXFCLFlBQU8sR0FBUCxPQUFPLENBQVc7UUFBVSxPQUFFLEdBQUYsRUFBRSxDQUFtQjtJQUFHLENBQUM7SUFFaEosUUFBUTtRQUNKLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLElBQUksQ0FBQyxtQkFBbUIsR0FBSSxJQUFJLENBQUMsT0FBZSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO2dCQUN6RSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdkIsQ0FBQyxDQUFDLENBQUM7U0FDTjtRQUVELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLElBQUksQ0FBQyxxQkFBcUIsR0FB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LGFBQWEsYUF1RlosWUFBWSxhQXZGYixhQUFhO3dHQTJGYixtQkFBbUIsWUFKbEIsWUFBWTs7U0FJYixtQkFBbUI7MkZBQW5CLG1CQUFtQjtrQkFML0IsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQztvQkFDeEIsWUFBWSxFQUFFLENBQUMsYUFBYSxDQUFDO2lCQUNoQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBPcHRpb25hbCwgQWZ0ZXJWaWV3SW5pdCwgT25Jbml0LCBPbkRlc3Ryb3ksIENoYW5nZURldGVjdG9yUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ01vZGVsLCBOZ0NvbnRyb2wsIEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuLyoqXG4gKiBJbnB1dFRleHRhcmVhIGFkZHMgc3R5bGluZyBhbmQgYXV0b1Jlc2l6ZSBmdW5jdGlvbmFsaXR5IHRvIHN0YW5kYXJkIHRleHRhcmVhIGVsZW1lbnQuXG4gKiBAZ3JvdXAgQ29tcG9uZW50c1xuICovXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twSW5wdXRUZXh0YXJlYV0nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWlucHV0dGV4dGFyZWEgcC1pbnB1dHRleHQgcC1jb21wb25lbnQgcC1lbGVtZW50JyxcbiAgICAgICAgJ1tjbGFzcy5wLWZpbGxlZF0nOiAnZmlsbGVkJyxcbiAgICAgICAgJ1tjbGFzcy5wLWlucHV0dGV4dGFyZWEtcmVzaXphYmxlXSc6ICdhdXRvUmVzaXplJ1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgSW5wdXRUZXh0YXJlYSBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgICAvKipcbiAgICAgKiBXaGVuIHByZXNlbnQsIHRleHRhcmVhIHNpemUgY2hhbmdlcyBhcyBiZWluZyB0eXBlZC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBhdXRvUmVzaXplOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIHRvIGludm9rZSBvbiB0ZXh0YXJlYSByZXNpemUuXG4gICAgICogQHBhcmFtIHsoRXZlbnQgfCB7fSl9IGV2ZW50IC0gQ3VzdG9tIHJlc2l6ZSBldmVudC5cbiAgICAgKiBAZ3JvdXAgRW1pdHNcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgb25SZXNpemU6IEV2ZW50RW1pdHRlcjxFdmVudCB8IHt9PiA9IG5ldyBFdmVudEVtaXR0ZXI8RXZlbnQgfCB7fT4oKTtcblxuICAgIGZpbGxlZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAgIGNhY2hlZFNjcm9sbEhlaWdodDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4gICAgbmdNb2RlbFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgdW5kZWZpbmVkO1xuXG4gICAgbmdDb250cm9sU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gfCB1bmRlZmluZWQ7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIEBPcHRpb25hbCgpIHB1YmxpYyBuZ01vZGVsOiBOZ01vZGVsLCBAT3B0aW9uYWwoKSBwdWJsaWMgY29udHJvbDogTmdDb250cm9sLCBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICBpZiAodGhpcy5uZ01vZGVsKSB7XG4gICAgICAgICAgICB0aGlzLm5nTW9kZWxTdWJzY3JpcHRpb24gPSAodGhpcy5uZ01vZGVsIGFzIGFueSkudmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jb250cm9sKSB7XG4gICAgICAgICAgICB0aGlzLm5nQ29udHJvbFN1YnNjcmlwdGlvbiA9ICh0aGlzLmNvbnRyb2wgYXMgYW55KS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuYXV0b1Jlc2l6ZSkgdGhpcy5yZXNpemUoKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUZpbGxlZFN0YXRlKCk7XG4gICAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2lucHV0JywgWyckZXZlbnQnXSlcbiAgICBvbklucHV0KGU6IEV2ZW50KSB7XG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVGaWxsZWRTdGF0ZSgpIHtcbiAgICAgICAgdGhpcy5maWxsZWQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQudmFsdWUgJiYgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnZhbHVlLmxlbmd0aDtcbiAgICB9XG5cbiAgICByZXNpemUoZXZlbnQ/OiBFdmVudCkge1xuICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xuICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnNjcm9sbEhlaWdodCArICdweCc7XG5cbiAgICAgICAgaWYgKHBhcnNlRmxvYXQodGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCkgPj0gcGFyc2VGbG9hdCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUubWF4SGVpZ2h0KSkge1xuICAgICAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9ICdzY3JvbGwnO1xuICAgICAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5tYXhIZWlnaHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub25SZXNpemUuZW1pdChldmVudCB8fCB7fSk7XG4gICAgfVxuXG4gICAgdXBkYXRlU3RhdGUoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlRmlsbGVkU3RhdGUoKTtcblxuICAgICAgICBpZiAodGhpcy5hdXRvUmVzaXplKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLm5nTW9kZWxTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMubmdNb2RlbFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubmdDb250cm9sU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLm5nQ29udHJvbFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtJbnB1dFRleHRhcmVhXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtJbnB1dFRleHRhcmVhXVxufSlcbmV4cG9ydCBjbGFzcyBJbnB1dFRleHRhcmVhTW9kdWxlIHt9XG4iXX0=