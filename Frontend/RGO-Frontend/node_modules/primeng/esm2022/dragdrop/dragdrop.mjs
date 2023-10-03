import { CommonModule } from '@angular/common';
import { Directive, EventEmitter, HostListener, Input, NgModule, Output } from '@angular/core';
import { DomHandler } from 'primeng/dom';
import * as i0 from "@angular/core";
/**
 * pDraggable directive apply draggable behavior to any element.
 * @group Components
 */
class Draggable {
    el;
    zone;
    renderer;
    scope;
    /**
     * Defines the cursor style.
     * @group Props
     */
    dragEffect;
    /**
     * Selector to define the drag handle, by default anywhere on the target element is a drag handle to start dragging.
     * @group Props
     */
    dragHandle;
    /**
     * Callback to invoke when drag begins.
     * @param {DragEvent} event - Drag event.
     * @group Emits
     */
    onDragStart = new EventEmitter();
    /**
     * Callback to invoke when drag ends.
     * @param {DragEvent} event - Drag event.
     * @group Emits
     */
    onDragEnd = new EventEmitter();
    /**
     * Callback to invoke on dragging.
     * @param {DragEvent} event - Drag event.
     * @group Emits
     */
    onDrag = new EventEmitter();
    handle;
    dragListener;
    mouseDownListener;
    mouseUpListener;
    _pDraggableDisabled = false;
    constructor(el, zone, renderer) {
        this.el = el;
        this.zone = zone;
        this.renderer = renderer;
    }
    get pDraggableDisabled() {
        return this._pDraggableDisabled;
    }
    set pDraggableDisabled(_pDraggableDisabled) {
        this._pDraggableDisabled = _pDraggableDisabled;
        if (this._pDraggableDisabled) {
            this.unbindMouseListeners();
        }
        else {
            this.el.nativeElement.draggable = true;
            this.bindMouseListeners();
        }
    }
    ngAfterViewInit() {
        if (!this.pDraggableDisabled) {
            this.el.nativeElement.draggable = true;
            this.bindMouseListeners();
        }
    }
    bindDragListener() {
        if (!this.dragListener) {
            this.zone.runOutsideAngular(() => {
                this.dragListener = this.renderer.listen(this.el.nativeElement, 'drag', this.drag.bind(this));
            });
        }
    }
    unbindDragListener() {
        if (this.dragListener) {
            this.zone.runOutsideAngular(() => {
                this.dragListener && this.dragListener();
                this.dragListener = null;
            });
        }
    }
    bindMouseListeners() {
        if (!this.mouseDownListener && !this.mouseUpListener) {
            this.zone.runOutsideAngular(() => {
                this.mouseDownListener = this.renderer.listen(this.el.nativeElement, 'mousedown', this.mousedown.bind(this));
                this.mouseUpListener = this.renderer.listen(this.el.nativeElement, 'mouseup', this.mouseup.bind(this));
            });
        }
    }
    unbindMouseListeners() {
        if (this.mouseDownListener && this.mouseUpListener) {
            this.zone.runOutsideAngular(() => {
                this.mouseDownListener && this.mouseDownListener();
                this.mouseUpListener && this.mouseUpListener();
                this.mouseDownListener = null;
                this.mouseUpListener = null;
            });
        }
    }
    drag(event) {
        this.onDrag.emit(event);
    }
    dragStart(event) {
        if (this.allowDrag() && !this.pDraggableDisabled) {
            if (this.dragEffect) {
                event.dataTransfer.effectAllowed = this.dragEffect;
            }
            event.dataTransfer.setData('text', this.scope);
            this.onDragStart.emit(event);
            this.bindDragListener();
        }
        else {
            event.preventDefault();
        }
    }
    dragEnd(event) {
        this.onDragEnd.emit(event);
        this.unbindDragListener();
    }
    mousedown(event) {
        this.handle = event.target;
    }
    mouseup(event) {
        this.handle = null;
    }
    allowDrag() {
        if (this.dragHandle && this.handle)
            return DomHandler.matches(this.handle, this.dragHandle);
        else
            return true;
    }
    ngOnDestroy() {
        this.unbindDragListener();
        this.unbindMouseListeners();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: Draggable, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.0", type: Draggable, selector: "[pDraggable]", inputs: { scope: ["pDraggable", "scope"], dragEffect: "dragEffect", dragHandle: "dragHandle", pDraggableDisabled: "pDraggableDisabled" }, outputs: { onDragStart: "onDragStart", onDragEnd: "onDragEnd", onDrag: "onDrag" }, host: { listeners: { "dragstart": "dragStart($event)", "dragend": "dragEnd($event)" }, classAttribute: "p-element" }, ngImport: i0 });
}
export { Draggable };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: Draggable, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pDraggable]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i0.Renderer2 }]; }, propDecorators: { scope: [{
                type: Input,
                args: ['pDraggable']
            }], dragEffect: [{
                type: Input
            }], dragHandle: [{
                type: Input
            }], onDragStart: [{
                type: Output
            }], onDragEnd: [{
                type: Output
            }], onDrag: [{
                type: Output
            }], pDraggableDisabled: [{
                type: Input
            }], dragStart: [{
                type: HostListener,
                args: ['dragstart', ['$event']]
            }], dragEnd: [{
                type: HostListener,
                args: ['dragend', ['$event']]
            }] } });
