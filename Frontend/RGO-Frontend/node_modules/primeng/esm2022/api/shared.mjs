import { CommonModule } from '@angular/common';
import { Component, Directive, Input, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
class Header {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: Header, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.0", type: Header, selector: "p-header", ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
}
export { Header };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: Header, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-header',
                    template: '<ng-content></ng-content>'
                }]
        }] });
class Footer {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: Footer, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.0", type: Footer, selector: "p-footer", ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
}
export { Footer };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: Footer, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-footer',
                    template: '<ng-content></ng-content>'
                }]
        }] });
class PrimeTemplate {
    template;
    type;
    name;
    constructor(template) {
        this.template = template;
    }
    getType() {
        return this.name;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: PrimeTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.0", type: PrimeTemplate, selector: "[pTemplate]", inputs: { type: "type", name: ["pTemplate", "name"] }, ngImport: i0 });
}
export { PrimeTemplate };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: PrimeTemplate, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pTemplate]',
                    host: {}
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; }, propDecorators: { type: [{
                type: Input
            }], name: [{
                type: Input,
                args: ['pTemplate']
            }] } });
class SharedModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: SharedModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.0", ngImport: i0, type: SharedModule, declarations: [Header, Footer, PrimeTemplate], imports: [CommonModule], exports: [Header, Footer, PrimeTemplate] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: SharedModule, imports: [CommonModule] });
}
export { SharedModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: SharedModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Header, Footer, PrimeTemplate],
                    declarations: [Header, Footer, PrimeTemplate]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2FwaS9zaGFyZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQWUsTUFBTSxlQUFlLENBQUM7O0FBRW5GLE1BSWEsTUFBTTt1R0FBTixNQUFNOzJGQUFOLE1BQU0sZ0RBRkwsMkJBQTJCOztTQUU1QixNQUFNOzJGQUFOLE1BQU07a0JBSmxCLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLFVBQVU7b0JBQ3BCLFFBQVEsRUFBRSwyQkFBMkI7aUJBQ3hDOztBQUdELE1BSWEsTUFBTTt1R0FBTixNQUFNOzJGQUFOLE1BQU0sZ0RBRkwsMkJBQTJCOztTQUU1QixNQUFNOzJGQUFOLE1BQU07a0JBSmxCLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLFVBQVU7b0JBQ3BCLFFBQVEsRUFBRSwyQkFBMkI7aUJBQ3hDOztBQUdELE1BSWEsYUFBYTtJQUtIO0lBSlYsSUFBSSxDQUFxQjtJQUVkLElBQUksQ0FBcUI7SUFFN0MsWUFBbUIsUUFBMEI7UUFBMUIsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7SUFBRyxDQUFDO0lBRWpELE9BQU87UUFDSCxPQUFPLElBQUksQ0FBQyxJQUFLLENBQUM7SUFDdEIsQ0FBQzt1R0FUUSxhQUFhOzJGQUFiLGFBQWE7O1NBQWIsYUFBYTsyRkFBYixhQUFhO2tCQUp6QixTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxhQUFhO29CQUN2QixJQUFJLEVBQUUsRUFBRTtpQkFDWDtrR0FFWSxJQUFJO3NCQUFaLEtBQUs7Z0JBRWMsSUFBSTtzQkFBdkIsS0FBSzt1QkFBQyxXQUFXOztBQVN0QixNQUthLFlBQVk7dUdBQVosWUFBWTt3R0FBWixZQUFZLGlCQTdCWixNQUFNLEVBTU4sTUFBTSxFQU1OLGFBQWEsYUFhWixZQUFZLGFBekJiLE1BQU0sRUFNTixNQUFNLEVBTU4sYUFBYTt3R0FpQmIsWUFBWSxZQUpYLFlBQVk7O1NBSWIsWUFBWTsyRkFBWixZQUFZO2tCQUx4QixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUM7b0JBQ3hDLFlBQVksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDO2lCQUNoRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDb21wb25lbnQsIERpcmVjdGl2ZSwgSW5wdXQsIE5nTW9kdWxlLCBUZW1wbGF0ZVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtaGVhZGVyJyxcbiAgICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nXG59KVxuZXhwb3J0IGNsYXNzIEhlYWRlciB7fVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtZm9vdGVyJyxcbiAgICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nXG59KVxuZXhwb3J0IGNsYXNzIEZvb3RlciB7fVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twVGVtcGxhdGVdJyxcbiAgICBob3N0OiB7fVxufSlcbmV4cG9ydCBjbGFzcyBQcmltZVRlbXBsYXRlIHtcbiAgICBASW5wdXQoKSB0eXBlOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICBASW5wdXQoJ3BUZW1wbGF0ZScpIG5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55Pikge31cblxuICAgIGdldFR5cGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZSE7XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtIZWFkZXIsIEZvb3RlciwgUHJpbWVUZW1wbGF0ZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbSGVhZGVyLCBGb290ZXIsIFByaW1lVGVtcGxhdGVdXG59KVxuZXhwb3J0IGNsYXNzIFNoYXJlZE1vZHVsZSB7fVxuIl19