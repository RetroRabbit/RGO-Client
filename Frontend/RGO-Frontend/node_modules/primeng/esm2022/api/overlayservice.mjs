import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
class OverlayService {
    clickSource = new Subject();
    clickObservable = this.clickSource.asObservable();
    add(event) {
        if (event) {
            this.clickSource.next(event);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: OverlayService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: OverlayService, providedIn: 'root' });
}
export { OverlayService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: OverlayService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvYXBpL292ZXJsYXlzZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFHL0IsTUFDYSxjQUFjO0lBQ2YsV0FBVyxHQUFHLElBQUksT0FBTyxFQUF1QixDQUFDO0lBRXpELGVBQWUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBRWxELEdBQUcsQ0FBQyxLQUFVO1FBQ1YsSUFBSSxLQUFLLEVBQUU7WUFDUCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNoQztJQUNMLENBQUM7dUdBVFEsY0FBYzsyR0FBZCxjQUFjLGNBREQsTUFBTTs7U0FDbkIsY0FBYzsyRkFBZCxjQUFjO2tCQUQxQixVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuL21lc3NhZ2UnO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIE92ZXJsYXlTZXJ2aWNlIHtcbiAgICBwcml2YXRlIGNsaWNrU291cmNlID0gbmV3IFN1YmplY3Q8TWVzc2FnZSB8IE1lc3NhZ2VbXT4oKTtcblxuICAgIGNsaWNrT2JzZXJ2YWJsZSA9IHRoaXMuY2xpY2tTb3VyY2UuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICBhZGQoZXZlbnQ6IGFueSkge1xuICAgICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuY2xpY2tTb3VyY2UubmV4dChldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=