import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Directive, Inject, NgModule, Optional, PLATFORM_ID } from '@angular/core';
import { DomHandler } from 'primeng/dom';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
/**
 * Ripple directive adds ripple effect to the host element.
 * @group Components
 */
class Ripple {
    document;
    platformId;
    renderer;
    el;
    zone;
    config;
    constructor(document, platformId, renderer, el, zone, config) {
        this.document = document;
        this.platformId = platformId;
        this.renderer = renderer;
        this.el = el;
        this.zone = zone;
        this.config = config;
    }
    animationListener;
    mouseDownListener;
    timeout;
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.config && this.config.ripple) {
                this.zone.runOutsideAngular(() => {
                    this.create();
                    this.mouseDownListener = this.renderer.listen(this.el.nativeElement, 'mousedown', this.onMouseDown.bind(this));
                });
            }
        }
    }
    onMouseDown(event) {
        let ink = this.getInk();
        if (!ink || this.document.defaultView?.getComputedStyle(ink, null).display === 'none') {
            return;
        }
        DomHandler.removeClass(ink, 'p-ink-active');
        if (!DomHandler.getHeight(ink) && !DomHandler.getWidth(ink)) {
            let d = Math.max(DomHandler.getOuterWidth(this.el.nativeElement), DomHandler.getOuterHeight(this.el.nativeElement));
            ink.style.height = d + 'px';
            ink.style.width = d + 'px';
        }
        let offset = DomHandler.getOffset(this.el.nativeElement);
        let x = event.pageX - offset.left + this.document.body.scrollTop - DomHandler.getWidth(ink) / 2;
        let y = event.pageY - offset.top + this.document.body.scrollLeft - DomHandler.getHeight(ink) / 2;
        this.renderer.setStyle(ink, 'top', y + 'px');
        this.renderer.setStyle(ink, 'left', x + 'px');
        DomHandler.addClass(ink, 'p-ink-active');
        this.timeout = setTimeout(() => {
            let ink = this.getInk();
            if (ink) {
                DomHandler.removeClass(ink, 'p-ink-active');
            }
        }, 401);
    }
    getInk() {
        const children = this.el.nativeElement.children;
        for (let i = 0; i < children.length; i++) {
            if (typeof children[i].className === 'string' && children[i].className.indexOf('p-ink') !== -1) {
                return children[i];
            }
        }
        return null;
    }
    resetInk() {
        let ink = this.getInk();
        if (ink) {
            DomHandler.removeClass(ink, 'p-ink-active');
        }
    }
    onAnimationEnd(event) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        DomHandler.removeClass(event.currentTarget, 'p-ink-active');
    }
    create() {
        let ink = this.renderer.createElement('span');
        this.renderer.addClass(ink, 'p-ink');
        this.renderer.appendChild(this.el.nativeElement, ink);
        this.renderer.setAttribute(ink, 'aria-hidden', 'true');
        this.renderer.setAttribute(ink, 'role', 'presentation');
        if (!this.animationListener) {
            this.animationListener = this.renderer.listen(ink, 'animationend', this.onAnimationEnd.bind(this));
        }
    }
    remove() {
        let ink = this.getInk();
        if (ink) {
            this.mouseDownListener && this.mouseDownListener();
            this.animationListener && this.animationListener();
            this.mouseDownListener = null;
            this.animationListener = null;
            DomHandler.removeElement(ink);
        }
    }
    ngOnDestroy() {
        if (this.config && this.config.ripple) {
            this.remove();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: Ripple, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i0.NgZone }, { token: i1.PrimeNGConfig, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.0", type: Ripple, selector: "[pRipple]", host: { classAttribute: "p-ripple p-element" }, ngImport: i0 });
}
export { Ripple };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: Ripple, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pRipple]',
                    host: {
                        class: 'p-ripple p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i0.NgZone }, { type: i1.PrimeNGConfig, decorators: [{
                    type: Optional
                }] }]; } });
class RippleModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: RippleModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.0", ngImport: i0, type: RippleModule, declarations: [Ripple], imports: [CommonModule], exports: [Ripple] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: RippleModule, imports: [CommonModule] });
}
export { RippleModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: RippleModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Ripple],
                    declarations: [Ripple]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3JpcHBsZS9yaXBwbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RSxPQUFPLEVBQWlCLFNBQVMsRUFBYyxNQUFNLEVBQUUsUUFBUSxFQUFxQixRQUFRLEVBQUUsV0FBVyxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBRTVJLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7OztBQUV6Qzs7O0dBR0c7QUFDSCxNQU1hLE1BQU07SUFDdUI7SUFBaUQ7SUFBeUI7SUFBNEI7SUFBdUI7SUFBaUM7SUFBcE0sWUFBc0MsUUFBa0IsRUFBK0IsVUFBZSxFQUFVLFFBQW1CLEVBQVMsRUFBYyxFQUFTLElBQVksRUFBcUIsTUFBcUI7UUFBbkwsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUErQixlQUFVLEdBQVYsVUFBVSxDQUFLO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUFTLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQXFCLFdBQU0sR0FBTixNQUFNLENBQWU7SUFBRyxDQUFDO0lBRTdOLGlCQUFpQixDQUFlO0lBRWhDLGlCQUFpQixDQUFlO0lBRWhDLE9BQU8sQ0FBTTtJQUViLGVBQWU7UUFDWCxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNwQyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO29CQUM3QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ2QsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElB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O29CQUN2QixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7b0JBQ2pCLFlBQVksRUFBRSxDQUFDLE1BQU0sQ0FBQztpQkFDekIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUsIERPQ1VNRU5ULCBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBBZnRlclZpZXdJbml0LCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEluamVjdCwgTmdNb2R1bGUsIE5nWm9uZSwgT25EZXN0cm95LCBPcHRpb25hbCwgUExBVEZPUk1fSUQsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUHJpbWVOR0NvbmZpZyB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IERvbUhhbmRsZXIgfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQgeyBWb2lkTGlzdGVuZXIgfSBmcm9tICdwcmltZW5nL3RzLWhlbHBlcnMnO1xuLyoqXG4gKiBSaXBwbGUgZGlyZWN0aXZlIGFkZHMgcmlwcGxlIGVmZmVjdCB0byB0aGUgaG9zdCBlbGVtZW50LlxuICogQGdyb3VwIENvbXBvbmVudHNcbiAqL1xuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbcFJpcHBsZV0nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLXJpcHBsZSBwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBSaXBwbGUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50LCBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IGFueSwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLCBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyB6b25lOiBOZ1pvbmUsIEBPcHRpb25hbCgpIHB1YmxpYyBjb25maWc6IFByaW1lTkdDb25maWcpIHt9XG5cbiAgICBhbmltYXRpb25MaXN0ZW5lcjogVm9pZExpc3RlbmVyO1xuXG4gICAgbW91c2VEb3duTGlzdGVuZXI6IFZvaWRMaXN0ZW5lcjtcblxuICAgIHRpbWVvdXQ6IGFueTtcblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZyAmJiB0aGlzLmNvbmZpZy5yaXBwbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdXNlRG93bkxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnbW91c2Vkb3duJywgdGhpcy5vbk1vdXNlRG93bi5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGxldCBpbmsgPSB0aGlzLmdldEluaygpO1xuICAgICAgICBpZiAoIWluayB8fCB0aGlzLmRvY3VtZW50LmRlZmF1bHRWaWV3Py5nZXRDb21wdXRlZFN0eWxlKGluaywgbnVsbCkuZGlzcGxheSA9PT0gJ25vbmUnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKGluaywgJ3AtaW5rLWFjdGl2ZScpO1xuICAgICAgICBpZiAoIURvbUhhbmRsZXIuZ2V0SGVpZ2h0KGluaykgJiYgIURvbUhhbmRsZXIuZ2V0V2lkdGgoaW5rKSkge1xuICAgICAgICAgICAgbGV0IGQgPSBNYXRoLm1heChEb21IYW5kbGVyLmdldE91dGVyV2lkdGgodGhpcy5lbC5uYXRpdmVFbGVtZW50KSwgRG9tSGFuZGxlci5nZXRPdXRlckhlaWdodCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpKTtcbiAgICAgICAgICAgIGluay5zdHlsZS5oZWlnaHQgPSBkICsgJ3B4JztcbiAgICAgICAgICAgIGluay5zdHlsZS53aWR0aCA9IGQgKyAncHgnO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG9mZnNldCA9IERvbUhhbmRsZXIuZ2V0T2Zmc2V0KHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIGxldCB4ID0gZXZlbnQucGFnZVggLSBvZmZzZXQubGVmdCArIHRoaXMuZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgLSBEb21IYW5kbGVyLmdldFdpZHRoKGluaykgLyAyO1xuICAgICAgICBsZXQgeSA9IGV2ZW50LnBhZ2VZIC0gb2Zmc2V0LnRvcCArIHRoaXMuZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0IC0gRG9tSGFuZGxlci5nZXRIZWlnaHQoaW5rKSAvIDI7XG5cbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShpbmssICd0b3AnLCB5ICsgJ3B4Jyk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoaW5rLCAnbGVmdCcsIHggKyAncHgnKTtcbiAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyhpbmssICdwLWluay1hY3RpdmUnKTtcblxuICAgICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGxldCBpbmsgPSB0aGlzLmdldEluaygpO1xuICAgICAgICAgICAgaWYgKGluaykge1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3MoaW5rLCAncC1pbmstYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDQwMSk7XG4gICAgfVxuXG4gICAgZ2V0SW5rKCkge1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlbjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjaGlsZHJlbltpXS5jbGFzc05hbWUgPT09ICdzdHJpbmcnICYmIGNoaWxkcmVuW2ldLmNsYXNzTmFtZS5pbmRleE9mKCdwLWluaycpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXNldEluaygpIHtcbiAgICAgICAgbGV0IGluayA9IHRoaXMuZ2V0SW5rKCk7XG4gICAgICAgIGlmIChpbmspIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3MoaW5rLCAncC1pbmstYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkFuaW1hdGlvbkVuZChldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMudGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgICAgIH1cbiAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyhldmVudC5jdXJyZW50VGFyZ2V0LCAncC1pbmstYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICBsZXQgaW5rID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3MoaW5rLCAncC1pbmsnKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIGluayk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKGluaywgJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoaW5rLCAncm9sZScsICdwcmVzZW50YXRpb24nKTtcblxuICAgICAgICBpZiAoIXRoaXMuYW5pbWF0aW9uTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihpbmssICdhbmltYXRpb25lbmQnLCB0aGlzLm9uQW5pbWF0aW9uRW5kLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlKCkge1xuICAgICAgICBsZXQgaW5rID0gdGhpcy5nZXRJbmsoKTtcbiAgICAgICAgaWYgKGluaykge1xuICAgICAgICAgICAgdGhpcy5tb3VzZURvd25MaXN0ZW5lciAmJiB0aGlzLm1vdXNlRG93bkxpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbkxpc3RlbmVyICYmIHRoaXMuYW5pbWF0aW9uTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMubW91c2VEb3duTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25MaXN0ZW5lciA9IG51bGw7XG5cbiAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlRWxlbWVudChpbmspO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZyAmJiB0aGlzLmNvbmZpZy5yaXBwbGUpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW1JpcHBsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbUmlwcGxlXVxufSlcbmV4cG9ydCBjbGFzcyBSaXBwbGVNb2R1bGUge31cbiJdfQ==