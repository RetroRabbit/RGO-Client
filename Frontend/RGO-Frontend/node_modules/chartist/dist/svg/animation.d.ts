import type { EventEmitter } from '../event';
import type { AnimationDefinition } from './types';
import type { Svg } from './Svg';
/**
 * This Object contains some standard easing cubic bezier curves.
 * Then can be used with their name in the `Svg.animate`.
 * You can also extend the list and use your own name in the `animate` function.
 * Click the show code button to see the available bezier functions.
 */
export declare const easings: {
    easeInSine: number[];
    easeOutSine: number[];
    easeInOutSine: number[];
    easeInQuad: number[];
    easeOutQuad: number[];
    easeInOutQuad: number[];
    easeInCubic: number[];
    easeOutCubic: number[];
    easeInOutCubic: number[];
    easeInQuart: number[];
    easeOutQuart: number[];
    easeInOutQuart: number[];
    easeInQuint: number[];
    easeOutQuint: number[];
    easeInOutQuint: number[];
    easeInExpo: number[];
    easeOutExpo: number[];
    easeInOutExpo: number[];
    easeInCirc: number[];
    easeOutCirc: number[];
    easeInOutCirc: number[];
    easeInBack: number[];
    easeOutBack: number[];
    easeInOutBack: number[];
};
export declare function createAnimation(element: Svg, attribute: string, animationDefinition: AnimationDefinition, createGuided?: boolean, eventEmitter?: EventEmitter): void;
//# sourceMappingURL=animation.d.ts.map