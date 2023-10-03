import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ContentChild, Directive, EventEmitter, Inject, NgModule, Output, PLATFORM_ID, TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Defer postpones the loading the content that is initially not in the viewport until it becomes visible on scroll.
 * @group Components
 */
class DeferredLoader {
    document;
    platformId;
    el;
    renderer;
    viewContainer;
    cd;
    /**
     * Callback to invoke when deferred content is loaded.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onLoad = new EventEmitter();
    template;
    documentScrollListener;
    view;
    window;
    constructor(document, platformId, el, renderer, viewContainer, cd) {
        this.document = document;
        this.platformId = platformId;
        this.el = el;
        this.renderer = renderer;
        this.viewContainer = viewContainer;
        this.cd = cd;
        this.window = this.document.defaultView;
    }
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.shouldLoad()) {
                this.load();
            }
            if (!this.isLoaded()) {
                this.documentScrollListener = this.renderer.listen(this.window, 'scroll', () => {
                    if (this.shouldLoad()) {
                        this.load();
                        this.documentScrollListener && this.documentScrollListener();
                        this.documentScrollListener = null;
                    }
                });
            }
        }
    }
    shouldLoad() {
        if (this.isLoaded()) {
            return false;
        }
        else {
            let rect = this.el.nativeElement.getBoundingClientRect();
            let docElement = this.document.documentElement;
            let winHeight = docElement.clientHeight;
            return winHeight >= rect.top;
        }
    }
    load() {
        this.view = this.viewContainer.createEmbeddedView(this.template);
        this.onLoad.emit();
        this.cd.detectChanges();
    }
    isLoaded() {
        return this.view != null && isPlatformBrowser(this.platformId);
    }
    ngOnDestroy() {
        this.view = null;
        if (this.documentScrollListener) {
            this.documentScrollListener();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: DeferredLoader, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ViewContainerRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.0", type: DeferredLoader, selector: "[pDefer]", outputs: { onLoad: "onLoad" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "template", first: true, predicate: TemplateRef, descendants: true }], ngImport: i0 });
}
export { DeferredLoader };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: DeferredLoader, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pDefer]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ViewContainerRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { onLoad: [{
                type: Output
            }], template: [{
                type: ContentChild,
                args: [TemplateRef]
            }] } });
class DeferModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: DeferModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.0", ngImport: i0, type: DeferModule, declarations: [DeferredLoader], imports: [CommonModule], exports: [DeferredLoader] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: DeferModule, imports: [CommonModule] });
}
export { DeferModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: DeferModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [DeferredLoader],
                    declarations: [DeferredLoader]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvZGVmZXIvZGVmZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RSxPQUFPLEVBQW9DLFlBQVksRUFBRSxTQUFTLEVBQStCLFlBQVksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFhLE1BQU0sRUFBRSxXQUFXLEVBQWEsV0FBVyxFQUFvQixNQUFNLGVBQWUsQ0FBQzs7QUFFak87OztHQUdHO0FBQ0gsTUFNYSxjQUFjO0lBZ0JlO0lBQWlEO0lBQXdCO0lBQXVCO0lBQTRCO0lBQXlDO0lBZjNNOzs7O09BSUc7SUFDTyxNQUFNLEdBQXdCLElBQUksWUFBWSxFQUFTLENBQUM7SUFFdkMsUUFBUSxDQUErQjtJQUVsRSxzQkFBc0IsQ0FBcUI7SUFFM0MsSUFBSSxDQUFpQztJQUVyQyxNQUFNLENBQVM7SUFFZixZQUFzQyxRQUFrQixFQUErQixVQUFlLEVBQVMsRUFBYyxFQUFTLFFBQW1CLEVBQVMsYUFBK0IsRUFBVSxFQUFxQjtRQUExTCxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQStCLGVBQVUsR0FBVixVQUFVLENBQUs7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUFTLGtCQUFhLEdBQWIsYUFBYSxDQUFrQjtRQUFVLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBQzVOLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFxQixDQUFDO0lBQ3RELENBQUM7SUFFRCxlQUFlO1FBQ1gsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDcEMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNmO1lBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRTtvQkFDM0UsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7d0JBQ25CLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDWixJQUFJLENBQUMsc0JBQXNCLElBQUksSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7d0JBQzdELElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUM7cUJBQ3RDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO2FBQ047U0FDSjtJQUNMLENBQUM7SUFFRCxVQUFVO1FBQ04sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDakIsT0FBTyxLQUFLLENBQUM7U0FDaEI7YUFBTTtZQUNILElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDekQsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUM7WUFDL0MsSUFBSSxTQUFTLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQztZQUV4QyxPQUFPLFNBQVMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQ2hDO0lBQ0wsQ0FBQztJQUVELElBQUk7UUFDQSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQTRCLENBQUMsQ0FBQztRQUNyRixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBRWpCLElBQUksSUFBSSxDQUFDLHNCQUFzQixFQUFFO1lBQzdCLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1NBQ2pDO0lBQ0wsQ0FBQzt1R0FsRVEsY0FBYyxrQkFnQkgsUUFBUSxhQUFzQyxXQUFXOzJGQWhCcEUsY0FBYyw0SkFRVCxXQUFXOztTQVJoQixjQUFjOzJGQUFkLGNBQWM7a0JBTjFCLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLFVBQVU7b0JBQ3BCLElBQUksRUFBRTt3QkFDRixLQUFLLEVBQUUsV0FBVztxQkFDckI7aUJBQ0o7OzBCQWlCZ0IsTUFBTTsyQkFBQyxRQUFROzswQkFBK0IsTUFBTTsyQkFBQyxXQUFXOzRKQVZuRSxNQUFNO3NCQUFmLE1BQU07Z0JBRW9CLFFBQVE7c0JBQWxDLFlBQVk7dUJBQUMsV0FBVzs7QUE2RDdCLE1BS2EsV0FBVzt1R0FBWCxXQUFXO3dHQUFYLFdBQVcsaUJBMUVYLGNBQWMsYUFzRWIsWUFBWSxhQXRFYixjQUFjO3dHQTBFZCxXQUFXLFlBSlYsWUFBWTs7U0FJYixXQUFXOzJGQUFYLFdBQVc7a0JBTHZCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUM7b0JBQ3pCLFlBQVksRUFBRSxDQUFDLGNBQWMsQ0FBQztpQkFDakMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUsIERPQ1VNRU5ULCBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDaGFuZ2VEZXRlY3RvclJlZiwgQ29udGVudENoaWxkLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEVtYmVkZGVkVmlld1JlZiwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIE5nTW9kdWxlLCBPbkRlc3Ryb3ksIE91dHB1dCwgUExBVEZPUk1fSUQsIFJlbmRlcmVyMiwgVGVtcGxhdGVSZWYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE51bGxhYmxlIH0gZnJvbSAncHJpbWVuZy90cy1oZWxwZXJzJztcbi8qKlxuICogRGVmZXIgcG9zdHBvbmVzIHRoZSBsb2FkaW5nIHRoZSBjb250ZW50IHRoYXQgaXMgaW5pdGlhbGx5IG5vdCBpbiB0aGUgdmlld3BvcnQgdW50aWwgaXQgYmVjb21lcyB2aXNpYmxlIG9uIHNjcm9sbC5cbiAqIEBncm91cCBDb21wb25lbnRzXG4gKi9cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BEZWZlcl0nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBEZWZlcnJlZExvYWRlciBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgdG8gaW52b2tlIHdoZW4gZGVmZXJyZWQgY29udGVudCBpcyBsb2FkZWQuXG4gICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgLSBCcm93c2VyIGV2ZW50LlxuICAgICAqIEBncm91cCBFbWl0c1xuICAgICAqL1xuICAgIEBPdXRwdXQoKSBvbkxvYWQ6IEV2ZW50RW1pdHRlcjxFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPEV2ZW50PigpO1xuXG4gICAgQENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZikgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gfCB1bmRlZmluZWQ7XG5cbiAgICBkb2N1bWVudFNjcm9sbExpc3RlbmVyOiBOdWxsYWJsZTxGdW5jdGlvbj47XG5cbiAgICB2aWV3OiBOdWxsYWJsZTxFbWJlZGRlZFZpZXdSZWY8YW55Pj47XG5cbiAgICB3aW5kb3c6IFdpbmRvdztcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50LCBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IGFueSwgcHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHVibGljIHZpZXdDb250YWluZXI6IFZpZXdDb250YWluZXJSZWYsIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgICAgIHRoaXMud2luZG93ID0gdGhpcy5kb2N1bWVudC5kZWZhdWx0VmlldyBhcyBXaW5kb3c7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2hvdWxkTG9hZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5pc0xvYWRlZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kb2N1bWVudFNjcm9sbExpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy53aW5kb3csICdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnNob3VsZExvYWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRvY3VtZW50U2Nyb2xsTGlzdGVuZXIgJiYgdGhpcy5kb2N1bWVudFNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRvY3VtZW50U2Nyb2xsTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG91bGRMb2FkKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcmVjdCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGxldCBkb2NFbGVtZW50ID0gdGhpcy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgICAgICBsZXQgd2luSGVpZ2h0ID0gZG9jRWxlbWVudC5jbGllbnRIZWlnaHQ7XG5cbiAgICAgICAgICAgIHJldHVybiB3aW5IZWlnaHQgPj0gcmVjdC50b3A7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2FkKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnZpZXcgPSB0aGlzLnZpZXdDb250YWluZXIuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGUgYXMgVGVtcGxhdGVSZWY8YW55Pik7XG4gICAgICAgIHRoaXMub25Mb2FkLmVtaXQoKTtcbiAgICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgaXNMb2FkZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZpZXcgIT0gbnVsbCAmJiBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLnZpZXcgPSBudWxsO1xuXG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50U2Nyb2xsTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRTY3JvbGxMaXN0ZW5lcigpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtEZWZlcnJlZExvYWRlcl0sXG4gICAgZGVjbGFyYXRpb25zOiBbRGVmZXJyZWRMb2FkZXJdXG59KVxuZXhwb3J0IGNsYXNzIERlZmVyTW9kdWxlIHt9XG4iXX0=