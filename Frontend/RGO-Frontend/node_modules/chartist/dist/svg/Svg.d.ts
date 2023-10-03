import type { EventEmitter } from '../event';
import type { Attributes, AnimationDefinition } from './types';
import { SvgList } from './SvgList';
/**
 * Svg creates a new SVG object wrapper with a starting element. You can use the wrapper to fluently create sub-elements and modify them.
 */
export declare class Svg {
    /**
     * @todo Only there for chartist <1 compatibility. Remove after deprecation warining.
     * @deprecated Use the animation module export `easings` directly.
     */
    static readonly Easing: {
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
    private _node;
    /**
     * @param name The name of the SVG element to create or an SVG dom element which should be wrapped into Svg
     * @param attributes An object with properties that will be added as attributes to the SVG element that is created. Attributes with undefined values will not be added.
     * @param className This class or class list will be added to the SVG element
     * @param parent The parent SVG wrapper object where this newly created wrapper and it's element will be attached to as child
     * @param insertFirst If this param is set to true in conjunction with a parent element the newly created element will be added as first child element in the parent element
     */
    constructor(name: string | Element, attributes?: Attributes, className?: string, parent?: Svg, insertFirst?: boolean);
    /**
     * Set attributes on the current SVG element of the wrapper you're currently working on.
     * @param attributes An object with properties that will be added as attributes to the SVG element that is created. Attributes with undefined values will not be added. If this parameter is a String then the function is used as a getter and will return the attribute value.
     * @param ns If specified, the attribute will be obtained using getAttributeNs. In order to write namepsaced attributes you can use the namespace:attribute notation within the attributes object.
     * @return The current wrapper object will be returned so it can be used for chaining or the attribute value if used as getter function.
     */
    attr(attributes: string, ns?: string): string | null;
    attr(attributes: Attributes): this;
    /**
     * Create a new SVG element whose wrapper object will be selected for further operations. This way you can also create nested groups easily.
     * @param name The name of the SVG element that should be created as child element of the currently selected element wrapper
     * @param attributes An object with properties that will be added as attributes to the SVG element that is created. Attributes with undefined values will not be added.
     * @param className This class or class list will be added to the SVG element
     * @param insertFirst If this param is set to true in conjunction with a parent element the newly created element will be added as first child element in the parent element
     * @return Returns a Svg wrapper object that can be used to modify the containing SVG data
     */
    elem(name: string, attributes?: Attributes, className?: string, insertFirst?: boolean): Svg;
    /**
     * Returns the parent Chartist.SVG wrapper object
     * @return Returns a Svg wrapper around the parent node of the current node. If the parent node is not existing or it's not an SVG node then this function will return null.
     */
    parent(): Svg | null;
    /**
     * This method returns a Svg wrapper around the root SVG element of the current tree.
     * @return The root SVG element wrapped in a Svg element
     */
    root(): Svg;
    /**
     * Find the first child SVG element of the current element that matches a CSS selector. The returned object is a Svg wrapper.
     * @param selector A CSS selector that is used to query for child SVG elements
     * @return The SVG wrapper for the element found or null if no element was found
     */
    querySelector(selector: string): Svg | null;
    /**
     * Find the all child SVG elements of the current element that match a CSS selector. The returned object is a Svg.List wrapper.
     * @param selector A CSS selector that is used to query for child SVG elements
     * @return The SVG wrapper list for the element found or null if no element was found
     */
    querySelectorAll(selector: string): SvgList;
    /**
     * Returns the underlying SVG node for the current element.
     */
    getNode<T extends Element = Element>(): T;
    /**
     * This method creates a foreignObject (see https://developer.mozilla.org/en-US/docs/Web/SVG/Element/foreignObject) that allows to embed HTML content into a SVG graphic. With the help of foreignObjects you can enable the usage of regular HTML elements inside of SVG where they are subject for SVG positioning and transformation but the Browser will use the HTML rendering capabilities for the containing DOM.
     * @param content The DOM Node, or HTML string that will be converted to a DOM Node, that is then placed into and wrapped by the foreignObject
     * @param attributes An object with properties that will be added as attributes to the foreignObject element that is created. Attributes with undefined values will not be added.
     * @param className This class or class list will be added to the SVG element
     * @param insertFirst Specifies if the foreignObject should be inserted as first child
     * @return New wrapper object that wraps the foreignObject element
     */
    foreignObject(content: string | Node, attributes?: Attributes, className?: string, insertFirst?: boolean): Svg;
    /**
     * This method adds a new text element to the current Svg wrapper.
     * @param t The text that should be added to the text element that is created
     * @return The same wrapper object that was used to add the newly created element
     */
    text(t: string): this;
    /**
     * This method will clear all child nodes of the current wrapper object.
     * @return The same wrapper object that got emptied
     */
    empty(): this;
    /**
     * This method will cause the current wrapper to remove itself from its parent wrapper. Use this method if you'd like to get rid of an element in a given DOM structure.
     * @return The parent wrapper object of the element that got removed
     */
    remove(): Svg | null;
    /**
     * This method will replace the element with a new element that can be created outside of the current DOM.
     * @param newElement The new Svg object that will be used to replace the current wrapper object
     * @return The wrapper of the new element
     */
    replace(newElement: Svg): Svg;
    /**
     * This method will append an element to the current element as a child.
     * @param element The Svg element that should be added as a child
     * @param insertFirst Specifies if the element should be inserted as first child
     * @return The wrapper of the appended object
     */
    append(element: Svg, insertFirst?: boolean): this;
    /**
     * Returns an array of class names that are attached to the current wrapper element. This method can not be chained further.
     * @return A list of classes or an empty array if there are no classes on the current element
     */
    classes(): string[];
    /**
     * Adds one or a space separated list of classes to the current element and ensures the classes are only existing once.
     * @param names A white space separated list of class names
     * @return The wrapper of the current element
     */
    addClass(names: string): this;
    /**
     * Removes one or a space separated list of classes from the current element.
     * @param names A white space separated list of class names
     * @return The wrapper of the current element
     */
    removeClass(names: string): this;
    /**
     * Removes all classes from the current element.
     * @return The wrapper of the current element
     */
    removeAllClasses(): this;
    /**
     * Get element height using `getBoundingClientRect`
     * @return The elements height in pixels
     */
    height(): number;
    /**
     * Get element width using `getBoundingClientRect`
     * @return The elements width in pixels
     */
    width(): number;
    /**
     * The animate function lets you animate the current element with SMIL animations. You can add animations for multiple attributes at the same time by using an animation definition object. This object should contain SMIL animation attributes. Please refer to http://www.w3.org/TR/SVG/animate.html for a detailed specification about the available animation attributes. Additionally an easing property can be passed in the animation definition object. This can be a string with a name of an easing function in `Svg.Easing` or an array with four numbers specifying a cubic Bézier curve.
     * **An animations object could look like this:**
     * ```javascript
     * element.animate({
     *   opacity: {
     *     dur: 1000,
     *     from: 0,
     *     to: 1
     *   },
     *   x1: {
     *     dur: '1000ms',
     *     from: 100,
     *     to: 200,
     *     easing: 'easeOutQuart'
     *   },
     *   y1: {
     *     dur: '2s',
     *     from: 0,
     *     to: 100
     *   }
     * });
     * ```
     * **Automatic unit conversion**
     * For the `dur` and the `begin` animate attribute you can also omit a unit by passing a number. The number will automatically be converted to milli seconds.
     * **Guided mode**
     * The default behavior of SMIL animations with offset using the `begin` attribute is that the attribute will keep it's original value until the animation starts. Mostly this behavior is not desired as you'd like to have your element attributes already initialized with the animation `from` value even before the animation starts. Also if you don't specify `fill="freeze"` on an animate element or if you delete the animation after it's done (which is done in guided mode) the attribute will switch back to the initial value. This behavior is also not desired when performing simple one-time animations. For one-time animations you'd want to trigger animations immediately instead of relative to the document begin time. That's why in guided mode Svg will also use the `begin` property to schedule a timeout and manually start the animation after the timeout. If you're using multiple SMIL definition objects for an attribute (in an array), guided mode will be disabled for this attribute, even if you explicitly enabled it.
     * If guided mode is enabled the following behavior is added:
     * - Before the animation starts (even when delayed with `begin`) the animated attribute will be set already to the `from` value of the animation
     * - `begin` is explicitly set to `indefinite` so it can be started manually without relying on document begin time (creation)
     * - The animate element will be forced to use `fill="freeze"`
     * - The animation will be triggered with `beginElement()` in a timeout where `begin` of the definition object is interpreted in milli seconds. If no `begin` was specified the timeout is triggered immediately.
     * - After the animation the element attribute value will be set to the `to` value of the animation
     * - The animate element is deleted from the DOM
     * @param animations An animations object where the property keys are the attributes you'd like to animate. The properties should be objects again that contain the SMIL animation attributes (usually begin, dur, from, and to). The property begin and dur is auto converted (see Automatic unit conversion). You can also schedule multiple animations for the same attribute by passing an Array of SMIL definition objects. Attributes that contain an array of SMIL definition objects will not be executed in guided mode.
     * @param guided Specify if guided mode should be activated for this animation (see Guided mode). If not otherwise specified, guided mode will be activated.
     * @param eventEmitter If specified, this event emitter will be notified when an animation starts or ends.
     * @return The current element where the animation was added
     */
    animate(animations: Record<string, AnimationDefinition | AnimationDefinition[]>, guided?: boolean, eventEmitter?: EventEmitter): this;
}
//# sourceMappingURL=Svg.d.ts.map