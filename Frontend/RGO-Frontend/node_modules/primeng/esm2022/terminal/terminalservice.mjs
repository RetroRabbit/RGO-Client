import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
class TerminalService {
    commandSource = new Subject();
    responseSource = new Subject();
    commandHandler = this.commandSource.asObservable();
    responseHandler = this.responseSource.asObservable();
    sendCommand(command) {
        if (command) {
            this.commandSource.next(command);
        }
    }
    sendResponse(response) {
        if (response) {
            this.responseSource.next(response);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: TerminalService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: TerminalService });
}
export { TerminalService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: TerminalService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVybWluYWxzZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3Rlcm1pbmFsL3Rlcm1pbmFsc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBRS9CLE1BQ2EsZUFBZTtJQUNoQixhQUFhLEdBQUcsSUFBSSxPQUFPLEVBQVUsQ0FBQztJQUN0QyxjQUFjLEdBQUcsSUFBSSxPQUFPLEVBQVUsQ0FBQztJQUUvQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNuRCxlQUFlLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUVyRCxXQUFXLENBQUMsT0FBZTtRQUN2QixJQUFJLE9BQU8sRUFBRTtZQUNULElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3BDO0lBQ0wsQ0FBQztJQUVELFlBQVksQ0FBQyxRQUFnQjtRQUN6QixJQUFJLFFBQVEsRUFBRTtZQUNWLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3RDO0lBQ0wsQ0FBQzt1R0FqQlEsZUFBZTsyR0FBZixlQUFlOztTQUFmLGVBQWU7MkZBQWYsZUFBZTtrQkFEM0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFRlcm1pbmFsU2VydmljZSB7XG4gICAgcHJpdmF0ZSBjb21tYW5kU291cmNlID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICAgIHByaXZhdGUgcmVzcG9uc2VTb3VyY2UgPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG5cbiAgICBjb21tYW5kSGFuZGxlciA9IHRoaXMuY29tbWFuZFNvdXJjZS5hc09ic2VydmFibGUoKTtcbiAgICByZXNwb25zZUhhbmRsZXIgPSB0aGlzLnJlc3BvbnNlU291cmNlLmFzT2JzZXJ2YWJsZSgpO1xuXG4gICAgc2VuZENvbW1hbmQoY29tbWFuZDogc3RyaW5nKSB7XG4gICAgICAgIGlmIChjb21tYW5kKSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRTb3VyY2UubmV4dChjb21tYW5kKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbmRSZXNwb25zZShyZXNwb25zZTogc3RyaW5nKSB7XG4gICAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNwb25zZVNvdXJjZS5uZXh0KHJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==