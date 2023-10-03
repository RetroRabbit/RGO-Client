import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Message service used in messages and toast components.
 * @group Service
 */
class MessageService {
    messageSource = new Subject();
    clearSource = new Subject();
    messageObserver = this.messageSource.asObservable();
    clearObserver = this.clearSource.asObservable();
    /**
     * Inserts single message.
     * @param {Message} message - Message to be added.
     * @group Method
     */
    add(message) {
        if (message) {
            this.messageSource.next(message);
        }
    }
    /**
     * Insterts new messages.
     * @param {Message[]} messages - Messages to be added.
     * @group Method
     */
    addAll(messages) {
        if (messages && messages.length) {
            this.messageSource.next(messages);
        }
    }
    /**
     * Clears the message with the given key.
     * @param {string} key - Key of the message to be cleared.
     * @group Method
     */
    clear(key) {
        this.clearSource.next(key || null);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: MessageService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: MessageService });
}
export { MessageService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: MessageService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvYXBpL21lc3NhZ2VzZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFFL0I7OztHQUdHO0FBQ0gsTUFDYSxjQUFjO0lBQ2YsYUFBYSxHQUFHLElBQUksT0FBTyxFQUF1QixDQUFDO0lBQ25ELFdBQVcsR0FBRyxJQUFJLE9BQU8sRUFBaUIsQ0FBQztJQUVuRCxlQUFlLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNwRCxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNoRDs7OztPQUlHO0lBQ0gsR0FBRyxDQUFDLE9BQWdCO1FBQ2hCLElBQUksT0FBTyxFQUFFO1lBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDcEM7SUFDTCxDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxRQUFtQjtRQUN0QixJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFO1lBQzdCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3JDO0lBQ0wsQ0FBQztJQUNEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsR0FBWTtRQUNkLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDO3VHQWpDUSxjQUFjOzJHQUFkLGNBQWM7O1NBQWQsY0FBYzsyRkFBZCxjQUFjO2tCQUQxQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4vbWVzc2FnZSc7XG4vKipcbiAqIE1lc3NhZ2Ugc2VydmljZSB1c2VkIGluIG1lc3NhZ2VzIGFuZCB0b2FzdCBjb21wb25lbnRzLlxuICogQGdyb3VwIFNlcnZpY2VcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VTZXJ2aWNlIHtcbiAgICBwcml2YXRlIG1lc3NhZ2VTb3VyY2UgPSBuZXcgU3ViamVjdDxNZXNzYWdlIHwgTWVzc2FnZVtdPigpO1xuICAgIHByaXZhdGUgY2xlYXJTb3VyY2UgPSBuZXcgU3ViamVjdDxzdHJpbmcgfCBudWxsPigpO1xuXG4gICAgbWVzc2FnZU9ic2VydmVyID0gdGhpcy5tZXNzYWdlU291cmNlLmFzT2JzZXJ2YWJsZSgpO1xuICAgIGNsZWFyT2JzZXJ2ZXIgPSB0aGlzLmNsZWFyU291cmNlLmFzT2JzZXJ2YWJsZSgpO1xuICAgIC8qKlxuICAgICAqIEluc2VydHMgc2luZ2xlIG1lc3NhZ2UuXG4gICAgICogQHBhcmFtIHtNZXNzYWdlfSBtZXNzYWdlIC0gTWVzc2FnZSB0byBiZSBhZGRlZC5cbiAgICAgKiBAZ3JvdXAgTWV0aG9kXG4gICAgICovXG4gICAgYWRkKG1lc3NhZ2U6IE1lc3NhZ2UpIHtcbiAgICAgICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZVNvdXJjZS5uZXh0KG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluc3RlcnRzIG5ldyBtZXNzYWdlcy5cbiAgICAgKiBAcGFyYW0ge01lc3NhZ2VbXX0gbWVzc2FnZXMgLSBNZXNzYWdlcyB0byBiZSBhZGRlZC5cbiAgICAgKiBAZ3JvdXAgTWV0aG9kXG4gICAgICovXG4gICAgYWRkQWxsKG1lc3NhZ2VzOiBNZXNzYWdlW10pIHtcbiAgICAgICAgaWYgKG1lc3NhZ2VzICYmIG1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlU291cmNlLm5leHQobWVzc2FnZXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENsZWFycyB0aGUgbWVzc2FnZSB3aXRoIHRoZSBnaXZlbiBrZXkuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIEtleSBvZiB0aGUgbWVzc2FnZSB0byBiZSBjbGVhcmVkLlxuICAgICAqIEBncm91cCBNZXRob2RcbiAgICAgKi9cbiAgICBjbGVhcihrZXk/OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jbGVhclNvdXJjZS5uZXh0KGtleSB8fCBudWxsKTtcbiAgICB9XG59XG4iXX0=