/**
 * pDroppable directive apply droppable behavior to any element.
 * @group Components
 */
class Droppable {
    el;
    zone;
    renderer;
    scope;
    /**
     * Whether the element is droppable, useful for conditional cases.
     * @group Props
     */
    pDroppableDisabled = false;
    /**
     * Defines the cursor style, valid values are none, copy, move, link, copyMove, copyLink, linkMove and all.
     * @group Props
     */
    dropEffect;
    /**
     * Callback to invoke when a draggable enters drop area.
     * @group Emits
     */
    onDragEnter = new EventEmitter();
    /**
     * Callback to invoke when a draggable leave drop area.
     * @group Emits
     */
    onDragLeave = new EventEmitter();
    /**
     * Callback to invoke when a draggable is dropped onto drop area.
     * @group Emits
     */
    onDrop = new EventEmitter();
    constructor(el, zone, renderer) {
        this.el = el;
        this.zone = zone;
        this.renderer = renderer;
    }
    dragOverListener;
    ngAfterViewInit() {
        if (!this.pDroppableDisabled) {
            this.bindDragOverListener();
        }
    }
    bindDragOverListener() {
        if (!this.dragOverListener) {
            this.zone.runOutsideAngular(() => {
                this.dragOverListener = this.renderer.listen(this.el.nativeElement, 'dragover', this.dragOver.bind(this));
            });
        }
    }
    unbindDragOverListener() {
        if (this.dragOverListener) {
            this.zone.runOutsideAngular(() => {
                this.dragOverListener && this.dragOverListener();
                this.dragOverListener = null;
            });
        }
    }
    dragOver(event) {
        event.preventDefault();
    }
    drop(event) {
        if (this.allowDrop(event)) {
            DomHandler.removeClass(this.el.nativeElement, 'p-draggable-enter');
            event.preventDefault();
            this.onDrop.emit(event);
        }
    }
    dragEnter(event) {
        event.preventDefault();
        if (this.dropEffect) {
            event.dataTransfer.dropEffect = this.dropEffect;
        }
        DomHandler.addClass(this.el.nativeElement, 'p-draggable-enter');
        this.onDragEnter.emit(event);
    }
    dragLeave(event) {
        event.preventDefault();
        DomHandler.removeClass(this.el.nativeElement, 'p-draggable-enter');
        this.onDragLeave.emit(event);
    }
    allowDrop(event) {
        let dragScope = event.dataTransfer.getData('text');
        if (typeof this.scope == 'string' && dragScope == this.scope) {
            return true;
        }
        else if (Array.isArray(this.scope)) {
            for (let j = 0; j < this.scope.length; j++) {
                if (dragScope == this.scope[j]) {
                    return true;
                }
            }
        }
        return false;
    }
    ngOnDestroy() {
        this.unbindDragOverListener();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: Droppable, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.0", type: Droppable, selector: "[pDroppable]", inputs: { scope: ["pDroppable", "scope"], pDroppableDisabled: "pDroppableDisabled", dropEffect: "dropEffect" }, outputs: { onDragEnter: "onDragEnter", onDragLeave: "onDragLeave", onDrop: "onDrop" }, host: { listeners: { "drop": "drop($event)", "dragenter": "dragEnter($event)", "dragleave": "dragLeave($event)" }, classAttribute: "p-element" }, ngImport: i0 });
}
export { Droppable };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: Droppable, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pDroppable]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i0.Renderer2 }]; }, propDecorators: { scope: [{
                type: Input,
                args: ['pDroppable']
            }], pDroppableDisabled: [{
                type: Input
            }], dropEffect: [{
                type: Input
            }], onDragEnter: [{
                type: Output
            }], onDragLeave: [{
                type: Output
            }], onDrop: [{
                type: Output
            }], drop: [{
                type: HostListener,
                args: ['drop', ['$event']]
            }], dragEnter: [{
                type: HostListener,
                args: ['dragenter', ['$event']]
            }], dragLeave: [{
                type: HostListener,
                args: ['dragleave', ['$event']]
            }] } });
class DragDropModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: DragDropModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.0", ngImport: i0, type: DragDropModule, declarations: [Draggable, Droppable], imports: [CommonModule], exports: [Draggable, Droppable] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: DragDropModule, imports: [CommonModule] });
}
export { DragDropModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: DragDropModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Draggable, Droppable],
                    declarations: [Draggable, Droppable]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2Ryb3AuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvZHJhZ2Ryb3AvZHJhZ2Ryb3AudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBaUIsU0FBUyxFQUFjLFlBQVksRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBcUIsTUFBTSxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBQ3hKLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7O0FBRXpDOzs7R0FHRztBQUNILE1BTWEsU0FBUztJQXlDQztJQUF1QjtJQUFzQjtJQXhDM0MsS0FBSyxDQUFxQjtJQUMvQzs7O09BR0c7SUFDTSxVQUFVLENBQWlIO0lBQ3BJOzs7T0FHRztJQUNNLFVBQVUsQ0FBcUI7SUFDeEM7Ozs7T0FJRztJQUNPLFdBQVcsR0FBNEIsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUNwRTs7OztPQUlHO0lBQ08sU0FBUyxHQUE0QixJQUFJLFlBQVksRUFBRSxDQUFDO0lBQ2xFOzs7O09BSUc7SUFDTyxNQUFNLEdBQTRCLElBQUksWUFBWSxFQUFFLENBQUM7SUFFL0QsTUFBTSxDQUFNO0lBRVosWUFBWSxDQUFlO0lBRTNCLGlCQUFpQixDQUFlO0lBRWhDLGVBQWUsQ0FBZTtJQUU5QixtQkFBbUIsR0FBWSxLQUFLLENBQUM7SUFFckMsWUFBbUIsRUFBYyxFQUFTLElBQVksRUFBVSxRQUFtQjtRQUFoRSxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7SUFBRyxDQUFDO0lBRXZGLElBQWEsa0JBQWtCO1FBQzNCLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDO0lBQ3BDLENBQUM7SUFDRCxJQUFJLGtCQUFrQixDQUFDLG1CQUE0QjtRQUMvQyxJ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U0FBUztrQkFOckIsU0FBUzttQkFBQztvQkFDUCxRQUFRLEVBQUUsY0FBYztvQkFDeEIsSUFBSSxFQUFFO3dCQUNGLEtBQUssRUFBRSxXQUFXO3FCQUNyQjtpQkFDSjs4SUFFd0IsS0FBSztzQkFBekIsS0FBSzt1QkFBQyxZQUFZO2dCQUtWLGtCQUFrQjtzQkFBMUIsS0FBSztnQkFLRyxVQUFVO3NCQUFsQixLQUFLO2dCQUtJLFdBQVc7c0JBQXBCLE1BQU07Z0JBS0csV0FBVztzQkFBcEIsTUFBTTtnQkFLRyxNQUFNO3NCQUFmLE1BQU07Z0JBa0NQLElBQUk7c0JBREgsWUFBWTt1QkFBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBVWhDLFNBQVM7c0JBRFIsWUFBWTt1QkFBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBYXJDLFNBQVM7c0JBRFIsWUFBWTt1QkFBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUM7O0FBMkJ6QyxNQUthLGNBQWM7dUdBQWQsY0FBYzt3R0FBZCxjQUFjLGlCQTNRZCxTQUFTLEVBMkpULFNBQVMsYUE0R1IsWUFBWSxhQXZRYixTQUFTLEVBMkpULFNBQVM7d0dBZ0hULGNBQWMsWUFKYixZQUFZOztTQUliLGNBQWM7MkZBQWQsY0FBYztrQkFMMUIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUM7b0JBQy9CLFlBQVksRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUM7aUJBQ3ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEFmdGVyVmlld0luaXQsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIElucHV0LCBOZ01vZHVsZSwgTmdab25lLCBPbkRlc3Ryb3ksIE91dHB1dCwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgVm9pZExpc3RlbmVyIH0gZnJvbSAncHJpbWVuZy90cy1oZWxwZXJzJztcbi8qKlxuICogcERyYWdnYWJsZSBkaXJlY3RpdmUgYXBwbHkgZHJhZ2dhYmxlIGJlaGF2aW9yIHRvIGFueSBlbGVtZW50LlxuICogQGdyb3VwIENvbXBvbmVudHNcbiAqL1xuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbcERyYWdnYWJsZV0nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBEcmFnZ2FibGUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICAgIEBJbnB1dCgncERyYWdnYWJsZScpIHNjb3BlOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogRGVmaW5lcyB0aGUgY3Vyc29yIHN0eWxlLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGRyYWdFZmZlY3Q6ICdub25lJyB8ICdjb3B5JyB8ICdjb3B5TGluaycgfCAnY29weU1vdmUnIHwgJ2xpbmsnIHwgJ2xpbmtNb3ZlJyB8ICdtb3ZlJyB8ICdhbGwnIHwgJ3VuaW5pdGlhbGl6ZWQnIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFNlbGVjdG9yIHRvIGRlZmluZSB0aGUgZHJhZyBoYW5kbGUsIGJ5IGRlZmF1bHQgYW55d2hlcmUgb24gdGhlIHRhcmdldCBlbGVtZW50IGlzIGEgZHJhZyBoYW5kbGUgdG8gc3RhcnQgZHJhZ2dpbmcuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgZHJhZ0hhbmRsZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIHRvIGludm9rZSB3aGVuIGRyYWcgYmVnaW5zLlxuICAgICAqIEBwYXJhbSB7RHJhZ0V2ZW50fSBldmVudCAtIERyYWcgZXZlbnQuXG4gICAgICogQGdyb3VwIEVtaXRzXG4gICAgICovXG4gICAgQE91dHB1dCgpIG9uRHJhZ1N0YXJ0OiBFdmVudEVtaXR0ZXI8RHJhZ0V2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayB0byBpbnZva2Ugd2hlbiBkcmFnIGVuZHMuXG4gICAgICogQHBhcmFtIHtEcmFnRXZlbnR9IGV2ZW50IC0gRHJhZyBldmVudC5cbiAgICAgKiBAZ3JvdXAgRW1pdHNcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgb25EcmFnRW5kOiBFdmVudEVtaXR0ZXI8RHJhZ0V2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayB0byBpbnZva2Ugb24gZHJhZ2dpbmcuXG4gICAgICogQHBhcmFtIHtEcmFnRXZlbnR9IGV2ZW50IC0gRHJhZyBldmVudC5cbiAgICAgKiBAZ3JvdXAgRW1pdHNcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgb25EcmFnOiBFdmVudEVtaXR0ZXI8RHJhZ0V2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIGhhbmRsZTogYW55O1xuXG4gICAgZHJhZ0xpc3RlbmVyOiBWb2lkTGlzdGVuZXI7XG5cbiAgICBtb3VzZURvd25MaXN0ZW5lcjogVm9pZExpc3RlbmVyO1xuXG4gICAgbW91c2VVcExpc3RlbmVyOiBWb2lkTGlzdGVuZXI7XG5cbiAgICBfcERyYWdnYWJsZURpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyB6b25lOiBOZ1pvbmUsIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge31cblxuICAgIEBJbnB1dCgpIGdldCBwRHJhZ2dhYmxlRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wRHJhZ2dhYmxlRGlzYWJsZWQ7XG4gICAgfVxuICAgIHNldCBwRHJhZ2dhYmxlRGlzYWJsZWQoX3BEcmFnZ2FibGVEaXNhYmxlZDogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9wRHJhZ2dhYmxlRGlzYWJsZWQgPSBfcERyYWdnYWJsZURpc2FibGVkO1xuXG4gICAgICAgIGlmICh0aGlzLl9wRHJhZ2dhYmxlRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMudW5iaW5kTW91c2VMaXN0ZW5lcnMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5kcmFnZ2FibGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5iaW5kTW91c2VMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnBEcmFnZ2FibGVEaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmRyYWdnYWJsZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmJpbmRNb3VzZUxpc3RlbmVycygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZERyYWdMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRyYWdMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2RyYWcnLCB0aGlzLmRyYWcuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZERyYWdMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuZHJhZ0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ0xpc3RlbmVyICYmIHRoaXMuZHJhZ0xpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kTW91c2VMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGlmICghdGhpcy5tb3VzZURvd25MaXN0ZW5lciAmJiAhdGhpcy5tb3VzZVVwTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZURvd25MaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ21vdXNlZG93bicsIHRoaXMubW91c2Vkb3duLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIHRoaXMubW91c2VVcExpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnbW91c2V1cCcsIHRoaXMubW91c2V1cC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kTW91c2VMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGlmICh0aGlzLm1vdXNlRG93bkxpc3RlbmVyICYmIHRoaXMubW91c2VVcExpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubW91c2VEb3duTGlzdGVuZXIgJiYgdGhpcy5tb3VzZURvd25MaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgIHRoaXMubW91c2VVcExpc3RlbmVyICYmIHRoaXMubW91c2VVcExpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZURvd25MaXN0ZW5lciA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZVVwTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkcmFnKGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICAgICAgdGhpcy5vbkRyYWcuZW1pdChldmVudCk7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignZHJhZ3N0YXJ0JywgWyckZXZlbnQnXSlcbiAgICBkcmFnU3RhcnQoZXZlbnQ6IERyYWdFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5hbGxvd0RyYWcoKSAmJiAhdGhpcy5wRHJhZ2dhYmxlRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdFZmZlY3QpIHtcbiAgICAgICAgICAgICAgICAoZXZlbnQuZGF0YVRyYW5zZmVyIGFzIERhdGFUcmFuc2ZlcikuZWZmZWN0QWxsb3dlZCA9IHRoaXMuZHJhZ0VmZmVjdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIChldmVudC5kYXRhVHJhbnNmZXIgYXMgRGF0YVRyYW5zZmVyKS5zZXREYXRhKCd0ZXh0JywgdGhpcy5zY29wZSEpO1xuXG4gICAgICAgICAgICB0aGlzLm9uRHJhZ1N0YXJ0LmVtaXQoZXZlbnQpO1xuXG4gICAgICAgICAgICB0aGlzLmJpbmREcmFnTGlzdGVuZXIoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdkcmFnZW5kJywgWyckZXZlbnQnXSlcbiAgICBkcmFnRW5kKGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICAgICAgdGhpcy5vbkRyYWdFbmQuZW1pdChldmVudCk7XG4gICAgICAgIHRoaXMudW5iaW5kRHJhZ0xpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgbW91c2Vkb3duKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIHRoaXMuaGFuZGxlID0gZXZlbnQudGFyZ2V0O1xuICAgIH1cblxuICAgIG1vdXNldXAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGUgPSBudWxsO1xuICAgIH1cblxuICAgIGFsbG93RHJhZygpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuZHJhZ0hhbmRsZSAmJiB0aGlzLmhhbmRsZSkgcmV0dXJuIERvbUhhbmRsZXIubWF0Y2hlcyh0aGlzLmhhbmRsZSwgdGhpcy5kcmFnSGFuZGxlKTtcbiAgICAgICAgZWxzZSByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy51bmJpbmREcmFnTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy51bmJpbmRNb3VzZUxpc3RlbmVycygpO1xuICAgIH1cbn1cbi8qKlxuICogcERyb3BwYWJsZSBkaXJlY3RpdmUgYXBwbHkgZHJvcHBhYmxlIGJlaGF2aW9yIHRvIGFueSBlbGVtZW50LlxuICogQGdyb3VwIENvbXBvbmVudHNcbiAqL1xuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbcERyb3BwYWJsZV0nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBEcm9wcGFibGUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICAgIEBJbnB1dCgncERyb3BwYWJsZScpIHNjb3BlOiBzdHJpbmcgfCBzdHJpbmdbXSB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSBlbGVtZW50IGlzIGRyb3BwYWJsZSwgdXNlZnVsIGZvciBjb25kaXRpb25hbCBjYXNlcy5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwRHJvcHBhYmxlRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIHRoZSBjdXJzb3Igc3R5bGUsIHZhbGlkIHZhbHVlcyBhcmUgbm9uZSwgY29weSwgbW92ZSwgbGluaywgY29weU1vdmUsIGNvcHlMaW5rLCBsaW5rTW92ZSBhbmQgYWxsLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGRyb3BFZmZlY3Q6ICdub25lJyB8ICdjb3B5JyB8ICdsaW5rJyB8ICdtb3ZlJyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayB0byBpbnZva2Ugd2hlbiBhIGRyYWdnYWJsZSBlbnRlcnMgZHJvcCBhcmVhLlxuICAgICAqIEBncm91cCBFbWl0c1xuICAgICAqL1xuICAgIEBPdXRwdXQoKSBvbkRyYWdFbnRlcjogRXZlbnRFbWl0dGVyPERyYWdFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgdG8gaW52b2tlIHdoZW4gYSBkcmFnZ2FibGUgbGVhdmUgZHJvcCBhcmVhLlxuICAgICAqIEBncm91cCBFbWl0c1xuICAgICAqL1xuICAgIEBPdXRwdXQoKSBvbkRyYWdMZWF2ZTogRXZlbnRFbWl0dGVyPERyYWdFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgdG8gaW52b2tlIHdoZW4gYSBkcmFnZ2FibGUgaXMgZHJvcHBlZCBvbnRvIGRyb3AgYXJlYS5cbiAgICAgKiBAZ3JvdXAgRW1pdHNcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgb25Ecm9wOiBFdmVudEVtaXR0ZXI8RHJhZ0V2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIHpvbmU6IE5nWm9uZSwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7fVxuXG4gICAgZHJhZ092ZXJMaXN0ZW5lcjogVm9pZExpc3RlbmVyO1xuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAoIXRoaXMucERyb3BwYWJsZURpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmJpbmREcmFnT3Zlckxpc3RlbmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kRHJhZ092ZXJMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRyYWdPdmVyTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnT3Zlckxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnZHJhZ292ZXInLCB0aGlzLmRyYWdPdmVyLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmREcmFnT3Zlckxpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5kcmFnT3Zlckxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ092ZXJMaXN0ZW5lciAmJiB0aGlzLmRyYWdPdmVyTGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdPdmVyTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkcmFnT3ZlcihldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignZHJvcCcsIFsnJGV2ZW50J10pXG4gICAgZHJvcChldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmFsbG93RHJvcChldmVudCkpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCAncC1kcmFnZ2FibGUtZW50ZXInKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm9uRHJvcC5lbWl0KGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2RyYWdlbnRlcicsIFsnJGV2ZW50J10pXG4gICAgZHJhZ0VudGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAodGhpcy5kcm9wRWZmZWN0KSB7XG4gICAgICAgICAgICAoZXZlbnQuZGF0YVRyYW5zZmVyIGFzIERhdGFUcmFuc2ZlcikuZHJvcEVmZmVjdCA9IHRoaXMuZHJvcEVmZmVjdDtcbiAgICAgICAgfVxuXG4gICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCAncC1kcmFnZ2FibGUtZW50ZXInKTtcbiAgICAgICAgdGhpcy5vbkRyYWdFbnRlci5lbWl0KGV2ZW50KTtcbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdkcmFnbGVhdmUnLCBbJyRldmVudCddKVxuICAgIGRyYWdMZWF2ZShldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdwLWRyYWdnYWJsZS1lbnRlcicpO1xuICAgICAgICB0aGlzLm9uRHJhZ0xlYXZlLmVtaXQoZXZlbnQpO1xuICAgIH1cblxuICAgIGFsbG93RHJvcChldmVudDogRHJhZ0V2ZW50KTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBkcmFnU2NvcGUgPSAoZXZlbnQuZGF0YVRyYW5zZmVyIGFzIERhdGFUcmFuc2ZlcikuZ2V0RGF0YSgndGV4dCcpO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuc2NvcGUgPT0gJ3N0cmluZycgJiYgZHJhZ1Njb3BlID09IHRoaXMuc2NvcGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5zY29wZSkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5zY29wZS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChkcmFnU2NvcGUgPT0gdGhpcy5zY29wZVtqXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLnVuYmluZERyYWdPdmVyTGlzdGVuZXIoKTtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW0RyYWdnYWJsZSwgRHJvcHBhYmxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtEcmFnZ2FibGUsIERyb3BwYWJsZV1cbn0pXG5leHBvcnQgY2xhc3MgRHJhZ0Ryb3BNb2R1bGUge31cbiJdfQ==