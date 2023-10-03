import { Inject, Injectable } from '@angular/core';
import { Subject, merge } from 'rxjs';
import { dematerialize, exhaustMap, filter, groupBy, map, mergeMap, take, } from 'rxjs/operators';
import { reportInvalidActions, } from './effect_notification';
import { mergeEffects } from './effects_resolver';
import { isOnIdentifyEffects, isOnRunEffects, isOnInitEffects, } from './lifecycle_hooks';
import { EFFECTS_ERROR_HANDLER } from './tokens';
import { getSourceForInstance, isClassInstance, } from './utils';
import * as i0 from "@angular/core";
class EffectSources extends Subject {
    constructor(errorHandler, effectsErrorHandler) {
        super();
        this.errorHandler = errorHandler;
        this.effectsErrorHandler = effectsErrorHandler;
    }
    addEffects(effectSourceInstance) {
        this.next(effectSourceInstance);
    }
    /**
     * @internal
     */
    toActions() {
        return this.pipe(groupBy((effectsInstance) => isClassInstance(effectsInstance)
            ? getSourceForInstance(effectsInstance)
            : effectsInstance), mergeMap((source$) => {
            return source$.pipe(groupBy(effectsInstance));
        }), mergeMap((source$) => {
            const effect$ = source$.pipe(exhaustMap((sourceInstance) => {
                return resolveEffectSource(this.errorHandler, this.effectsErrorHandler)(sourceInstance);
            }), map((output) => {
                reportInvalidActions(output, this.errorHandler);
                return output.notification;
            }), filter((notification) => notification.kind === 'N' && notification.value != null), dematerialize());
            // start the stream with an INIT action
            // do this only for the first Effect instance
            const init$ = source$.pipe(take(1), filter(isOnInitEffects), map((instance) => instance.ngrxOnInitEffects()));
            return merge(effect$, init$);
        }));
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EffectSources, deps: [{ token: i0.ErrorHandler }, { token: EFFECTS_ERROR_HANDLER }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EffectSources, providedIn: 'root' }); }
}
export { EffectSources };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EffectSources, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.ErrorHandler }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [EFFECTS_ERROR_HANDLER]
                }] }]; } });
