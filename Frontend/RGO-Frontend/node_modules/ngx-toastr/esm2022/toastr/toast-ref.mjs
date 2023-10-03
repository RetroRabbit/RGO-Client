import { Subject } from 'rxjs';
/**
 * Reference to a toast opened via the Toastr service.
 */
export class ToastRef {
    _overlayRef;
    /** The instance of component opened into the toast. */
    componentInstance;
    /** Count of duplicates of this toast */
    duplicatesCount = 0;
    /** Subject for notifying the user that the toast has finished closing. */
    _afterClosed = new Subject();
    /** triggered when toast is activated */
    _activate = new Subject();
    /** notifies the toast that it should close before the timeout */
    _manualClose = new Subject();
    /** notifies the toast that it should reset the timeouts */
    _resetTimeout = new Subject();
    /** notifies the toast that it should count a duplicate toast */
    _countDuplicate = new Subject();
    constructor(_overlayRef) {
        this._overlayRef = _overlayRef;
    }
    manualClose() {
        this._manualClose.next();
        this._manualClose.complete();
    }
    manualClosed() {
        return this._manualClose.asObservable();
    }
    timeoutReset() {
        return this._resetTimeout.asObservable();
    }
    countDuplicate() {
        return this._countDuplicate.asObservable();
    }
    /**
     * Close the toast.
     */
    close() {
        this._overlayRef.detach();
        this._afterClosed.next();
        this._manualClose.next();
        this._afterClosed.complete();
        this._manualClose.complete();
        this._activate.complete();
        this._resetTimeout.complete();
        this._countDuplicate.complete();
    }
    /** Gets an observable that is notified when the toast is finished closing. */
    afterClosed() {
        return this._afterClosed.asObservable();
    }
    isInactive() {
        return this._activate.isStopped;
    }
    activate() {
        this._activate.next();
        this._activate.complete();
    }
    /** Gets an observable that is notified when the toast has started opening. */
    afterActivate() {
        return this._activate.asObservable();
    }
    /** Reset the toast timouts and count duplicates */
    onDuplicate(resetTimeout, countDuplicate) {
        if (resetTimeout) {
            this._resetTimeout.next();
        }
        if (countDuplicate) {
            this._countDuplicate.next(++this.duplicatesCount);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3QtcmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi90b2FzdHIvdG9hc3QtcmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFHM0M7O0dBRUc7QUFDSCxNQUFNLE9BQU8sUUFBUTtJQWtCQztJQWpCcEIsdURBQXVEO0lBQ3ZELGlCQUFpQixDQUFLO0lBRXRCLHdDQUF3QztJQUNoQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO0lBRTVCLDBFQUEwRTtJQUNsRSxZQUFZLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztJQUMzQyx3Q0FBd0M7SUFDaEMsU0FBUyxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7SUFDeEMsaUVBQWlFO0lBQ3pELFlBQVksR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO0lBQzNDLDJEQUEyRDtJQUNuRCxhQUFhLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztJQUM1QyxnRUFBZ0U7SUFDeEQsZUFBZSxHQUFHLElBQUksT0FBTyxFQUFVLENBQUM7SUFFaEQsWUFBb0IsV0FBdUI7UUFBdkIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7SUFBRyxDQUFDO0lBRS9DLFdBQVc7UUFDVCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVELFlBQVk7UUFDVixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDMUMsQ0FBQztJQUVELFlBQVk7UUFDVixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0MsQ0FBQztJQUVELGNBQWM7UUFDWixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDN0MsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSztRQUNILElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRUQsOEVBQThFO0lBQzlFLFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDMUMsQ0FBQztJQUVELFVBQVU7UUFDUixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRCw4RUFBOEU7SUFDOUUsYUFBYTtRQUNYLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0lBRUQsbURBQW1EO0lBQ25ELFdBQVcsQ0FBQyxZQUFxQixFQUFFLGNBQXVCO1FBQ3hELElBQUksWUFBWSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDM0I7UUFDRCxJQUFJLGNBQWMsRUFBRTtZQUNsQixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUNuRDtJQUNILENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IE92ZXJsYXlSZWYgfSBmcm9tICcuLi9vdmVybGF5L292ZXJsYXktcmVmJztcblxuLyoqXG4gKiBSZWZlcmVuY2UgdG8gYSB0b2FzdCBvcGVuZWQgdmlhIHRoZSBUb2FzdHIgc2VydmljZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFRvYXN0UmVmPFQ+IHtcbiAgLyoqIFRoZSBpbnN0YW5jZSBvZiBjb21wb25lbnQgb3BlbmVkIGludG8gdGhlIHRvYXN0LiAqL1xuICBjb21wb25lbnRJbnN0YW5jZSE6IFQ7XG5cbiAgLyoqIENvdW50IG9mIGR1cGxpY2F0ZXMgb2YgdGhpcyB0b2FzdCAqL1xuICBwcml2YXRlIGR1cGxpY2F0ZXNDb3VudCA9IDA7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGUgdXNlciB0aGF0IHRoZSB0b2FzdCBoYXMgZmluaXNoZWQgY2xvc2luZy4gKi9cbiAgcHJpdmF0ZSBfYWZ0ZXJDbG9zZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAvKiogdHJpZ2dlcmVkIHdoZW4gdG9hc3QgaXMgYWN0aXZhdGVkICovXG4gIHByaXZhdGUgX2FjdGl2YXRlID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgLyoqIG5vdGlmaWVzIHRoZSB0b2FzdCB0aGF0IGl0IHNob3VsZCBjbG9zZSBiZWZvcmUgdGhlIHRpbWVvdXQgKi9cbiAgcHJpdmF0ZSBfbWFudWFsQ2xvc2UgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAvKiogbm90aWZpZXMgdGhlIHRvYXN0IHRoYXQgaXQgc2hvdWxkIHJlc2V0IHRoZSB0aW1lb3V0cyAqL1xuICBwcml2YXRlIF9yZXNldFRpbWVvdXQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAvKiogbm90aWZpZXMgdGhlIHRvYXN0IHRoYXQgaXQgc2hvdWxkIGNvdW50IGEgZHVwbGljYXRlIHRvYXN0ICovXG4gIHByaXZhdGUgX2NvdW50RHVwbGljYXRlID0gbmV3IFN1YmplY3Q8bnVtYmVyPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX292ZXJsYXlSZWY6IE92ZXJsYXlSZWYpIHt9XG5cbiAgbWFudWFsQ2xvc2UoKSB7XG4gICAgdGhpcy5fbWFudWFsQ2xvc2UubmV4dCgpO1xuICAgIHRoaXMuX21hbnVhbENsb3NlLmNvbXBsZXRlKCk7XG4gIH1cblxuICBtYW51YWxDbG9zZWQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fbWFudWFsQ2xvc2UuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICB0aW1lb3V0UmVzZXQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fcmVzZXRUaW1lb3V0LmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgY291bnREdXBsaWNhdGUoKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcbiAgICByZXR1cm4gdGhpcy5fY291bnREdXBsaWNhdGUuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2UgdGhlIHRvYXN0LlxuICAgKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2goKTtcbiAgICB0aGlzLl9hZnRlckNsb3NlZC5uZXh0KCk7XG4gICAgdGhpcy5fbWFudWFsQ2xvc2UubmV4dCgpO1xuICAgIHRoaXMuX2FmdGVyQ2xvc2VkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fbWFudWFsQ2xvc2UuY29tcGxldGUoKTtcbiAgICB0aGlzLl9hY3RpdmF0ZS5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX3Jlc2V0VGltZW91dC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2NvdW50RHVwbGljYXRlLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgaXMgbm90aWZpZWQgd2hlbiB0aGUgdG9hc3QgaXMgZmluaXNoZWQgY2xvc2luZy4gKi9cbiAgYWZ0ZXJDbG9zZWQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fYWZ0ZXJDbG9zZWQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBpc0luYWN0aXZlKCkge1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmF0ZS5pc1N0b3BwZWQ7XG4gIH1cblxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLl9hY3RpdmF0ZS5uZXh0KCk7XG4gICAgdGhpcy5fYWN0aXZhdGUuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBpcyBub3RpZmllZCB3aGVuIHRoZSB0b2FzdCBoYXMgc3RhcnRlZCBvcGVuaW5nLiAqL1xuICBhZnRlckFjdGl2YXRlKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2YXRlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqIFJlc2V0IHRoZSB0b2FzdCB0aW1vdXRzIGFuZCBjb3VudCBkdXBsaWNhdGVzICovXG4gIG9uRHVwbGljYXRlKHJlc2V0VGltZW91dDogYm9vbGVhbiwgY291bnREdXBsaWNhdGU6IGJvb2xlYW4pIHtcbiAgICBpZiAocmVzZXRUaW1lb3V0KSB7XG4gICAgICB0aGlzLl9yZXNldFRpbWVvdXQubmV4dCgpO1xuICAgIH1cbiAgICBpZiAoY291bnREdXBsaWNhdGUpIHtcbiAgICAgIHRoaXMuX2NvdW50RHVwbGljYXRlLm5leHQoKyt0aGlzLmR1cGxpY2F0ZXNDb3VudCk7XG4gICAgfVxuICB9XG59XG4iXX0=