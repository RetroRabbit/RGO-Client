import { Subject } from 'rxjs';
/**
 * Dynamic Dialog instance.
 * @group Components
 */
export class DynamicDialogRef {
    constructor() { }
    /**
     * Closes dialog.
     * @group Method
     */
    close(result) {
        this._onClose.next(result);
        setTimeout(() => {
            this._onClose.complete();
        }, 1000);
    }
    /**
     * Destroys the dialog instance.
     * @group Method
     */
    destroy() {
        this._onDestroy.next(null);
    }
    /**
     * Callback to invoke on drag start.
     * @param {MouseEvent} event - Mouse event.
     * @group Method
     */
    dragStart(event) {
        this._onDragStart.next(event);
    }
    /**
     * Callback to invoke on drag end.
     * @param {MouseEvent} event - Mouse event.
     * @group Method
     */
    dragEnd(event) {
        this._onDragEnd.next(event);
    }
    /**
     * Callback to invoke on resize start.
     * @param {MouseEvent} event - Mouse event.
     * @group Method
     */
    resizeInit(event) {
        this._onResizeInit.next(event);
    }
    /**
     * Callback to invoke on resize start.
     * @param {MouseEvent} event - Mouse event.
     * @group Method
     */
    resizeEnd(event) {
        this._onResizeEnd.next(event);
    }
    /**
     * Callback to invoke on dialog is maximized.
     * @param {*} value - Size value.
     * @group Method
     */
    maximize(value) {
        this._onMaximize.next(value);
    }
    _onClose = new Subject();
    /**
     * Event triggered on dialog is closed.
     * @group Events
     */
    onClose = this._onClose.asObservable();
    _onDestroy = new Subject();
    /**
     * Event triggered on dialog instance is destroyed.
     * @group Events
     */
    onDestroy = this._onDestroy.asObservable();
    _onDragStart = new Subject();
    /**
     * Event triggered on drag start.
     * @param {MouseEvent} event - Mouse event.
     * @group Events
     */
    onDragStart = this._onDragStart.asObservable();
    _onDragEnd = new Subject();
    /**
     * Event triggered on drag end.
     * @param {MouseEvent} event - Mouse event.
     * @group Events
     */
    onDragEnd = this._onDragEnd.asObservable();
    _onResizeInit = new Subject();
    /**
     * Event triggered on resize start.
     * @param {MouseEvent} event - Mouse event.
     * @group Events
     */
    onResizeInit = this._onResizeInit.asObservable();
    _onResizeEnd = new Subject();
    /**
     * Event triggered on resize end.
     * @param {MouseEvent} event - Mouse event.
     * @group Events
     */
    onResizeEnd = this._onResizeEnd.asObservable();
    _onMaximize = new Subject();
    /**
     * Event triggered on resize end.
     * @param {*} value - Size value.
     * @group Events
     */
    onMaximize = this._onMaximize.asObservable();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pY2RpYWxvZy1yZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvZHluYW1pY2RpYWxvZy9keW5hbWljZGlhbG9nLXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNDOzs7R0FHRztBQUNILE1BQU0sT0FBTyxnQkFBZ0I7SUFDekIsZ0JBQWUsQ0FBQztJQUNoQjs7O09BR0c7SUFDSCxLQUFLLENBQUMsTUFBWTtRQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTNCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzdCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNiLENBQUM7SUFDRDs7O09BR0c7SUFDSCxPQUFPO1FBQ0gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNEOzs7O09BSUc7SUFDSCxTQUFTLENBQUMsS0FBaUI7UUFDdkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUNEOzs7O09BSUc7SUFDSCxPQUFPLENBQUMsS0FBaUI7UUFDckIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUNEOzs7O09BSUc7SUFDSCxVQUFVLENBQUMsS0FBaUI7UUFDeEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUNEOzs7O09BSUc7SUFDSCxTQUFTLENBQUMsS0FBaUI7UUFDdkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUNEOzs7O09BSUc7SUFDSCxRQUFRLENBQUMsS0FBVTtRQUNmLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFZ0IsUUFBUSxHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7SUFDL0M7OztPQUdHO0lBQ0gsT0FBTyxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBRXZDLFVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO0lBQ2pEOzs7T0FHRztJQUNILFNBQVMsR0FBb0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUUzQyxZQUFZLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztJQUNuRDs7OztPQUlHO0lBQ0gsV0FBVyxHQUFvQixJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBRS9DLFVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO0lBQ2pEOzs7O09BSUc7SUFDSCxTQUFTLEdBQW9CLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLENBQUM7SUFFM0MsYUFBYSxHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7SUFDcEQ7Ozs7T0FJRztJQUNILFlBQVksR0FBb0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUVqRCxZQUFZLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztJQUNuRDs7OztPQUlHO0lBQ0gsV0FBVyxHQUFvQixJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBRS9DLFdBQVcsR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO0lBQ2xEOzs7O09BSUc7SUFDSCxVQUFVLEdBQW9CLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUM7Q0FDakUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG4vKipcbiAqIER5bmFtaWMgRGlhbG9nIGluc3RhbmNlLlxuICogQGdyb3VwIENvbXBvbmVudHNcbiAqL1xuZXhwb3J0IGNsYXNzIER5bmFtaWNEaWFsb2dSZWYge1xuICAgIGNvbnN0cnVjdG9yKCkge31cbiAgICAvKipcbiAgICAgKiBDbG9zZXMgZGlhbG9nLlxuICAgICAqIEBncm91cCBNZXRob2RcbiAgICAgKi9cbiAgICBjbG9zZShyZXN1bHQ/OiBhbnkpIHtcbiAgICAgICAgdGhpcy5fb25DbG9zZS5uZXh0KHJlc3VsdCk7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9vbkNsb3NlLmNvbXBsZXRlKCk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEZXN0cm95cyB0aGUgZGlhbG9nIGluc3RhbmNlLlxuICAgICAqIEBncm91cCBNZXRob2RcbiAgICAgKi9cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLl9vbkRlc3Ryb3kubmV4dChudWxsKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgdG8gaW52b2tlIG9uIGRyYWcgc3RhcnQuXG4gICAgICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCAtIE1vdXNlIGV2ZW50LlxuICAgICAqIEBncm91cCBNZXRob2RcbiAgICAgKi9cbiAgICBkcmFnU3RhcnQoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgdGhpcy5fb25EcmFnU3RhcnQubmV4dChldmVudCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIHRvIGludm9rZSBvbiBkcmFnIGVuZC5cbiAgICAgKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IC0gTW91c2UgZXZlbnQuXG4gICAgICogQGdyb3VwIE1ldGhvZFxuICAgICAqL1xuICAgIGRyYWdFbmQoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgdGhpcy5fb25EcmFnRW5kLm5leHQoZXZlbnQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayB0byBpbnZva2Ugb24gcmVzaXplIHN0YXJ0LlxuICAgICAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgLSBNb3VzZSBldmVudC5cbiAgICAgKiBAZ3JvdXAgTWV0aG9kXG4gICAgICovXG4gICAgcmVzaXplSW5pdChldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICB0aGlzLl9vblJlc2l6ZUluaXQubmV4dChldmVudCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIHRvIGludm9rZSBvbiByZXNpemUgc3RhcnQuXG4gICAgICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCAtIE1vdXNlIGV2ZW50LlxuICAgICAqIEBncm91cCBNZXRob2RcbiAgICAgKi9cbiAgICByZXNpemVFbmQoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgdGhpcy5fb25SZXNpemVFbmQubmV4dChldmVudCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIHRvIGludm9rZSBvbiBkaWFsb2cgaXMgbWF4aW1pemVkLlxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgLSBTaXplIHZhbHVlLlxuICAgICAqIEBncm91cCBNZXRob2RcbiAgICAgKi9cbiAgICBtYXhpbWl6ZSh2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuX29uTWF4aW1pemUubmV4dCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWFkb25seSBfb25DbG9zZSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgICAvKipcbiAgICAgKiBFdmVudCB0cmlnZ2VyZWQgb24gZGlhbG9nIGlzIGNsb3NlZC5cbiAgICAgKiBAZ3JvdXAgRXZlbnRzXG4gICAgICovXG4gICAgb25DbG9zZTogT2JzZXJ2YWJsZTxhbnk+ID0gdGhpcy5fb25DbG9zZS5hc09ic2VydmFibGUoKTtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgX29uRGVzdHJveSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgICAvKipcbiAgICAgKiBFdmVudCB0cmlnZ2VyZWQgb24gZGlhbG9nIGluc3RhbmNlIGlzIGRlc3Ryb3llZC5cbiAgICAgKiBAZ3JvdXAgRXZlbnRzXG4gICAgICovXG4gICAgb25EZXN0cm95OiBPYnNlcnZhYmxlPGFueT4gPSB0aGlzLl9vbkRlc3Ryb3kuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IF9vbkRyYWdTdGFydCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgICAvKipcbiAgICAgKiBFdmVudCB0cmlnZ2VyZWQgb24gZHJhZyBzdGFydC5cbiAgICAgKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IC0gTW91c2UgZXZlbnQuXG4gICAgICogQGdyb3VwIEV2ZW50c1xuICAgICAqL1xuICAgIG9uRHJhZ1N0YXJ0OiBPYnNlcnZhYmxlPGFueT4gPSB0aGlzLl9vbkRyYWdTdGFydC5hc09ic2VydmFibGUoKTtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgX29uRHJhZ0VuZCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgICAvKipcbiAgICAgKiBFdmVudCB0cmlnZ2VyZWQgb24gZHJhZyBlbmQuXG4gICAgICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCAtIE1vdXNlIGV2ZW50LlxuICAgICAqIEBncm91cCBFdmVudHNcbiAgICAgKi9cbiAgICBvbkRyYWdFbmQ6IE9ic2VydmFibGU8YW55PiA9IHRoaXMuX29uRHJhZ0VuZC5hc09ic2VydmFibGUoKTtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgX29uUmVzaXplSW5pdCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgICAvKipcbiAgICAgKiBFdmVudCB0cmlnZ2VyZWQgb24gcmVzaXplIHN0YXJ0LlxuICAgICAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgLSBNb3VzZSBldmVudC5cbiAgICAgKiBAZ3JvdXAgRXZlbnRzXG4gICAgICovXG4gICAgb25SZXNpemVJbml0OiBPYnNlcnZhYmxlPGFueT4gPSB0aGlzLl9vblJlc2l6ZUluaXQuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IF9vblJlc2l6ZUVuZCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgICAvKipcbiAgICAgKiBFdmVudCB0cmlnZ2VyZWQgb24gcmVzaXplIGVuZC5cbiAgICAgKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IC0gTW91c2UgZXZlbnQuXG4gICAgICogQGdyb3VwIEV2ZW50c1xuICAgICAqL1xuICAgIG9uUmVzaXplRW5kOiBPYnNlcnZhYmxlPGFueT4gPSB0aGlzLl9vblJlc2l6ZUVuZC5hc09ic2VydmFibGUoKTtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgX29uTWF4aW1pemUgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG4gICAgLyoqXG4gICAgICogRXZlbnQgdHJpZ2dlcmVkIG9uIHJlc2l6ZSBlbmQuXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSAtIFNpemUgdmFsdWUuXG4gICAgICogQGdyb3VwIEV2ZW50c1xuICAgICAqL1xuICAgIG9uTWF4aW1pemU6IE9ic2VydmFibGU8YW55PiA9IHRoaXMuX29uTWF4aW1pemUuYXNPYnNlcnZhYmxlKCk7XG59XG4iXX0=