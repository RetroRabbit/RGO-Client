/**
 * Dialogs can be created dynamically with any component as the content using a DialogService.
 * @group Components
 */
export class DynamicDialogConfig {
    /**
     * An object to pass to the component loaded inside the Dialog.
     * @group Props
     */
    data;
    /**
     * Header text of the dialog.
     * @group Props
     */
    header;
    /**
     * Identifies the element (or elements) that labels the element it is applied to.
     * @group Props
     */
    ariaLabelledBy;
    /**
     * Footer text of the dialog.
     * @group Props
     */
    footer;
    /**
     * Width of the dialog.
     * @group Props
     */
    width;
    /**
     * Height of the dialog.
     * @group Props
     */
    height;
    /**
     * Specifies if pressing escape key should hide the dialog.
     * @group Props
     */
    closeOnEscape;
    /**
     * Base zIndex value to use in layering.
     * @group Props
     */
    baseZIndex;
    /**
     * Whether to automatically manage layering.
     * @group Props
     */
    autoZIndex;
    /**
     * Specifies if clicking the modal background should hide the dialog.
     * @group Props
     */
    dismissableMask;
    /**
     * Inline style of the component.
     * @group Props
     */
    rtl;
    /**
     * Inline style of the comopnent.
     * @group Props
     */
    style;
    /**
     * Inline style of the content.
     * @group Props
     */
    contentStyle;
    /**
     * Style class of the component.
     * @group Props
     */
    styleClass;
    /**
     * Transition options of the animation.
     * @group Props
     */
    transitionOptions;
    /**
     * Adds a close icon to the header to hide the dialog.
     * @group Props
     */
    closable;
    /**
     * Whether to show the header or not.
     * @group Props
     */
    showHeader;
    /**
     * Defines if background should be blocked when dialog is displayed.
     * @group Props
     */
    modal;
    /**
     * Style class of the mask.
     * @group Props
     */
    maskStyleClass;
    /**
     * Enables resizing of the content.
     * @group Props
     */
    resizable;
    /**
     * Enables dragging to change the position using header.
     * @group Props
     */
    draggable;
    /**
     * Keeps dialog in the viewport.
     * @group Props
     */
    keepInViewport;
    /**
     * Minimum value for the left coordinate of dialog in dragging.
     * @group Props
     */
    minX;
    /**
     * Minimum value for the top coordinate of dialog in dragging.
     * @group Props
     */
    minY;
    /**
     * Whether the dialog can be displayed full screen.
     * @group Props
     */
    maximizable;
    /**
     * Name of the maximize icon.
     * @group Props
     */
    maximizeIcon;
    /**
     * Name of the minimize icon.
     * @group Props
     */
    minimizeIcon;
    /**
     * Position of the dialog, options are "center", "top", "bottom", "left", "right", "top-left", "top-right", "bottom-left" or "bottom-right".
     * @group Props
     */
    position;
    /**
     * Defines a string that labels the close button for accessibility.
     * @group Props
     */
    closeAriaLabel;
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @group Props
     */
    appendTo;
    /**
     * A boolean to determine if it can be duplicate.
     * @group Props
     */
    duplicate;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pY2RpYWxvZy1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvZHluYW1pY2RpYWxvZy9keW5hbWljZGlhbG9nLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sbUJBQW1CO0lBQzVCOzs7T0FHRztJQUNILElBQUksQ0FBSztJQUNUOzs7T0FHRztJQUNILE1BQU0sQ0FBVTtJQUNoQjs7O09BR0c7SUFDSCxjQUFjLENBQVU7SUFDeEI7OztPQUdHO0lBQ0gsTUFBTSxDQUFVO0lBQ2hCOzs7T0FHRztJQUNILEtBQUssQ0FBVTtJQUNmOzs7T0FHRztJQUNILE1BQU0sQ0FBVTtJQUNoQjs7O09BR0c7SUFDSCxhQUFhLENBQVc7SUFDeEI7OztPQUdHO0lBQ0gsVUFBVSxDQUFVO0lBQ3BCOzs7T0FHRztJQUNILFVBQVUsQ0FBVztJQUNyQjs7O09BR0c7SUFDSCxlQUFlLENBQVc7SUFDMUI7OztPQUdHO0lBQ0gsR0FBRyxDQUFXO0lBQ2Q7OztPQUdHO0lBQ0gsS0FBSyxDQUErQztJQUNwRDs7O09BR0c7SUFDSCxZQUFZLENBQStDO0lBQzNEOzs7T0FHRztJQUNILFVBQVUsQ0FBVTtJQUNwQjs7O09BR0c7SUFDSCxpQkFBaUIsQ0FBVTtJQUMzQjs7O09BR0c7SUFDSCxRQUFRLENBQVc7SUFDbkI7OztPQUdHO0lBQ0gsVUFBVSxDQUFXO0lBQ3JCOzs7T0FHRztJQUNILEtBQUssQ0FBVztJQUNoQjs7O09BR0c7SUFDSCxjQUFjLENBQVU7SUFDeEI7OztPQUdHO0lBQ0gsU0FBUyxDQUFXO0lBQ3BCOzs7T0FHRztJQUNILFNBQVMsQ0FBVztJQUNwQjs7O09BR0c7SUFDSCxjQUFjLENBQVc7SUFDekI7OztPQUdHO0lBQ0gsSUFBSSxDQUFVO0lBQ2Q7OztPQUdHO0lBQ0gsSUFBSSxDQUFVO0lBQ2Q7OztPQUdHO0lBQ0gsV0FBVyxDQUFXO0lBQ3RCOzs7T0FHRztJQUNILFlBQVksQ0FBVTtJQUN0Qjs7O09BR0c7SUFDSCxZQUFZLENBQVU7SUFDdEI7OztPQUdHO0lBQ0gsUUFBUSxDQUFVO0lBQ2xCOzs7T0FHRztJQUNILGNBQWMsQ0FBVTtJQUN4Qjs7O09BR0c7SUFDSCxRQUFRLENBQU87SUFDZjs7O09BR0c7SUFDSCxTQUFTLENBQVc7Q0FDdkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERpYWxvZ3MgY2FuIGJlIGNyZWF0ZWQgZHluYW1pY2FsbHkgd2l0aCBhbnkgY29tcG9uZW50IGFzIHRoZSBjb250ZW50IHVzaW5nIGEgRGlhbG9nU2VydmljZS5cbiAqIEBncm91cCBDb21wb25lbnRzXG4gKi9cbmV4cG9ydCBjbGFzcyBEeW5hbWljRGlhbG9nQ29uZmlnPFQgPSBhbnk+IHtcbiAgICAvKipcbiAgICAgKiBBbiBvYmplY3QgdG8gcGFzcyB0byB0aGUgY29tcG9uZW50IGxvYWRlZCBpbnNpZGUgdGhlIERpYWxvZy5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBkYXRhPzogVDtcbiAgICAvKipcbiAgICAgKiBIZWFkZXIgdGV4dCBvZiB0aGUgZGlhbG9nLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIGhlYWRlcj86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBJZGVudGlmaWVzIHRoZSBlbGVtZW50IChvciBlbGVtZW50cykgdGhhdCBsYWJlbHMgdGhlIGVsZW1lbnQgaXQgaXMgYXBwbGllZCB0by5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBhcmlhTGFiZWxsZWRCeT86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBGb290ZXIgdGV4dCBvZiB0aGUgZGlhbG9nLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIGZvb3Rlcj86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBXaWR0aCBvZiB0aGUgZGlhbG9nLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIHdpZHRoPzogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIEhlaWdodCBvZiB0aGUgZGlhbG9nLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIGhlaWdodD86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBTcGVjaWZpZXMgaWYgcHJlc3NpbmcgZXNjYXBlIGtleSBzaG91bGQgaGlkZSB0aGUgZGlhbG9nLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIGNsb3NlT25Fc2NhcGU/OiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIEJhc2UgekluZGV4IHZhbHVlIHRvIHVzZSBpbiBsYXllcmluZy5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBiYXNlWkluZGV4PzogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdG8gYXV0b21hdGljYWxseSBtYW5hZ2UgbGF5ZXJpbmcuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgYXV0b1pJbmRleD86IGJvb2xlYW47XG4gICAgLyoqXG4gICAgICogU3BlY2lmaWVzIGlmIGNsaWNraW5nIHRoZSBtb2RhbCBiYWNrZ3JvdW5kIHNob3VsZCBoaWRlIHRoZSBkaWFsb2cuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgZGlzbWlzc2FibGVNYXNrPzogYm9vbGVhbjtcbiAgICAvKipcbiAgICAgKiBJbmxpbmUgc3R5bGUgb2YgdGhlIGNvbXBvbmVudC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBydGw/OiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIElubGluZSBzdHlsZSBvZiB0aGUgY29tb3BuZW50LlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIHN0eWxlPzogeyBba2xhc3M6IHN0cmluZ106IGFueSB9IHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBJbmxpbmUgc3R5bGUgb2YgdGhlIGNvbnRlbnQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgY29udGVudFN0eWxlPzogeyBba2xhc3M6IHN0cmluZ106IGFueSB9IHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBTdHlsZSBjbGFzcyBvZiB0aGUgY29tcG9uZW50LlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIHN0eWxlQ2xhc3M/OiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogVHJhbnNpdGlvbiBvcHRpb25zIG9mIHRoZSBhbmltYXRpb24uXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgdHJhbnNpdGlvbk9wdGlvbnM/OiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogQWRkcyBhIGNsb3NlIGljb24gdG8gdGhlIGhlYWRlciB0byBoaWRlIHRoZSBkaWFsb2cuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgY2xvc2FibGU/OiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdG8gc2hvdyB0aGUgaGVhZGVyIG9yIG5vdC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBzaG93SGVhZGVyPzogYm9vbGVhbjtcbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGlmIGJhY2tncm91bmQgc2hvdWxkIGJlIGJsb2NrZWQgd2hlbiBkaWFsb2cgaXMgZGlzcGxheWVkLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIG1vZGFsPzogYm9vbGVhbjtcbiAgICAvKipcbiAgICAgKiBTdHlsZSBjbGFzcyBvZiB0aGUgbWFzay5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBtYXNrU3R5bGVDbGFzcz86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBFbmFibGVzIHJlc2l6aW5nIG9mIHRoZSBjb250ZW50LlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIHJlc2l6YWJsZT86IGJvb2xlYW47XG4gICAgLyoqXG4gICAgICogRW5hYmxlcyBkcmFnZ2luZyB0byBjaGFuZ2UgdGhlIHBvc2l0aW9uIHVzaW5nIGhlYWRlci5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBkcmFnZ2FibGU/OiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIEtlZXBzIGRpYWxvZyBpbiB0aGUgdmlld3BvcnQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAga2VlcEluVmlld3BvcnQ/OiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIE1pbmltdW0gdmFsdWUgZm9yIHRoZSBsZWZ0IGNvb3JkaW5hdGUgb2YgZGlhbG9nIGluIGRyYWdnaW5nLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIG1pblg/OiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogTWluaW11bSB2YWx1ZSBmb3IgdGhlIHRvcCBjb29yZGluYXRlIG9mIGRpYWxvZyBpbiBkcmFnZ2luZy5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBtaW5ZPzogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhlIGRpYWxvZyBjYW4gYmUgZGlzcGxheWVkIGZ1bGwgc2NyZWVuLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIG1heGltaXphYmxlPzogYm9vbGVhbjtcbiAgICAvKipcbiAgICAgKiBOYW1lIG9mIHRoZSBtYXhpbWl6ZSBpY29uLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIG1heGltaXplSWNvbj86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBOYW1lIG9mIHRoZSBtaW5pbWl6ZSBpY29uLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIG1pbmltaXplSWNvbj86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBQb3NpdGlvbiBvZiB0aGUgZGlhbG9nLCBvcHRpb25zIGFyZSBcImNlbnRlclwiLCBcInRvcFwiLCBcImJvdHRvbVwiLCBcImxlZnRcIiwgXCJyaWdodFwiLCBcInRvcC1sZWZ0XCIsIFwidG9wLXJpZ2h0XCIsIFwiYm90dG9tLWxlZnRcIiBvciBcImJvdHRvbS1yaWdodFwiLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIHBvc2l0aW9uPzogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIERlZmluZXMgYSBzdHJpbmcgdGhhdCBsYWJlbHMgdGhlIGNsb3NlIGJ1dHRvbiBmb3IgYWNjZXNzaWJpbGl0eS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBjbG9zZUFyaWFMYWJlbD86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBUYXJnZXQgZWxlbWVudCB0byBhdHRhY2ggdGhlIG92ZXJsYXksIHZhbGlkIHZhbHVlcyBhcmUgXCJib2R5XCIgb3IgYSBsb2NhbCBuZy10ZW1wbGF0ZSB2YXJpYWJsZSBvZiBhbm90aGVyIGVsZW1lbnQgKG5vdGU6IHVzZSBiaW5kaW5nIHdpdGggYnJhY2tldHMgZm9yIHRlbXBsYXRlIHZhcmlhYmxlcywgZS5nLiBbYXBwZW5kVG9dPVwibXlkaXZcIiBmb3IgYSBkaXYgZWxlbWVudCBoYXZpbmcgI215ZGl2IGFzIHZhcmlhYmxlIG5hbWUpLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIGFwcGVuZFRvPzogYW55O1xuICAgIC8qKlxuICAgICAqIEEgYm9vbGVhbiB0byBkZXRlcm1pbmUgaWYgaXQgY2FuIGJlIGR1cGxpY2F0ZS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBkdXBsaWNhdGU/OiBib29sZWFuO1xufVxuIl19