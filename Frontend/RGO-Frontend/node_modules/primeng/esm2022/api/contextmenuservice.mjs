import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
class ContextMenuService {
    activeItemKeyChange = new Subject();
    activeItemKeyChange$ = this.activeItemKeyChange.asObservable();
    activeItemKey;
    changeKey(key) {
        this.activeItemKey = key;
        this.activeItemKeyChange.next(this.activeItemKey);
    }
    reset() {
        this.activeItemKey = null;
        this.activeItemKeyChange.next(this.activeItemKey);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: ContextMenuService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: ContextMenuService });
}
export { ContextMenuService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: ContextMenuService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dG1lbnVzZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2FwaS9jb250ZXh0bWVudXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQUUvQixNQUNhLGtCQUFrQjtJQUNuQixtQkFBbUIsR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFDO0lBRXBELG9CQUFvQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUUvRCxhQUFhLENBQW1CO0lBRWhDLFNBQVMsQ0FBQyxHQUFXO1FBQ2pCLElBQUksQ0FBQyxhQUFhLEdBQUcsR0FBRyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQXVCLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsS0FBSztRQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQW9CLENBQUMsQ0FBQztJQUM3RCxDQUFDO3VHQWZRLGtCQUFrQjsyR0FBbEIsa0JBQWtCOztTQUFsQixrQkFBa0I7MkZBQWxCLGtCQUFrQjtrQkFEOUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE51bGxhYmxlIH0gZnJvbSAncHJpbWVuZy90cy1oZWxwZXJzJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvbnRleHRNZW51U2VydmljZSB7XG4gICAgcHJpdmF0ZSBhY3RpdmVJdGVtS2V5Q2hhbmdlID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuXG4gICAgYWN0aXZlSXRlbUtleUNoYW5nZSQgPSB0aGlzLmFjdGl2ZUl0ZW1LZXlDaGFuZ2UuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICBhY3RpdmVJdGVtS2V5OiBOdWxsYWJsZTxzdHJpbmc+O1xuXG4gICAgY2hhbmdlS2V5KGtleTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlSXRlbUtleSA9IGtleTtcbiAgICAgICAgdGhpcy5hY3RpdmVJdGVtS2V5Q2hhbmdlLm5leHQodGhpcy5hY3RpdmVJdGVtS2V5IGFzIHN0cmluZyk7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlSXRlbUtleSA9IG51bGw7XG4gICAgICAgIHRoaXMuYWN0aXZlSXRlbUtleUNoYW5nZS5uZXh0KHRoaXMuYWN0aXZlSXRlbUtleSBhcyBhbnkpO1xuICAgIH1cbn1cbiJdfQ==