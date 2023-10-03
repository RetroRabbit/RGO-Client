import { NgModule, Inject, Optional } from '@angular/core';
import { _FEATURE_EFFECTS_INSTANCE_GROUPS } from './tokens';
import * as i0 from "@angular/core";
import * as i1 from "./effects_root_module";
import * as i2 from "@ngrx/store";
class EffectsFeatureModule {
    constructor(effectsRootModule, effectsInstanceGroups, storeRootModule, storeFeatureModule) {
        const effectsInstances = effectsInstanceGroups.flat();
        for (const effectsInstance of effectsInstances) {
            effectsRootModule.addEffects(effectsInstance);
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EffectsFeatureModule, deps: [{ token: i1.EffectsRootModule }, { token: _FEATURE_EFFECTS_INSTANCE_GROUPS }, { token: i2.StoreRootModule, optional: true }, { token: i2.StoreFeatureModule, optional: true }], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: EffectsFeatureModule }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EffectsFeatureModule }); }
}
export { EffectsFeatureModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EffectsFeatureModule, decorators: [{
            type: NgModule,
            args: [{}]
        }], ctorParameters: function () { return [{ type: i1.EffectsRootModule }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [_FEATURE_EFFECTS_INSTANCE_GROUPS]
                }] }, { type: i2.StoreRootModule, decorators: [{
                    type: Optional
                }] }, { type: i2.StoreFeatureModule, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZmZWN0c19mZWF0dXJlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZWZmZWN0cy9zcmMvZWZmZWN0c19mZWF0dXJlX21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0QsT0FBTyxFQUFFLGdDQUFnQyxFQUFFLE1BQU0sVUFBVSxDQUFDOzs7O0FBRTVELE1BQ2Esb0JBQW9CO0lBQy9CLFlBQ0UsaUJBQW9DLEVBRXBDLHFCQUFrQyxFQUN0QixlQUFnQyxFQUNoQyxrQkFBc0M7UUFFbEQsTUFBTSxnQkFBZ0IsR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN0RCxLQUFLLE1BQU0sZUFBZSxJQUFJLGdCQUFnQixFQUFFO1lBQzlDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUMvQztJQUNILENBQUM7aUlBWlUsb0JBQW9CLG1EQUdyQixnQ0FBZ0M7a0lBSC9CLG9CQUFvQjtrSUFBcEIsb0JBQW9COztTQUFwQixvQkFBb0I7MkZBQXBCLG9CQUFvQjtrQkFEaEMsUUFBUTttQkFBQyxFQUFFOzswQkFJUCxNQUFNOzJCQUFDLGdDQUFnQzs7MEJBRXZDLFFBQVE7OzBCQUNSLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgSW5qZWN0LCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3RvcmVSb290TW9kdWxlLCBTdG9yZUZlYXR1cmVNb2R1bGUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBFZmZlY3RzUm9vdE1vZHVsZSB9IGZyb20gJy4vZWZmZWN0c19yb290X21vZHVsZSc7XG5pbXBvcnQgeyBfRkVBVFVSRV9FRkZFQ1RTX0lOU1RBTkNFX0dST1VQUyB9IGZyb20gJy4vdG9rZW5zJztcblxuQE5nTW9kdWxlKHt9KVxuZXhwb3J0IGNsYXNzIEVmZmVjdHNGZWF0dXJlTW9kdWxlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgZWZmZWN0c1Jvb3RNb2R1bGU6IEVmZmVjdHNSb290TW9kdWxlLFxuICAgIEBJbmplY3QoX0ZFQVRVUkVfRUZGRUNUU19JTlNUQU5DRV9HUk9VUFMpXG4gICAgZWZmZWN0c0luc3RhbmNlR3JvdXBzOiB1bmtub3duW11bXSxcbiAgICBAT3B0aW9uYWwoKSBzdG9yZVJvb3RNb2R1bGU6IFN0b3JlUm9vdE1vZHVsZSxcbiAgICBAT3B0aW9uYWwoKSBzdG9yZUZlYXR1cmVNb2R1bGU6IFN0b3JlRmVhdHVyZU1vZHVsZVxuICApIHtcbiAgICBjb25zdCBlZmZlY3RzSW5zdGFuY2VzID0gZWZmZWN0c0luc3RhbmNlR3JvdXBzLmZsYXQoKTtcbiAgICBmb3IgKGNvbnN0IGVmZmVjdHNJbnN0YW5jZSBvZiBlZmZlY3RzSW5zdGFuY2VzKSB7XG4gICAgICBlZmZlY3RzUm9vdE1vZHVsZS5hZGRFZmZlY3RzKGVmZmVjdHNJbnN0YW5jZSk7XG4gICAgfVxuICB9XG59XG4iXX0=