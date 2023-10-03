import { NgModule, Inject, Optional } from '@angular/core';
import { _ROOT_EFFECTS_GUARD, _ROOT_EFFECTS_INSTANCES } from './tokens';
import { ROOT_EFFECTS_INIT } from './effects_actions';
import * as i0 from "@angular/core";
import * as i1 from "./effect_sources";
import * as i2 from "./effects_runner";
import * as i3 from "@ngrx/store";
class EffectsRootModule {
    constructor(sources, runner, store, rootEffectsInstances, storeRootModule, storeFeatureModule, guard) {
        this.sources = sources;
        runner.start();
        for (const effectsInstance of rootEffectsInstances) {
            sources.addEffects(effectsInstance);
        }
        store.dispatch({ type: ROOT_EFFECTS_INIT });
    }
    addEffects(effectsInstance) {
        this.sources.addEffects(effectsInstance);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EffectsRootModule, deps: [{ token: i1.EffectSources }, { token: i2.EffectsRunner }, { token: i3.Store }, { token: _ROOT_EFFECTS_INSTANCES }, { token: i3.StoreRootModule, optional: true }, { token: i3.StoreFeatureModule, optional: true }, { token: _ROOT_EFFECTS_GUARD, optional: true }], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: EffectsRootModule }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EffectsRootModule }); }
}
export { EffectsRootModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EffectsRootModule, decorators: [{
            type: NgModule,
            args: [{}]
        }], ctorParameters: function () { return [{ type: i1.EffectSources }, { type: i2.EffectsRunner }, { type: i3.Store }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [_ROOT_EFFECTS_INSTANCES]
                }] }, { type: i3.StoreRootModule, decorators: [{
                    type: Optional
                }] }, { type: i3.StoreFeatureModule, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [_ROOT_EFFECTS_GUARD]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZmZWN0c19yb290X21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZWZmZWN0cy9zcmMvZWZmZWN0c19yb290X21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFJM0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLHVCQUF1QixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDOzs7OztBQUV0RCxNQUNhLGlCQUFpQjtJQUM1QixZQUNVLE9BQXNCLEVBQzlCLE1BQXFCLEVBQ3JCLEtBQVksRUFDcUIsb0JBQStCLEVBQ3BELGVBQWdDLEVBQ2hDLGtCQUFzQyxFQUdsRCxLQUFjO1FBUk4sWUFBTyxHQUFQLE9BQU8sQ0FBZTtRQVU5QixNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFZixLQUFLLE1BQU0sZUFBZSxJQUFJLG9CQUFvQixFQUFFO1lBQ2xELE9BQU8sQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDckM7UUFFRCxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsVUFBVSxDQUFDLGVBQXdCO1FBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7aUlBdkJVLGlCQUFpQixpR0FLbEIsdUJBQXVCLDhHQUl2QixtQkFBbUI7a0lBVGxCLGlCQUFpQjtrSUFBakIsaUJBQWlCOztTQUFqQixpQkFBaUI7MkZBQWpCLGlCQUFpQjtrQkFEN0IsUUFBUTttQkFBQyxFQUFFOzswQkFNUCxNQUFNOzJCQUFDLHVCQUF1Qjs7MEJBQzlCLFFBQVE7OzBCQUNSLFFBQVE7OzBCQUNSLFFBQVE7OzBCQUNSLE1BQU07MkJBQUMsbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIEluamVjdCwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN0b3JlLCBTdG9yZVJvb3RNb2R1bGUsIFN0b3JlRmVhdHVyZU1vZHVsZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IEVmZmVjdHNSdW5uZXIgfSBmcm9tICcuL2VmZmVjdHNfcnVubmVyJztcbmltcG9ydCB7IEVmZmVjdFNvdXJjZXMgfSBmcm9tICcuL2VmZmVjdF9zb3VyY2VzJztcbmltcG9ydCB7IF9ST09UX0VGRkVDVFNfR1VBUkQsIF9ST09UX0VGRkVDVFNfSU5TVEFOQ0VTIH0gZnJvbSAnLi90b2tlbnMnO1xuaW1wb3J0IHsgUk9PVF9FRkZFQ1RTX0lOSVQgfSBmcm9tICcuL2VmZmVjdHNfYWN0aW9ucyc7XG5cbkBOZ01vZHVsZSh7fSlcbmV4cG9ydCBjbGFzcyBFZmZlY3RzUm9vdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc291cmNlczogRWZmZWN0U291cmNlcyxcbiAgICBydW5uZXI6IEVmZmVjdHNSdW5uZXIsXG4gICAgc3RvcmU6IFN0b3JlLFxuICAgIEBJbmplY3QoX1JPT1RfRUZGRUNUU19JTlNUQU5DRVMpIHJvb3RFZmZlY3RzSW5zdGFuY2VzOiB1bmtub3duW10sXG4gICAgQE9wdGlvbmFsKCkgc3RvcmVSb290TW9kdWxlOiBTdG9yZVJvb3RNb2R1bGUsXG4gICAgQE9wdGlvbmFsKCkgc3RvcmVGZWF0dXJlTW9kdWxlOiBTdG9yZUZlYXR1cmVNb2R1bGUsXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KF9ST09UX0VGRkVDVFNfR1VBUkQpXG4gICAgZ3VhcmQ6IHVua25vd25cbiAgKSB7XG4gICAgcnVubmVyLnN0YXJ0KCk7XG5cbiAgICBmb3IgKGNvbnN0IGVmZmVjdHNJbnN0YW5jZSBvZiByb290RWZmZWN0c0luc3RhbmNlcykge1xuICAgICAgc291cmNlcy5hZGRFZmZlY3RzKGVmZmVjdHNJbnN0YW5jZSk7XG4gICAgfVxuXG4gICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiBST09UX0VGRkVDVFNfSU5JVCB9KTtcbiAgfVxuXG4gIGFkZEVmZmVjdHMoZWZmZWN0c0luc3RhbmNlOiB1bmtub3duKTogdm9pZCB7XG4gICAgdGhpcy5zb3VyY2VzLmFkZEVmZmVjdHMoZWZmZWN0c0luc3RhbmNlKTtcbiAgfVxufVxuIl19