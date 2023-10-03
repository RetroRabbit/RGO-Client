import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { ObjectUtils } from 'primeng/utils';
import * as i0 from "@angular/core";
class BaseIcon {
    label;
    spin = false;
    styleClass;
    role;
    ariaLabel;
    ariaHidden;
    ngOnInit() {
        this.getAttributes();
    }
    getAttributes() {
        const isLabelEmpty = ObjectUtils.isEmpty(this.label);
        this.role = !isLabelEmpty ? 'img' : undefined;
        this.ariaLabel = !isLabelEmpty ? this.label : undefined;
        this.ariaHidden = isLabelEmpty;
    }
    getClassNames() {
        return `p-icon ${this.styleClass ? this.styleClass + ' ' : ''}${this.spin ? 'p-icon-spin' : ''}`;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: BaseIcon, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.0", type: BaseIcon, isStandalone: true, selector: "ng-component", inputs: { label: "label", spin: "spin", styleClass: "styleClass" }, host: { classAttribute: "p-element p-icon-wrapper" }, ngImport: i0, template: ` <ng-content></ng-content> `, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
export { BaseIcon };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: BaseIcon, decorators: [{
            type: Component,
            args: [{
                    template: ` <ng-content></ng-content> `,
                    standalone: true,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element p-icon-wrapper'
                    }
                }]
        }], propDecorators: { label: [{
                type: Input
            }], spin: [{
                type: Input
            }], styleClass: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZWljb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvYmFzZWljb24vYmFzZWljb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQTJCLE1BQU0sZUFBZSxDQUFDO0FBQ3RILE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBRTVDLE1BU2EsUUFBUTtJQUNSLEtBQUssQ0FBUztJQUVkLElBQUksR0FBWSxLQUFLLENBQUM7SUFFdEIsVUFBVSxDQUFTO0lBRTVCLElBQUksQ0FBUztJQUViLFNBQVMsQ0FBUztJQUVsQixVQUFVLENBQVU7SUFFcEIsUUFBUTtRQUNKLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQsYUFBYTtRQUNULE1BQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQzlDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUN4RCxJQUFJLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQztJQUNuQyxDQUFDO0lBRUQsYUFBYTtRQUNULE9BQU8sVUFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7SUFDckcsQ0FBQzt1R0ExQlEsUUFBUTsyRkFBUixRQUFRLGtNQVJQLDZCQUE2Qjs7U0FROUIsUUFBUTsyRkFBUixRQUFRO2tCQVRwQixTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSw2QkFBNkI7b0JBQ3ZDLFVBQVUsRUFBRSxJQUFJO29CQUNoQixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLElBQUksRUFBRTt3QkFDRixLQUFLLEVBQUUsMEJBQTBCO3FCQUNwQztpQkFDSjs4QkFFWSxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsSUFBSTtzQkFBWixLQUFLO2dCQUVHLFVBQVU7c0JBQWxCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgVmlld0VuY2Fwc3VsYXRpb24sIEVsZW1lbnRSZWYsIEhvc3RCaW5kaW5nIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYmplY3RVdGlscyB9IGZyb20gJ3ByaW1lbmcvdXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICB0ZW1wbGF0ZTogYCA8bmctY29udGVudD48L25nLWNvbnRlbnQ+IGAsXG4gICAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQgcC1pY29uLXdyYXBwZXInXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBCYXNlSWNvbiB7XG4gICAgQElucHV0KCkgbGFiZWw6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHNwaW46IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIHJvbGU6IHN0cmluZztcblxuICAgIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gICAgYXJpYUhpZGRlbjogYm9vbGVhbjtcblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLmdldEF0dHJpYnV0ZXMoKTtcbiAgICB9XG5cbiAgICBnZXRBdHRyaWJ1dGVzKCkge1xuICAgICAgICBjb25zdCBpc0xhYmVsRW1wdHkgPSBPYmplY3RVdGlscy5pc0VtcHR5KHRoaXMubGFiZWwpO1xuICAgICAgICB0aGlzLnJvbGUgPSAhaXNMYWJlbEVtcHR5ID8gJ2ltZycgOiB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuYXJpYUxhYmVsID0gIWlzTGFiZWxFbXB0eSA/IHRoaXMubGFiZWwgOiB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuYXJpYUhpZGRlbiA9IGlzTGFiZWxFbXB0eTtcbiAgICB9XG5cbiAgICBnZXRDbGFzc05hbWVzKCkge1xuICAgICAgICByZXR1cm4gYHAtaWNvbiAke3RoaXMuc3R5bGVDbGFzcyA/IHRoaXMuc3R5bGVDbGFzcyArICcgJyA6ICcnfSR7dGhpcy5zcGluID8gJ3AtaWNvbi1zcGluJyA6ICcnfWA7XG4gICAgfVxufVxuIl19