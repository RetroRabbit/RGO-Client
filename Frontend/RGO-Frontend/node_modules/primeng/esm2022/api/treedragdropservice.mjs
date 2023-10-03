import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
class TreeDragDropService {
    dragStartSource = new Subject();
    dragStopSource = new Subject();
    dragStart$ = this.dragStartSource.asObservable();
    dragStop$ = this.dragStopSource.asObservable();
    startDrag(event) {
        this.dragStartSource.next(event);
    }
    stopDrag(event) {
        this.dragStopSource.next(event);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: TreeDragDropService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: TreeDragDropService });
}
export { TreeDragDropService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: TreeDragDropService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZWRyYWdkcm9wc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9hcGkvdHJlZWRyYWdkcm9wc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBRy9CLE1BQ2EsbUJBQW1CO0lBQ3BCLGVBQWUsR0FBRyxJQUFJLE9BQU8sRUFBcUIsQ0FBQztJQUNuRCxjQUFjLEdBQUcsSUFBSSxPQUFPLEVBQXFCLENBQUM7SUFFMUQsVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDakQsU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLENBQUM7SUFFL0MsU0FBUyxDQUFDLEtBQXdCO1FBQzlCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBd0I7UUFDN0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEMsQ0FBQzt1R0FiUSxtQkFBbUI7MkdBQW5CLG1CQUFtQjs7U0FBbkIsbUJBQW1COzJGQUFuQixtQkFBbUI7a0JBRC9CLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBUcmVlTm9kZURyYWdFdmVudCB9IGZyb20gJy4vdHJlZW5vZGVkcmFnZXZlbnQnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVHJlZURyYWdEcm9wU2VydmljZSB7XG4gICAgcHJpdmF0ZSBkcmFnU3RhcnRTb3VyY2UgPSBuZXcgU3ViamVjdDxUcmVlTm9kZURyYWdFdmVudD4oKTtcbiAgICBwcml2YXRlIGRyYWdTdG9wU291cmNlID0gbmV3IFN1YmplY3Q8VHJlZU5vZGVEcmFnRXZlbnQ+KCk7XG5cbiAgICBkcmFnU3RhcnQkID0gdGhpcy5kcmFnU3RhcnRTb3VyY2UuYXNPYnNlcnZhYmxlKCk7XG4gICAgZHJhZ1N0b3AkID0gdGhpcy5kcmFnU3RvcFNvdXJjZS5hc09ic2VydmFibGUoKTtcblxuICAgIHN0YXJ0RHJhZyhldmVudDogVHJlZU5vZGVEcmFnRXZlbnQpIHtcbiAgICAgICAgdGhpcy5kcmFnU3RhcnRTb3VyY2UubmV4dChldmVudCk7XG4gICAgfVxuXG4gICAgc3RvcERyYWcoZXZlbnQ6IFRyZWVOb2RlRHJhZ0V2ZW50KSB7XG4gICAgICAgIHRoaXMuZHJhZ1N0b3BTb3VyY2UubmV4dChldmVudCk7XG4gICAgfVxufVxuIl19