function effectsInstance(sourceInstance) {
    if (isOnIdentifyEffects(sourceInstance)) {
        return sourceInstance.ngrxOnIdentifyEffects();
    }
    return '';
}
function resolveEffectSource(errorHandler, effectsErrorHandler) {
    return (sourceInstance) => {
        const mergedEffects$ = mergeEffects(sourceInstance, errorHandler, effectsErrorHandler);
        if (isOnRunEffects(sourceInstance)) {
            return sourceInstance.ngrxOnRunEffects(mergedEffects$);
        }
        return mergedEffects$;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZmZWN0X3NvdXJjZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2VmZmVjdHMvc3JjL2VmZmVjdF9zb3VyY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBZ0IsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVqRSxPQUFPLEVBQWMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQ0wsYUFBYSxFQUNiLFVBQVUsRUFDVixNQUFNLEVBQ04sT0FBTyxFQUNQLEdBQUcsRUFDSCxRQUFRLEVBQ1IsSUFBSSxHQUNMLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUNMLG9CQUFvQixHQUVyQixNQUFNLHVCQUF1QixDQUFDO0FBRS9CLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQ0wsbUJBQW1CLEVBQ25CLGNBQWMsRUFDZCxlQUFlLEdBQ2hCLE1BQU0sbUJBQW1CLENBQUM7QUFDM0IsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ2pELE9BQU8sRUFDTCxvQkFBb0IsRUFDcEIsZUFBZSxHQUVoQixNQUFNLFNBQVMsQ0FBQzs7QUFFakIsTUFDYSxhQUFjLFNBQVEsT0FBWTtJQUM3QyxZQUNVLFlBQTBCLEVBRTFCLG1CQUF3QztRQUVoRCxLQUFLLEVBQUUsQ0FBQztRQUpBLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBRTFCLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7SUFHbEQsQ0FBQztJQUVELFVBQVUsQ0FBQyxvQkFBeUI7UUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7T0FFRztJQUNILFNBQVM7UUFDUCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQ2QsT0FBTyxDQUFDLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FDMUIsZUFBZSxDQUFDLGVBQWUsQ0FBQztZQUM5QixDQUFDLENBQUMsb0JBQW9CLENBQUMsZUFBZSxDQUFDO1lBQ3ZDLENBQUMsQ0FBQyxlQUFlLENBQ3BCLEVBQ0QsUUFBUSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDbkIsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxFQUNGLFFBQVEsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ25CLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQzFCLFVBQVUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUM1QixPQUFPLG1CQUFtQixDQUN4QixJQUFJLENBQUMsWUFBWSxFQUNqQixJQUFJLENBQUMsbUJBQW1CLENBQ3pCLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDcEIsQ0FBQyxDQUFDLEVBQ0YsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ2Isb0JBQW9CLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDaEQsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDO1lBQzdCLENBQUMsQ0FBQyxFQUNGLE1BQU0sQ0FDSixDQUFDLFlBQVksRUFBa0QsRUFBRSxDQUMvRCxZQUFZLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxZQUFZLENBQUMsS0FBSyxJQUFJLElBQUksQ0FDMUQsRUFDRCxhQUFhLEVBQUUsQ0FDaEIsQ0FBQztZQUVGLHVDQUF1QztZQUN2Qyw2Q0FBNkM7WUFDN0MsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FDeEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUNQLE1BQU0sQ0FBQyxlQUFlLENBQUMsRUFDdkIsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUNoRCxDQUFDO1lBRUYsT0FBTyxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDO2lJQXhEVSxhQUFhLDhDQUdkLHFCQUFxQjtxSUFIcEIsYUFBYSxjQURBLE1BQU07O1NBQ25CLGFBQWE7MkZBQWIsYUFBYTtrQkFEekIsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7OzBCQUk3QixNQUFNOzJCQUFDLHFCQUFxQjs7QUF3RGpDLFNBQVMsZUFBZSxDQUFDLGNBQW1CO0lBQzFDLElBQUksbUJBQW1CLENBQUMsY0FBYyxDQUFDLEVBQUU7UUFDdkMsT0FBTyxjQUFjLENBQUMscUJBQXFCLEVBQUUsQ0FBQztLQUMvQztJQUVELE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQztBQUVELFNBQVMsbUJBQW1CLENBQzFCLFlBQTBCLEVBQzFCLG1CQUF3QztJQUV4QyxPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUU7UUFDeEIsTUFBTSxjQUFjLEdBQUcsWUFBWSxDQUNqQyxjQUFjLEVBQ2QsWUFBWSxFQUNaLG1CQUFtQixDQUNwQixDQUFDO1FBRUYsSUFBSSxjQUFjLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDbEMsT0FBTyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDeEQ7UUFFRCxPQUFPLGNBQWMsQ0FBQztJQUN4QixDQUFDLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXJyb3JIYW5kbGVyLCBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QsIG1lcmdlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBkZW1hdGVyaWFsaXplLFxuICBleGhhdXN0TWFwLFxuICBmaWx0ZXIsXG4gIGdyb3VwQnksXG4gIG1hcCxcbiAgbWVyZ2VNYXAsXG4gIHRha2UsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtcbiAgcmVwb3J0SW52YWxpZEFjdGlvbnMsXG4gIEVmZmVjdE5vdGlmaWNhdGlvbixcbn0gZnJvbSAnLi9lZmZlY3Rfbm90aWZpY2F0aW9uJztcbmltcG9ydCB7IEVmZmVjdHNFcnJvckhhbmRsZXIgfSBmcm9tICcuL2VmZmVjdHNfZXJyb3JfaGFuZGxlcic7XG5pbXBvcnQgeyBtZXJnZUVmZmVjdHMgfSBmcm9tICcuL2VmZmVjdHNfcmVzb2x2ZXInO1xuaW1wb3J0IHtcbiAgaXNPbklkZW50aWZ5RWZmZWN0cyxcbiAgaXNPblJ1bkVmZmVjdHMsXG4gIGlzT25Jbml0RWZmZWN0cyxcbn0gZnJvbSAnLi9saWZlY3ljbGVfaG9va3MnO1xuaW1wb3J0IHsgRUZGRUNUU19FUlJPUl9IQU5ETEVSIH0gZnJvbSAnLi90b2tlbnMnO1xuaW1wb3J0IHtcbiAgZ2V0U291cmNlRm9ySW5zdGFuY2UsXG4gIGlzQ2xhc3NJbnN0YW5jZSxcbiAgT2JzZXJ2YWJsZU5vdGlmaWNhdGlvbixcbn0gZnJvbSAnLi91dGlscyc7XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgRWZmZWN0U291cmNlcyBleHRlbmRzIFN1YmplY3Q8YW55PiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXIsXG4gICAgQEluamVjdChFRkZFQ1RTX0VSUk9SX0hBTkRMRVIpXG4gICAgcHJpdmF0ZSBlZmZlY3RzRXJyb3JIYW5kbGVyOiBFZmZlY3RzRXJyb3JIYW5kbGVyXG4gICkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBhZGRFZmZlY3RzKGVmZmVjdFNvdXJjZUluc3RhbmNlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm5leHQoZWZmZWN0U291cmNlSW5zdGFuY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgdG9BY3Rpb25zKCk6IE9ic2VydmFibGU8QWN0aW9uPiB7XG4gICAgcmV0dXJuIHRoaXMucGlwZShcbiAgICAgIGdyb3VwQnkoKGVmZmVjdHNJbnN0YW5jZSkgPT5cbiAgICAgICAgaXNDbGFzc0luc3RhbmNlKGVmZmVjdHNJbnN0YW5jZSlcbiAgICAgICAgICA/IGdldFNvdXJjZUZvckluc3RhbmNlKGVmZmVjdHNJbnN0YW5jZSlcbiAgICAgICAgICA6IGVmZmVjdHNJbnN0YW5jZVxuICAgICAgKSxcbiAgICAgIG1lcmdlTWFwKChzb3VyY2UkKSA9PiB7XG4gICAgICAgIHJldHVybiBzb3VyY2UkLnBpcGUoZ3JvdXBCeShlZmZlY3RzSW5zdGFuY2UpKTtcbiAgICAgIH0pLFxuICAgICAgbWVyZ2VNYXAoKHNvdXJjZSQpID0+IHtcbiAgICAgICAgY29uc3QgZWZmZWN0JCA9IHNvdXJjZSQucGlwZShcbiAgICAgICAgICBleGhhdXN0TWFwKChzb3VyY2VJbnN0YW5jZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVFZmZlY3RTb3VyY2UoXG4gICAgICAgICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyLFxuICAgICAgICAgICAgICB0aGlzLmVmZmVjdHNFcnJvckhhbmRsZXJcbiAgICAgICAgICAgICkoc291cmNlSW5zdGFuY2UpO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIG1hcCgob3V0cHV0KSA9PiB7XG4gICAgICAgICAgICByZXBvcnRJbnZhbGlkQWN0aW9ucyhvdXRwdXQsIHRoaXMuZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQubm90aWZpY2F0aW9uO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIGZpbHRlcihcbiAgICAgICAgICAgIChub3RpZmljYXRpb24pOiBub3RpZmljYXRpb24gaXMgT2JzZXJ2YWJsZU5vdGlmaWNhdGlvbjxBY3Rpb24+ID0+XG4gICAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5raW5kID09PSAnTicgJiYgbm90aWZpY2F0aW9uLnZhbHVlICE9IG51bGxcbiAgICAgICAgICApLFxuICAgICAgICAgIGRlbWF0ZXJpYWxpemUoKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIHN0YXJ0IHRoZSBzdHJlYW0gd2l0aCBhbiBJTklUIGFjdGlvblxuICAgICAgICAvLyBkbyB0aGlzIG9ubHkgZm9yIHRoZSBmaXJzdCBFZmZlY3QgaW5zdGFuY2VcbiAgICAgICAgY29uc3QgaW5pdCQgPSBzb3VyY2UkLnBpcGUoXG4gICAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgICBmaWx0ZXIoaXNPbkluaXRFZmZlY3RzKSxcbiAgICAgICAgICBtYXAoKGluc3RhbmNlKSA9PiBpbnN0YW5jZS5uZ3J4T25Jbml0RWZmZWN0cygpKVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBtZXJnZShlZmZlY3QkLCBpbml0JCk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZWZmZWN0c0luc3RhbmNlKHNvdXJjZUluc3RhbmNlOiBhbnkpIHtcbiAgaWYgKGlzT25JZGVudGlmeUVmZmVjdHMoc291cmNlSW5zdGFuY2UpKSB7XG4gICAgcmV0dXJuIHNvdXJjZUluc3RhbmNlLm5ncnhPbklkZW50aWZ5RWZmZWN0cygpO1xuICB9XG5cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlRWZmZWN0U291cmNlKFxuICBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgZWZmZWN0c0Vycm9ySGFuZGxlcjogRWZmZWN0c0Vycm9ySGFuZGxlclxuKTogKHNvdXJjZUluc3RhbmNlOiBhbnkpID0+IE9ic2VydmFibGU8RWZmZWN0Tm90aWZpY2F0aW9uPiB7XG4gIHJldHVybiAoc291cmNlSW5zdGFuY2UpID0+IHtcbiAgICBjb25zdCBtZXJnZWRFZmZlY3RzJCA9IG1lcmdlRWZmZWN0cyhcbiAgICAgIHNvdXJjZUluc3RhbmNlLFxuICAgICAgZXJyb3JIYW5kbGVyLFxuICAgICAgZWZmZWN0c0Vycm9ySGFuZGxlclxuICAgICk7XG5cbiAgICBpZiAoaXNPblJ1bkVmZmVjdHMoc291cmNlSW5zdGFuY2UpKSB7XG4gICAgICByZXR1cm4gc291cmNlSW5zdGFuY2UubmdyeE9uUnVuRWZmZWN0cyhtZXJnZWRFZmZlY3RzJCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lcmdlZEVmZmVjdHMkO1xuICB9O1xufVxuIl19