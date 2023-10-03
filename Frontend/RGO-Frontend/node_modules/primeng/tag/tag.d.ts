import { QueryList, TemplateRef } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/api";
/**
 * Tag component is used to categorize content.
 * @group Components
 */
export declare class Tag {
    /**
     * Inline style of the component.
     * @group Props
     */
    style: {
        [klass: string]: any;
    } | null | undefined;
    /**
     * Style class of the component.
     * @group Props
     */
    styleClass: string | undefined;
    /**
     * Severity type of the tag.
     * @group Props
     */
    severity: 'success' | 'info' | 'warning' | 'danger' | string | undefined;
    /**
     * Value to display inside the tag.
     * @group Props
     */
    value: string | undefined;
    /**
     * Icon of the tag to display next to the value.
     * @group Props
     * @deprecated since 15.4.2. Use 'icon' template.
     */
    icon: string | undefined;
    /**
     * Whether the corners of the tag are rounded.
     * @group Props
     */
    rounded: boolean | undefined;
    templates: QueryList<PrimeTemplate> | undefined;
    iconTemplate: TemplateRef<any> | undefined;
    ngAfterContentInit(): void;
    containerClass(): {
        'p-tag p-component': boolean;
        'p-tag-info': boolean;
        'p-tag-success': boolean;
        'p-tag-warning': boolean;
        'p-tag-danger': boolean;
        'p-tag-rounded': boolean;
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<Tag, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Tag, "p-tag", never, { "style": { "alias": "style"; "required": false; }; "styleClass": { "alias": "styleClass"; "required": false; }; "severity": { "alias": "severity"; "required": false; }; "value": { "alias": "value"; "required": false; }; "icon": { "alias": "icon"; "required": false; }; "rounded": { "alias": "rounded"; "required": false; }; }, {}, ["templates"], ["*"], false, never>;
}
export declare class TagModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<TagModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<TagModule, [typeof Tag], [typeof i1.CommonModule, typeof i2.SharedModule], [typeof Tag, typeof i2.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<TagModule>;
}
