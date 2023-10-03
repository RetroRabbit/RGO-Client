import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/icons/check";
import * as i3 from "primeng/icons/infocircle";
import * as i4 from "primeng/icons/timescircle";
import * as i5 from "primeng/icons/exclamationtriangle";
/**
 * Message groups a collection of contents in tabs.
 * @group Components
 */
export declare class UIMessage {
    /**
     * Severity level of the message.
     * @group Props
     */
    severity: 'success' | 'info' | 'warn' | 'error' | string | undefined;
    /**
     * Text content.
     * @group Props
     */
    text: string | undefined;
    /**
     * Whether displaying messages would be escaped or not.
     * @group Props
     */
    escape: boolean;
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
    get icon(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<UIMessage, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UIMessage, "p-message", never, { "severity": { "alias": "severity"; "required": false; }; "text": { "alias": "text"; "required": false; }; "escape": { "alias": "escape"; "required": false; }; "style": { "alias": "style"; "required": false; }; "styleClass": { "alias": "styleClass"; "required": false; }; }, {}, never, never, false, never>;
}
export declare class MessageModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MessageModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MessageModule, [typeof UIMessage], [typeof i1.CommonModule, typeof i2.CheckIcon, typeof i3.InfoCircleIcon, typeof i4.TimesCircleIcon, typeof i5.ExclamationTriangleIcon], [typeof UIMessage]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MessageModule>;
}
