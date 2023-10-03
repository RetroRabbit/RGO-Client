import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Methods used in confirmation service.
 * @group Service
 */
class ConfirmationService {
    requireConfirmationSource = new Subject();
    acceptConfirmationSource = new Subject();
    requireConfirmation$ = this.requireConfirmationSource.asObservable();
    accept = this.acceptConfirmationSource.asObservable();
    /**
     * Callback to invoke on confirm.
     * @param {Confirmation} confirmation - Represents a confirmation dialog configuration.
     * @group Method
     */
    confirm(confirmation) {
        this.requireConfirmationSource.next(confirmation);
        return this;
    }
    /**
     * Closes the dialog.
     * @group Method
     */
    close() {
        this.requireConfirmationSource.next(null);
        return this;
    }
    /**
     * Accepts the dialog.
     * @group Method
     */
    onAccept() {
        this.acceptConfirmationSource.next(null);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: ConfirmationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: ConfirmationService });
}
export { ConfirmationService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: ConfirmationService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlybWF0aW9uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9hcGkvY29uZmlybWF0aW9uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBRS9COzs7R0FHRztBQUNILE1BQ2EsbUJBQW1CO0lBQ3BCLHlCQUF5QixHQUFHLElBQUksT0FBTyxFQUF1QixDQUFDO0lBQy9ELHdCQUF3QixHQUFHLElBQUksT0FBTyxFQUF1QixDQUFDO0lBRXRFLG9CQUFvQixHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNyRSxNQUFNLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3REOzs7O09BSUc7SUFDSCxPQUFPLENBQUMsWUFBMEI7UUFDOUIsSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNsRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0Q7OztPQUdHO0lBQ0gsS0FBSztRQUNELElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNEOzs7T0FHRztJQUNILFFBQVE7UUFDSixJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdDLENBQUM7dUdBN0JRLG1CQUFtQjsyR0FBbkIsbUJBQW1COztTQUFuQixtQkFBbUI7MkZBQW5CLG1CQUFtQjtrQkFEL0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IENvbmZpcm1hdGlvbiB9IGZyb20gJy4vY29uZmlybWF0aW9uJztcbi8qKlxuICogTWV0aG9kcyB1c2VkIGluIGNvbmZpcm1hdGlvbiBzZXJ2aWNlLlxuICogQGdyb3VwIFNlcnZpY2VcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvbmZpcm1hdGlvblNlcnZpY2Uge1xuICAgIHByaXZhdGUgcmVxdWlyZUNvbmZpcm1hdGlvblNvdXJjZSA9IG5ldyBTdWJqZWN0PENvbmZpcm1hdGlvbiB8IG51bGw+KCk7XG4gICAgcHJpdmF0ZSBhY2NlcHRDb25maXJtYXRpb25Tb3VyY2UgPSBuZXcgU3ViamVjdDxDb25maXJtYXRpb24gfCBudWxsPigpO1xuXG4gICAgcmVxdWlyZUNvbmZpcm1hdGlvbiQgPSB0aGlzLnJlcXVpcmVDb25maXJtYXRpb25Tb3VyY2UuYXNPYnNlcnZhYmxlKCk7XG4gICAgYWNjZXB0ID0gdGhpcy5hY2NlcHRDb25maXJtYXRpb25Tb3VyY2UuYXNPYnNlcnZhYmxlKCk7XG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgdG8gaW52b2tlIG9uIGNvbmZpcm0uXG4gICAgICogQHBhcmFtIHtDb25maXJtYXRpb259IGNvbmZpcm1hdGlvbiAtIFJlcHJlc2VudHMgYSBjb25maXJtYXRpb24gZGlhbG9nIGNvbmZpZ3VyYXRpb24uXG4gICAgICogQGdyb3VwIE1ldGhvZFxuICAgICAqL1xuICAgIGNvbmZpcm0oY29uZmlybWF0aW9uOiBDb25maXJtYXRpb24pIHtcbiAgICAgICAgdGhpcy5yZXF1aXJlQ29uZmlybWF0aW9uU291cmNlLm5leHQoY29uZmlybWF0aW9uKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENsb3NlcyB0aGUgZGlhbG9nLlxuICAgICAqIEBncm91cCBNZXRob2RcbiAgICAgKi9cbiAgICBjbG9zZSgpIHtcbiAgICAgICAgdGhpcy5yZXF1aXJlQ29uZmlybWF0aW9uU291cmNlLm5leHQobnVsbCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBY2NlcHRzIHRoZSBkaWFsb2cuXG4gICAgICogQGdyb3VwIE1ldGhvZFxuICAgICAqL1xuICAgIG9uQWNjZXB0KCkge1xuICAgICAgICB0aGlzLmFjY2VwdENvbmZpcm1hdGlvblNvdXJjZS5uZXh0KG51bGwpO1xuICAgIH1cbn1cbiJdfQ==