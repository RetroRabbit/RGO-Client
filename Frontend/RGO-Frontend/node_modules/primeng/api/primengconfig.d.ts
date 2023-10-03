import { OverlayOptions } from './overlayoptions';
import { Translation } from './translation';
import * as i0 from "@angular/core";
export declare class PrimeNGConfig {
    ripple: boolean;
    overlayOptions: OverlayOptions;
    filterMatchModeOptions: {
        text: string[];
        numeric: string[];
        date: string[];
    };
    translation: Translation;
    zIndex: any;
    private translationSource;
    translationObserver: import("rxjs").Observable<any>;
    getTranslation(key: string): any;
    setTranslation(value: Translation): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PrimeNGConfig, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PrimeNGConfig>;
}
