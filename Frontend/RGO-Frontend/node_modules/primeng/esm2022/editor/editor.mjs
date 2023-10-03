import { NgModule, Component, Input, Output, EventEmitter, ContentChild, forwardRef, ChangeDetectionStrategy, ViewEncapsulation, ContentChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule, Header, PrimeTemplate } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
//@ts-ignore
import Quill from 'quill';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export const EDITOR_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Editor),
    multi: true
};
/**
 * Editor groups a collection of contents in tabs.
 * @group Components
 */
class Editor {
    el;
    /**
     * Inline style of the container.
     * @group Props
     */
    style;
    /**
     * Style class of the container.
     * @group Props
     */
    styleClass;
    /**
     * Placeholder text to show when editor is empty.
     * @group Props
     */
    placeholder;
    /**
     * Whitelist of formats to display, see here for available options.
     * @group Props
     */
    formats;
    /**
     * Modules configuration of Editor, see here for available options.
     * @group Props
     */
    modules;
    /**
     * DOM Element or a CSS selector for a DOM Element, within which the editor’s p elements (i.e. tooltips, etc.) should be confined. Currently, it only considers left and right boundaries.
     * @group Props
     */
    bounds;
    /**
     * DOM Element or a CSS selector for a DOM Element, specifying which container has the scrollbars (i.e. overflow-y: auto), if is has been changed from the default ql-editor with custom CSS. Necessary to fix scroll jumping bugs when Quill is set to auto grow its height, and another ancestor container is responsible from the scrolling..
     * @group Props
     */
    scrollingContainer;
    /**
     * Shortcut for debug. Note debug is a static method and will affect other instances of Quill editors on the page. Only warning and error messages are enabled by default.
     * @group Props
     */
    debug;
    /**
     * Whether to instantiate the editor to read-only mode.
     * @group Props
     */
    get readonly() {
        return this._readonly;
    }
    set readonly(val) {
        this._readonly = val;
        if (this.quill) {
            if (this._readonly)
                this.quill.disable();
            else
                this.quill.enable();
        }
    }
    /**
     * Callback to invoke when the quill modules are loaded.
     * @param {EditorInitEvent} event - custom event.
     * @group Emits
     */
    onInit = new EventEmitter();
    /**
     * Callback to invoke when text of editor changes.
     * @param {EditorTextChangeEvent} event - custom event.
     * @group Emits
     */
    onTextChange = new EventEmitter();
    /**
     * Callback to invoke when selection of the text changes.
     * @param {EditorSelectionChangeEvent} event - custom event.
     * @group Emits
     */
    onSelectionChange = new EventEmitter();
    templates;
    toolbar;
    value;
    delayedCommand = null;
    _readonly = false;
    onModelChange = () => { };
    onModelTouched = () => { };
    quill;
    headerTemplate;
    get isAttachedQuillEditorToDOM() {
        return this.quillElements?.editorElement?.isConnected;
    }
    quillElements;
    constructor(el) {
        this.el = el;
    }
    ngAfterViewInit() {
        this.initQuillElements();
        if (this.isAttachedQuillEditorToDOM) {
            this.initQuillEditor();
        }
    }
    ngAfterViewChecked() {
        // The problem is inside the `quill` library, we need to wait for a new release.
        // Function `isLine` - used `getComputedStyle`, it was rewritten in the next release.
        // (We need to wait for a release higher than 1.3.7).
        // These checks and code can be removed.
        if (!this.quill && this.isAttachedQuillEditorToDOM) {
            this.initQuillEditor();
        }
        // Can also be deleted after updating `quill`.
        if (this.delayedCommand && this.isAttachedQuillEditorToDOM) {
            this.delayedCommand();
            this.delayedCommand = null;
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'header':
                    this.headerTemplate = item.template;
                    break;
            }
        });
    }
    writeValue(value) {
        this.value = value;
        if (this.quill) {
            if (value) {
                const command = () => {
                    this.quill.setContents(this.quill.clipboard.convert(this.value));
                };
                if (this.isAttachedQuillEditorToDOM) {
                    command();
                }
                else {
                    this.delayedCommand = command;
                }
            }
            else {
                const command = () => {
                    this.quill.setText('');
                };
                if (this.isAttachedQuillEditorToDOM) {
                    command();
                }
                else {
                    this.delayedCommand = command;
                }
            }
        }
    }
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    getQuill() {
        return this.quill;
    }
    initQuillEditor() {
        this.initQuillElements();
        const { toolbarElement, editorElement } = this.quillElements;
        let defaultModule = { toolbar: toolbarElement };
        let modules = this.modules ? { ...defaultModule, ...this.modules } : defaultModule;
        this.quill = new Quill(editorElement, {
            modules: modules,
            placeholder: this.placeholder,
            readOnly: this.readonly,
            theme: 'snow',
            formats: this.formats,
            bounds: this.bounds,
            debug: this.debug,
            scrollingContainer: this.scrollingContainer
        });
        if (this.value) {
            this.quill.setContents(this.quill.clipboard.convert(this.value));
        }
        this.quill.on('text-change', (delta, oldContents, source) => {
            if (source === 'user') {
                let html = DomHandler.findSingle(editorElement, '.ql-editor').innerHTML;
                let text = this.quill.getText().trim();
                if (html === '<p><br></p>') {
                    html = null;
                }
                this.onTextChange.emit({
                    htmlValue: html,
                    textValue: text,
                    delta: delta,
                    source: source
                });
                this.onModelChange(html);
                this.onModelTouched();
            }
        });
        this.quill.on('selection-change', (range, oldRange, source) => {
            this.onSelectionChange.emit({
                range: range,
                oldRange: oldRange,
                source: source
            });
        });
        this.onInit.emit({
            editor: this.quill
        });
    }
    initQuillElements() {
        if (!this.quillElements) {
            this.quillElements = {
                editorElement: DomHandler.findSingle(this.el.nativeElement, 'div.p-editor-content'),
                toolbarElement: DomHandler.findSingle(this.el.nativeElement, 'div.p-editor-toolbar')
            };
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: Editor, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.0", type: Editor, selector: "p-editor", inputs: { style: "style", styleClass: "styleClass", placeholder: "placeholder", formats: "formats", modules: "modules", bounds: "bounds", scrollingContainer: "scrollingContainer", debug: "debug", readonly: "readonly" }, outputs: { onInit: "onInit", onTextChange: "onTextChange", onSelectionChange: "onSelectionChange" }, host: { classAttribute: "p-element" }, providers: [EDITOR_VALUE_ACCESSOR], queries: [{ propertyName: "toolbar", first: true, predicate: Header, descendants: true }, { propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <div [ngClass]="'p-editor-container'" [class]="styleClass">
            <div class="p-editor-toolbar" *ngIf="toolbar || headerTemplate">
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
            </div>
            <div class="p-editor-toolbar" *ngIf="!toolbar && !headerTemplate">
                <span class="ql-formats">
                    <select class="ql-header">
                        <option value="1">Heading</option>
                        <option value="2">Subheading</option>
                        <option selected>Normal</option>
                    </select>
                    <select class="ql-font">
                        <option selected>Sans Serif</option>
                        <option value="serif">Serif</option>
                        <option value="monospace">Monospace</option>
                    </select>
                </span>
                <span class="ql-formats">
                    <button class="ql-bold" aria-label="Bold" type="button"></button>
                    <button class="ql-italic" aria-label="Italic" type="button"></button>
                    <button class="ql-underline" aria-label="Underline" type="button"></button>
                </span>
                <span class="ql-formats">
                    <select class="ql-color"></select>
                    <select class="ql-background"></select>
                </span>
                <span class="ql-formats">
                    <button class="ql-list" value="ordered" aria-label="Ordered List" type="button"></button>
                    <button class="ql-list" value="bullet" aria-label="Unordered List" type="button"></button>
                    <select class="ql-align">
                        <option selected></option>
                        <option value="center">center</option>
                        <option value="right">right</option>
                        <option value="justify">justify</option>
                    </select>
                </span>
                <span class="ql-formats">
                    <button class="ql-link" aria-label="Insert Link" type="button"></button>
                    <button class="ql-image" aria-label="Insert Image" type="button"></button>
                    <button class="ql-code-block" aria-label="Insert Code Block" type="button"></button>
                </span>
                <span class="ql-formats">
                    <button class="ql-clean" aria-label="Remove Styles" type="button"></button>
                </span>
            </div>
            <div class="p-editor-content" [ngStyle]="style"></div>
        </div>
    `, isInline: true, styles: [".p-editor-container .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options .ql-picker-item{width:auto;height:auto}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
export { Editor };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: Editor, decorators: [{
            type: Component,
            args: [{ selector: 'p-editor', template: `
        <div [ngClass]="'p-editor-container'" [class]="styleClass">
            <div class="p-editor-toolbar" *ngIf="toolbar || headerTemplate">
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
            </div>
            <div class="p-editor-toolbar" *ngIf="!toolbar && !headerTemplate">
                <span class="ql-formats">
                    <select class="ql-header">
                        <option value="1">Heading</option>
                        <option value="2">Subheading</option>
                        <option selected>Normal</option>
                    </select>
                    <select class="ql-font">
                        <option selected>Sans Serif</option>
                        <option value="serif">Serif</option>
                        <option value="monospace">Monospace</option>
                    </select>
                </span>
                <span class="ql-formats">
                    <button class="ql-bold" aria-label="Bold" type="button"></button>
                    <button class="ql-italic" aria-label="Italic" type="button"></button>
                    <button class="ql-underline" aria-label="Underline" type="button"></button>
                </span>
                <span class="ql-formats">
                    <select class="ql-color"></select>
                    <select class="ql-background"></select>
                </span>
                <span class="ql-formats">
                    <button class="ql-list" value="ordered" aria-label="Ordered List" type="button"></button>
                    <button class="ql-list" value="bullet" aria-label="Unordered List" type="button"></button>
                    <select class="ql-align">
                        <option selected></option>
                        <option value="center">center</option>
                        <option value="right">right</option>
                        <option value="justify">justify</option>
                    </select>
                </span>
                <span class="ql-formats">
                    <button class="ql-link" aria-label="Insert Link" type="button"></button>
                    <button class="ql-image" aria-label="Insert Image" type="button"></button>
                    <button class="ql-code-block" aria-label="Insert Code Block" type="button"></button>
                </span>
                <span class="ql-formats">
                    <button class="ql-clean" aria-label="Remove Styles" type="button"></button>
                </span>
            </div>
            <div class="p-editor-content" [ngStyle]="style"></div>
        </div>
    `, providers: [EDITOR_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-editor-container .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options .ql-picker-item{width:auto;height:auto}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], formats: [{
                type: Input
            }], modules: [{
                type: Input
            }], bounds: [{
                type: Input
            }], scrollingContainer: [{
                type: Input
            }], debug: [{
                type: Input
            }], readonly: [{
                type: Input
            }], onInit: [{
                type: Output
            }], onTextChange: [{
                type: Output
            }], onSelectionChange: [{
                type: Output
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], toolbar: [{
                type: ContentChild,
                args: [Header]
            }] } });
class EditorModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: EditorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.0", ngImport: i0, type: EditorModule, declarations: [Editor], imports: [CommonModule], exports: [Editor, SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: EditorModule, imports: [CommonModule, SharedModule] });
}
export { EditorModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: EditorModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Editor, SharedModule],
                    declarations: [Editor]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2VkaXRvci9lZGl0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFFBQVEsRUFDUixTQUFTLEVBR1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osWUFBWSxFQUNaLFVBQVUsRUFDVix1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLGVBQWUsRUFLbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNsRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxpQkFBaUIsRUFBd0IsTUFBTSxnQkFBZ0IsQ0FBQztBQUd6RSxZQUFZO0FBQ1osT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDOzs7QUFFMUIsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQVE7SUFDdEMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUNyQyxLQUFLLEVBQUUsSUFBSTtDQUNkLENBQUM7QUFDRjs7O0dBR0c7QUFDSCxNQTREYSxNQUFNO0lBbUdJO0lBbEduQjs7O09BR0c7SUFDTSxLQUFLLENBQThDO0lBQzVEOzs7T0FHRztJQUNNLFVBQVUsQ0FBcUI7SUFDeEM7OztPQUdHO0lBQ00sV0FBVyxDQUFxQjtJQUN6Qzs7O09BR0c7SUFDTSxPQUFPLENBQXVCO0lBQ3ZDOzs7T0FHRztJQUNNLE9BQU8sQ0FBcUI7SUFDckM7OztPQUdHO0lBQ00sTUFBTSxDQUFtQztJQUNsRDs7O09BR0c7SUFDTSxrQkFBa0IsQ0FBbUM7SUFDOUQ7OztPQUdHO0lBQ00sS0FB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QUs7Z0JBS0csV0FBVztzQkFBbkIsS0FBSztnQkFLRyxPQUFPO3NCQUFmLEtBQUs7Z0JBS0csT0FBTztzQkFBZixLQUFLO2dCQUtHLE1BQU07c0JBQWQsS0FBSztnQkFLRyxrQkFBa0I7c0JBQTFCLEtBQUs7Z0JBS0csS0FBSztzQkFBYixLQUFLO2dCQUtPLFFBQVE7c0JBQXBCLEtBQUs7Z0JBZ0JJLE1BQU07c0JBQWYsTUFBTTtnQkFNRyxZQUFZO3NCQUFyQixNQUFNO2dCQU1HLGlCQUFpQjtzQkFBMUIsTUFBTTtnQkFFeUIsU0FBUztzQkFBeEMsZUFBZTt1QkFBQyxhQUFhO2dCQUVSLE9BQU87c0JBQTVCLFlBQVk7dUJBQUMsTUFBTTs7QUFrS3hCLE1BS2EsWUFBWTt1R0FBWixZQUFZO3dHQUFaLFlBQVksaUJBcFBaLE1BQU0sYUFnUEwsWUFBWSxhQWhQYixNQUFNLEVBaVBHLFlBQVk7d0dBR3JCLFlBQVksWUFKWCxZQUFZLEVBQ0osWUFBWTs7U0FHckIsWUFBWTsyRkFBWixZQUFZO2tCQUx4QixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQztvQkFDL0IsWUFBWSxFQUFFLENBQUMsTUFBTSxDQUFDO2lCQUN6QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgTmdNb2R1bGUsXG4gICAgQ29tcG9uZW50LFxuICAgIEVsZW1lbnRSZWYsXG4gICAgQWZ0ZXJWaWV3SW5pdCxcbiAgICBJbnB1dCxcbiAgICBPdXRwdXQsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIENvbnRlbnRDaGlsZCxcbiAgICBmb3J3YXJkUmVmLFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIFZpZXdFbmNhcHN1bGF0aW9uLFxuICAgIENvbnRlbnRDaGlsZHJlbixcbiAgICBRdWVyeUxpc3QsXG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBBZnRlclZpZXdDaGVja2VkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFNoYXJlZE1vZHVsZSwgSGVhZGVyLCBQcmltZVRlbXBsYXRlIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgRG9tSGFuZGxlciB9IGZyb20gJ3ByaW1lbmcvZG9tJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3NvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEVkaXRvckluaXRFdmVudCwgRWRpdG9yVGV4dENoYW5nZUV2ZW50LCBFZGl0b3JTZWxlY3Rpb25DaGFuZ2VFdmVudCB9IGZyb20gJy4vZWRpdG9yLmludGVyZmFjZSc7XG5pbXBvcnQgeyBOdWxsYWJsZSB9IGZyb20gJ3ByaW1lbmcvdHMtaGVscGVycyc7XG4vL0B0cy1pZ25vcmVcbmltcG9ydCBRdWlsbCBmcm9tICdxdWlsbCc7XG5cbmV4cG9ydCBjb25zdCBFRElUT1JfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBFZGl0b3IpLFxuICAgIG11bHRpOiB0cnVlXG59O1xuLyoqXG4gKiBFZGl0b3IgZ3JvdXBzIGEgY29sbGVjdGlvbiBvZiBjb250ZW50cyBpbiB0YWJzLlxuICogQGdyb3VwIENvbXBvbmVudHNcbiAqL1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLWVkaXRvcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbbmdDbGFzc109XCIncC1lZGl0b3ItY29udGFpbmVyJ1wiIFtjbGFzc109XCJzdHlsZUNsYXNzXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1lZGl0b3ItdG9vbGJhclwiICpuZ0lmPVwidG9vbGJhciB8fCBoZWFkZXJUZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cInAtaGVhZGVyXCI+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJoZWFkZXJUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1lZGl0b3ItdG9vbGJhclwiICpuZ0lmPVwiIXRvb2xiYXIgJiYgIWhlYWRlclRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJxbC1mb3JtYXRzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJxbC1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIxXCI+SGVhZGluZzwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjJcIj5TdWJoZWFkaW5nPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHNlbGVjdGVkPk5vcm1hbDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cInFsLWZvbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gc2VsZWN0ZWQ+U2FucyBTZXJpZjwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInNlcmlmXCI+U2VyaWY8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJtb25vc3BhY2VcIj5Nb25vc3BhY2U8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicWwtZm9ybWF0c1wiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicWwtYm9sZFwiIGFyaWEtbGFiZWw9XCJCb2xkXCIgdHlwZT1cImJ1dHRvblwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicWwtaXRhbGljXCIgYXJpYS1sYWJlbD1cIkl0YWxpY1wiIHR5cGU9XCJidXR0b25cIj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInFsLXVuZGVybGluZVwiIGFyaWEtbGFiZWw9XCJVbmRlcmxpbmVcIiB0eXBlPVwiYnV0dG9uXCI+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicWwtZm9ybWF0c1wiPlxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwicWwtY29sb3JcIj48L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cInFsLWJhY2tncm91bmRcIj48L3NlbGVjdD5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJxbC1mb3JtYXRzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJxbC1saXN0XCIgdmFsdWU9XCJvcmRlcmVkXCIgYXJpYS1sYWJlbD1cIk9yZGVyZWQgTGlzdFwiIHR5cGU9XCJidXR0b25cIj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInFsLWxpc3RcIiB2YWx1ZT1cImJ1bGxldFwiIGFyaWEtbGFiZWw9XCJVbm9yZGVyZWQgTGlzdFwiIHR5cGU9XCJidXR0b25cIj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cInFsLWFsaWduXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHNlbGVjdGVkPjwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImNlbnRlclwiPmNlbnRlcjwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInJpZ2h0XCI+cmlnaHQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJqdXN0aWZ5XCI+anVzdGlmeTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJxbC1mb3JtYXRzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJxbC1saW5rXCIgYXJpYS1sYWJlbD1cIkluc2VydCBMaW5rXCIgdHlwZT1cImJ1dHRvblwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicWwtaW1hZ2VcIiBhcmlhLWxhYmVsPVwiSW5zZXJ0IEltYWdlXCIgdHlwZT1cImJ1dHRvblwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicWwtY29kZS1ibG9ja1wiIGFyaWEtbGFiZWw9XCJJbnNlcnQgQ29kZSBCbG9ja1wiIHR5cGU9XCJidXR0b25cIj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJxbC1mb3JtYXRzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJxbC1jbGVhblwiIGFyaWEtbGFiZWw9XCJSZW1vdmUgU3R5bGVzXCIgdHlwZT1cImJ1dHRvblwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtZWRpdG9yLWNvbnRlbnRcIiBbbmdTdHlsZV09XCJzdHlsZVwiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIHByb3ZpZGVyczogW0VESVRPUl9WQUxVRV9BQ0NFU1NPUl0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgc3R5bGVVcmxzOiBbJy4vZWRpdG9yLmNzcyddLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIEVkaXRvciBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIEFmdGVyVmlld0NoZWNrZWQsIEFmdGVyQ29udGVudEluaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgICAvKipcbiAgICAgKiBJbmxpbmUgc3R5bGUgb2YgdGhlIGNvbnRhaW5lci5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBzdHlsZTogeyBba2xhc3M6IHN0cmluZ106IGFueSB9IHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBTdHlsZSBjbGFzcyBvZiB0aGUgY29udGFpbmVyLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBQbGFjZWhvbGRlciB0ZXh0IHRvIHNob3cgd2hlbiBlZGl0b3IgaXMgZW1wdHkuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBXaGl0ZWxpc3Qgb2YgZm9ybWF0cyB0byBkaXNwbGF5LCBzZWUgaGVyZSBmb3IgYXZhaWxhYmxlIG9wdGlvbnMuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgZm9ybWF0czogc3RyaW5nW10gfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogTW9kdWxlcyBjb25maWd1cmF0aW9uIG9mIEVkaXRvciwgc2VlIGhlcmUgZm9yIGF2YWlsYWJsZSBvcHRpb25zLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIG1vZHVsZXM6IG9iamVjdCB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBET00gRWxlbWVudCBvciBhIENTUyBzZWxlY3RvciBmb3IgYSBET00gRWxlbWVudCwgd2l0aGluIHdoaWNoIHRoZSBlZGl0b3LigJlzIHAgZWxlbWVudHMgKGkuZS4gdG9vbHRpcHMsIGV0Yy4pIHNob3VsZCBiZSBjb25maW5lZC4gQ3VycmVudGx5LCBpdCBvbmx5IGNvbnNpZGVycyBsZWZ0IGFuZCByaWdodCBib3VuZGFyaWVzLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGJvdW5kczogSFRNTEVsZW1lbnQgfCBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogRE9NIEVsZW1lbnQgb3IgYSBDU1Mgc2VsZWN0b3IgZm9yIGEgRE9NIEVsZW1lbnQsIHNwZWNpZnlpbmcgd2hpY2ggY29udGFpbmVyIGhhcyB0aGUgc2Nyb2xsYmFycyAoaS5lLiBvdmVyZmxvdy15OiBhdXRvKSwgaWYgaXMgaGFzIGJlZW4gY2hhbmdlZCBmcm9tIHRoZSBkZWZhdWx0IHFsLWVkaXRvciB3aXRoIGN1c3RvbSBDU1MuIE5lY2Vzc2FyeSB0byBmaXggc2Nyb2xsIGp1bXBpbmcgYnVncyB3aGVuIFF1aWxsIGlzIHNldCB0byBhdXRvIGdyb3cgaXRzIGhlaWdodCwgYW5kIGFub3RoZXIgYW5jZXN0b3IgY29udGFpbmVyIGlzIHJlc3BvbnNpYmxlIGZyb20gdGhlIHNjcm9sbGluZy4uXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgc2Nyb2xsaW5nQ29udGFpbmVyOiBIVE1MRWxlbWVudCB8IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBTaG9ydGN1dCBmb3IgZGVidWcuIE5vdGUgZGVidWcgaXMgYSBzdGF0aWMgbWV0aG9kIGFuZCB3aWxsIGFmZmVjdCBvdGhlciBpbnN0YW5jZXMgb2YgUXVpbGwgZWRpdG9ycyBvbiB0aGUgcGFnZS4gT25seSB3YXJuaW5nIGFuZCBlcnJvciBtZXNzYWdlcyBhcmUgZW5hYmxlZCBieSBkZWZhdWx0LlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGRlYnVnOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byBpbnN0YW50aWF0ZSB0aGUgZWRpdG9yIHRvIHJlYWQtb25seSBtb2RlLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGdldCByZWFkb25seSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlYWRvbmx5O1xuICAgIH1cbiAgICBzZXQgcmVhZG9ubHkodmFsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3JlYWRvbmx5ID0gdmFsO1xuXG4gICAgICAgIGlmICh0aGlzLnF1aWxsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcmVhZG9ubHkpIHRoaXMucXVpbGwuZGlzYWJsZSgpO1xuICAgICAgICAgICAgZWxzZSB0aGlzLnF1aWxsLmVuYWJsZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIHRvIGludm9rZSB3aGVuIHRoZSBxdWlsbCBtb2R1bGVzIGFyZSBsb2FkZWQuXG4gICAgICogQHBhcmFtIHtFZGl0b3JJbml0RXZlbnR9IGV2ZW50IC0gY3VzdG9tIGV2ZW50LlxuICAgICAqIEBncm91cCBFbWl0c1xuICAgICAqL1xuICAgIEBPdXRwdXQoKSBvbkluaXQ6IEV2ZW50RW1pdHRlcjxFZGl0b3JJbml0RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxFZGl0b3JJbml0RXZlbnQ+KCk7XG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgdG8gaW52b2tlIHdoZW4gdGV4dCBvZiBlZGl0b3IgY2hhbmdlcy5cbiAgICAgKiBAcGFyYW0ge0VkaXRvclRleHRDaGFuZ2VFdmVudH0gZXZlbnQgLSBjdXN0b20gZXZlbnQuXG4gICAgICogQGdyb3VwIEVtaXRzXG4gICAgICovXG4gICAgQE91dHB1dCgpIG9uVGV4dENoYW5nZTogRXZlbnRFbWl0dGVyPEVkaXRvclRleHRDaGFuZ2VFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPEVkaXRvclRleHRDaGFuZ2VFdmVudD4oKTtcbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayB0byBpbnZva2Ugd2hlbiBzZWxlY3Rpb24gb2YgdGhlIHRleHQgY2hhbmdlcy5cbiAgICAgKiBAcGFyYW0ge0VkaXRvclNlbGVjdGlvbkNoYW5nZUV2ZW50fSBldmVudCAtIGN1c3RvbSBldmVudC5cbiAgICAgKiBAZ3JvdXAgRW1pdHNcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgb25TZWxlY3Rpb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxFZGl0b3JTZWxlY3Rpb25DaGFuZ2VFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPEVkaXRvclNlbGVjdGlvbkNoYW5nZUV2ZW50PigpO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXMhOiBRdWVyeUxpc3Q8UHJpbWVUZW1wbGF0ZT47XG5cbiAgICBAQ29udGVudENoaWxkKEhlYWRlcikgdG9vbGJhcjogYW55O1xuXG4gICAgdmFsdWU6IE51bGxhYmxlPHN0cmluZz47XG5cbiAgICBkZWxheWVkQ29tbWFuZDogRnVuY3Rpb24gfCBudWxsID0gbnVsbDtcblxuICAgIF9yZWFkb25seTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgb25Nb2RlbENoYW5nZTogRnVuY3Rpb24gPSAoKSA9PiB7fTtcblxuICAgIG9uTW9kZWxUb3VjaGVkOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuXG4gICAgcXVpbGw6IGFueTtcblxuICAgIGhlYWRlclRlbXBsYXRlOiBOdWxsYWJsZTxUZW1wbGF0ZVJlZjxhbnk+PjtcblxuICAgIHByaXZhdGUgZ2V0IGlzQXR0YWNoZWRRdWlsbEVkaXRvclRvRE9NKCk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5xdWlsbEVsZW1lbnRzPy5lZGl0b3JFbGVtZW50Py5pc0Nvbm5lY3RlZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHF1aWxsRWxlbWVudHMhOiB7IGVkaXRvckVsZW1lbnQ6IEhUTUxFbGVtZW50OyB0b29sYmFyRWxlbWVudDogSFRNTEVsZW1lbnQgfTtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZikge31cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbml0UXVpbGxFbGVtZW50cygpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzQXR0YWNoZWRRdWlsbEVkaXRvclRvRE9NKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRRdWlsbEVkaXRvcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdDaGVja2VkKCk6IHZvaWQge1xuICAgICAgICAvLyBUaGUgcHJvYmxlbSBpcyBpbnNpZGUgdGhlIGBxdWlsbGAgbGlicmFyeSwgd2UgbmVlZCB0byB3YWl0IGZvciBhIG5ldyByZWxlYXNlLlxuICAgICAgICAvLyBGdW5jdGlvbiBgaXNMaW5lYCAtIHVzZWQgYGdldENvbXB1dGVkU3R5bGVgLCBpdCB3YXMgcmV3cml0dGVuIGluIHRoZSBuZXh0IHJlbGVhc2UuXG4gICAgICAgIC8vIChXZSBuZWVkIHRvIHdhaXQgZm9yIGEgcmVsZWFzZSBoaWdoZXIgdGhhbiAxLjMuNykuXG4gICAgICAgIC8vIFRoZXNlIGNoZWNrcyBhbmQgY29kZSBjYW4gYmUgcmVtb3ZlZC5cbiAgICAgICAgaWYgKCF0aGlzLnF1aWxsICYmIHRoaXMuaXNBdHRhY2hlZFF1aWxsRWRpdG9yVG9ET00pIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdFF1aWxsRWRpdG9yKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDYW4gYWxzbyBiZSBkZWxldGVkIGFmdGVyIHVwZGF0aW5nIGBxdWlsbGAuXG4gICAgICAgIGlmICh0aGlzLmRlbGF5ZWRDb21tYW5kICYmIHRoaXMuaXNBdHRhY2hlZFF1aWxsRWRpdG9yVG9ET00pIHtcbiAgICAgICAgICAgIHRoaXMuZGVsYXllZENvbW1hbmQoKTtcbiAgICAgICAgICAgIHRoaXMuZGVsYXllZENvbW1hbmQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnaGVhZGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWFkZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuXG4gICAgICAgIGlmICh0aGlzLnF1aWxsKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21tYW5kID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1aWxsLnNldENvbnRlbnRzKHRoaXMucXVpbGwuY2xpcGJvYXJkLmNvbnZlcnQodGhpcy52YWx1ZSkpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0F0dGFjaGVkUXVpbGxFZGl0b3JUb0RPTSkge1xuICAgICAgICAgICAgICAgICAgICBjb21tYW5kKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxheWVkQ29tbWFuZCA9IGNvbW1hbmQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21tYW5kID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1aWxsLnNldFRleHQoJycpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0F0dGFjaGVkUXVpbGxFZGl0b3JUb0RPTSkge1xuICAgICAgICAgICAgICAgICAgICBjb21tYW5kKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxheWVkQ29tbWFuZCA9IGNvbW1hbmQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlID0gZm47XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQgPSBmbjtcbiAgICB9XG5cbiAgICBnZXRRdWlsbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVpbGw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0UXVpbGxFZGl0b3IoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5pdFF1aWxsRWxlbWVudHMoKTtcblxuICAgICAgICBjb25zdCB7IHRvb2xiYXJFbGVtZW50LCBlZGl0b3JFbGVtZW50IH0gPSB0aGlzLnF1aWxsRWxlbWVudHM7XG4gICAgICAgIGxldCBkZWZhdWx0TW9kdWxlID0geyB0b29sYmFyOiB0b29sYmFyRWxlbWVudCB9O1xuICAgICAgICBsZXQgbW9kdWxlcyA9IHRoaXMubW9kdWxlcyA/IHsgLi4uZGVmYXVsdE1vZHVsZSwgLi4udGhpcy5tb2R1bGVzIH0gOiBkZWZhdWx0TW9kdWxlO1xuICAgICAgICB0aGlzLnF1aWxsID0gbmV3IFF1aWxsKGVkaXRvckVsZW1lbnQsIHtcbiAgICAgICAgICAgIG1vZHVsZXM6IG1vZHVsZXMsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogdGhpcy5wbGFjZWhvbGRlcixcbiAgICAgICAgICAgIHJlYWRPbmx5OiB0aGlzLnJlYWRvbmx5LFxuICAgICAgICAgICAgdGhlbWU6ICdzbm93JyxcbiAgICAgICAgICAgIGZvcm1hdHM6IHRoaXMuZm9ybWF0cyxcbiAgICAgICAgICAgIGJvdW5kczogdGhpcy5ib3VuZHMsXG4gICAgICAgICAgICBkZWJ1ZzogdGhpcy5kZWJ1ZyxcbiAgICAgICAgICAgIHNjcm9sbGluZ0NvbnRhaW5lcjogdGhpcy5zY3JvbGxpbmdDb250YWluZXJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMudmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMucXVpbGwuc2V0Q29udGVudHModGhpcy5xdWlsbC5jbGlwYm9hcmQuY29udmVydCh0aGlzLnZhbHVlKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnF1aWxsLm9uKCd0ZXh0LWNoYW5nZScsIChkZWx0YTogYW55LCBvbGRDb250ZW50czogYW55LCBzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKHNvdXJjZSA9PT0gJ3VzZXInKSB7XG4gICAgICAgICAgICAgICAgbGV0IGh0bWwgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUoZWRpdG9yRWxlbWVudCwgJy5xbC1lZGl0b3InKS5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgbGV0IHRleHQgPSB0aGlzLnF1aWxsLmdldFRleHQoKS50cmltKCk7XG4gICAgICAgICAgICAgICAgaWYgKGh0bWwgPT09ICc8cD48YnI+PC9wPicpIHtcbiAgICAgICAgICAgICAgICAgICAgaHRtbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5vblRleHRDaGFuZ2UuZW1pdCh7XG4gICAgICAgICAgICAgICAgICAgIGh0bWxWYWx1ZTogaHRtbCxcbiAgICAgICAgICAgICAgICAgICAgdGV4dFZhbHVlOiB0ZXh0LFxuICAgICAgICAgICAgICAgICAgICBkZWx0YTogZGVsdGEsXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogc291cmNlXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UoaHRtbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnF1aWxsLm9uKCdzZWxlY3Rpb24tY2hhbmdlJywgKHJhbmdlOiBzdHJpbmcsIG9sZFJhbmdlOiBzdHJpbmcsIHNvdXJjZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uU2VsZWN0aW9uQ2hhbmdlLmVtaXQoe1xuICAgICAgICAgICAgICAgIHJhbmdlOiByYW5nZSxcbiAgICAgICAgICAgICAgICBvbGRSYW5nZTogb2xkUmFuZ2UsXG4gICAgICAgICAgICAgICAgc291cmNlOiBzb3VyY2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm9uSW5pdC5lbWl0KHtcbiAgICAgICAgICAgIGVkaXRvcjogdGhpcy5xdWlsbFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRRdWlsbEVsZW1lbnRzKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMucXVpbGxFbGVtZW50cykge1xuICAgICAgICAgICAgdGhpcy5xdWlsbEVsZW1lbnRzID0ge1xuICAgICAgICAgICAgICAgIGVkaXRvckVsZW1lbnQ6IERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdkaXYucC1lZGl0b3ItY29udGVudCcpLFxuICAgICAgICAgICAgICAgIHRvb2xiYXJFbGVtZW50OiBEb21IYW5kbGVyLmZpbmRTaW5nbGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnZGl2LnAtZWRpdG9yLXRvb2xiYXInKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbRWRpdG9yLCBTaGFyZWRNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW0VkaXRvcl1cbn0pXG5leHBvcnQgY2xhc3MgRWRpdG9yTW9kdWxlIHt9XG4iXX0=