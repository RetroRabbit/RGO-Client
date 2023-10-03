import { CommonModule } from '@angular/common';
import { Directive, Input, NgModule } from '@angular/core';
import { DomHandler } from 'primeng/dom';
import * as i0 from "@angular/core";
/**
 * Animate manages PrimeFlex CSS classes declaratively to during enter/leave animations on scroll or on page load.
 * @group Components
 */
class Animate {
    host;
    el;
    renderer;
    /**
     * Selector to define the CSS class for enter animation.
     * @group Props
     */
    enterClass;
    /**
     * Selector to define the CSS class for leave animation.
     * @group Props
     */
    leaveClass;
    observer;
    timeout;
    constructor(host, el, renderer) {
        this.host = host;
        this.el = el;
        this.renderer = renderer;
    }
    ngAfterViewInit() {
        this.bindIntersectionObserver();
    }
    bindIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 1.0
        };
        this.observer = new IntersectionObserver((el) => this.isVisible(el), options);
        this.observer.observe(this.host.nativeElement);
    }
    isVisible(element) {
        const [intersectionObserverEntry] = element;
        intersectionObserverEntry.isIntersecting ? this.enter() : this.leave();
    }
    enter() {
        this.host.nativeElement.style.visibility = 'visible';
        DomHandler.addClass(this.host.nativeElement, this.enterClass);
    }
    leave() {
        DomHandler.removeClass(this.host.nativeElement, this.enterClass);
        if (this.leaveClass) {
            DomHandler.addClass(this.host.nativeElement, this.leaveClass);
        }
        const animationDuration = this.host.nativeElement.style.animationDuration || 500;
        this.timeout = setTimeout(() => {
            this.host.nativeElement.style.visibility = 'hidden';
        }, animationDuration);
    }
    unbindIntersectionObserver() {
        if (this.observer) {
            this.observer.unobserve(this.host.nativeElement);
        }
    }
    ngOnDestroy() {
        this.unbindIntersectionObserver();
        clearTimeout(this.timeout);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: Animate, deps: [{ token: i0.ElementRef }, { token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.0", type: Animate, selector: "[pAnimate]", inputs: { enterClass: "enterClass", leaveClass: "leaveClass" }, host: { properties: { "class.p-animate": "true" } }, ngImport: i0 });
}
export { Animate };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: Animate, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pAnimate]',
                    host: {
                        '[class.p-animate]': 'true'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ElementRef }, { type: i0.Renderer2 }]; }, propDecorators: { enterClass: [{
                type: Input
            }], leaveClass: [{
                type: Input
            }] } });
class AnimateModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: AnimateModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.0", ngImport: i0, type: AnimateModule, declarations: [Animate], imports: [CommonModule], exports: [Animate] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: AnimateModule, imports: [CommonModule] });
}
export { AnimateModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: AnimateModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Animate],
                    declarations: [Animate]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9hbmltYXRlL2FuaW1hdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBaUIsU0FBUyxFQUFjLEtBQUssRUFBRSxRQUFRLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDakcsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7QUFDekM7OztHQUdHO0FBQ0gsTUFNYSxPQUFPO0lBZ0JJO0lBQXlCO0lBQXVCO0lBZnBFOzs7T0FHRztJQUNNLFVBQVUsQ0FBcUI7SUFDeEM7OztPQUdHO0lBQ00sVUFBVSxDQUFxQjtJQUV4QyxRQUFRLENBQW1DO0lBRTNDLE9BQU8sQ0FBTTtJQUViLFlBQW9CLElBQWdCLEVBQVMsRUFBYyxFQUFTLFFBQW1CO1FBQW5FLFNBQUksR0FBSixJQUFJLENBQVk7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBVztJQUFHLENBQUM7SUFFM0YsZUFBZTtRQUNYLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFFRCx3QkFBd0I7UUFDcEIsTUFBTSxPQUFPLEdBQUc7WUFDWixJQUFJLEVBQUUsSUFBSTtZQUNWLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLFNBQVMsRUFBRSxHQUFHO1NBQ2pCLENBQUM7UUFFRixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksb0JBQW9CLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsU0FBUyxDQUFDLE9BQW9DO1FBQzFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLE9BQU8sQ0FBQztRQUM1Qyx5QkFBeUIsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzNFLENBQUM7SUFFRCxLQUFLO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFDckQsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsVUFBb0IsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCxLQUFLO1FBQ0QsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsVUFBb0IsQ0FBQyxDQUFDO1FBQzNFLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNqQixVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNqRTtRQUVELE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLGlCQUFpQixJQUFJLEdBQUcsQ0FBQztRQUVqRixJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7UUFDeEQsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELDBCQUEwQjtRQUN0QixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3BEO0lBQ0wsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztRQUNsQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9CLENBQUM7dUdBakVRLE9BQU87MkZBQVAsT0FBTzs7U0FBUCxPQUFPOzJGQUFQLE9BQU87a0JBTm5CLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLElBQUksRUFBRTt3QkFDRixtQkFBbUIsRUFBRSxNQUFNO3FCQUM5QjtpQkFDSjtrSkFNWSxVQUFVO3NCQUFsQixLQUFLO2dCQUtHLFVBQVU7c0JBQWxCLEtBQUs7O0FBMERWLE1BS2EsYUFBYTt1R0FBYixhQUFhO3dHQUFiLGFBQWEsaUJBekViLE9BQU8sYUFxRU4sWUFBWSxhQXJFYixPQUFPO3dHQXlFUCxhQUFhLFlBSlosWUFBWTs7U0FJYixhQUFhOzJGQUFiLGFBQWE7a0JBTHpCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUM7b0JBQ2xCLFlBQVksRUFBRSxDQUFDLE9BQU8sQ0FBQztpQkFDMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbnB1dCwgTmdNb2R1bGUsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRG9tSGFuZGxlciB9IGZyb20gJ3ByaW1lbmcvZG9tJztcbi8qKlxuICogQW5pbWF0ZSBtYW5hZ2VzIFByaW1lRmxleCBDU1MgY2xhc3NlcyBkZWNsYXJhdGl2ZWx5IHRvIGR1cmluZyBlbnRlci9sZWF2ZSBhbmltYXRpb25zIG9uIHNjcm9sbCBvciBvbiBwYWdlIGxvYWQuXG4gKiBAZ3JvdXAgQ29tcG9uZW50c1xuICovXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twQW5pbWF0ZV0nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJ1tjbGFzcy5wLWFuaW1hdGVdJzogJ3RydWUnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBBbmltYXRlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgLyoqXG4gICAgICogU2VsZWN0b3IgdG8gZGVmaW5lIHRoZSBDU1MgY2xhc3MgZm9yIGVudGVyIGFuaW1hdGlvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBlbnRlckNsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogU2VsZWN0b3IgdG8gZGVmaW5lIHRoZSBDU1MgY2xhc3MgZm9yIGxlYXZlIGFuaW1hdGlvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBsZWF2ZUNsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICBvYnNlcnZlcjogSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgfCB1bmRlZmluZWQ7XG5cbiAgICB0aW1lb3V0OiBhbnk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGhvc3Q6IEVsZW1lbnRSZWYsIHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHt9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIHRoaXMuYmluZEludGVyc2VjdGlvbk9ic2VydmVyKCk7XG4gICAgfVxuXG4gICAgYmluZEludGVyc2VjdGlvbk9ic2VydmVyKCkge1xuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgcm9vdDogbnVsbCxcbiAgICAgICAgICAgIHJvb3RNYXJnaW46ICcwcHgnLFxuICAgICAgICAgICAgdGhyZXNob2xkOiAxLjBcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLm9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKChlbCkgPT4gdGhpcy5pc1Zpc2libGUoZWwpLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKHRoaXMuaG9zdC5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG5cbiAgICBpc1Zpc2libGUoZWxlbWVudDogSW50ZXJzZWN0aW9uT2JzZXJ2ZXJFbnRyeVtdKSB7XG4gICAgICAgIGNvbnN0IFtpbnRlcnNlY3Rpb25PYnNlcnZlckVudHJ5XSA9IGVsZW1lbnQ7XG4gICAgICAgIGludGVyc2VjdGlvbk9ic2VydmVyRW50cnkuaXNJbnRlcnNlY3RpbmcgPyB0aGlzLmVudGVyKCkgOiB0aGlzLmxlYXZlKCk7XG4gICAgfVxuXG4gICAgZW50ZXIoKSB7XG4gICAgICAgIHRoaXMuaG9zdC5uYXRpdmVFbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy5ob3N0Lm5hdGl2ZUVsZW1lbnQsIHRoaXMuZW50ZXJDbGFzcyBhcyBzdHJpbmcpO1xuICAgIH1cblxuICAgIGxlYXZlKCkge1xuICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKHRoaXMuaG9zdC5uYXRpdmVFbGVtZW50LCB0aGlzLmVudGVyQ2xhc3MgYXMgc3RyaW5nKTtcbiAgICAgICAgaWYgKHRoaXMubGVhdmVDbGFzcykge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLmhvc3QubmF0aXZlRWxlbWVudCwgdGhpcy5sZWF2ZUNsYXNzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFuaW1hdGlvbkR1cmF0aW9uID0gdGhpcy5ob3N0Lm5hdGl2ZUVsZW1lbnQuc3R5bGUuYW5pbWF0aW9uRHVyYXRpb24gfHwgNTAwO1xuXG4gICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5ob3N0Lm5hdGl2ZUVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICB9LCBhbmltYXRpb25EdXJhdGlvbik7XG4gICAgfVxuXG4gICAgdW5iaW5kSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLm9ic2VydmVyKSB7XG4gICAgICAgICAgICB0aGlzLm9ic2VydmVyLnVub2JzZXJ2ZSh0aGlzLmhvc3QubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy51bmJpbmRJbnRlcnNlY3Rpb25PYnNlcnZlcigpO1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW0FuaW1hdGVdLFxuICAgIGRlY2xhcmF0aW9uczogW0FuaW1hdGVdXG59KVxuZXhwb3J0IGNsYXNzIEFuaW1hdGVNb2R1bGUge31cbiJdfQ==