import { Svg } from './Svg';
declare type SvgMethods = Exclude<keyof Svg, 'constructor' | 'parent' | 'querySelector' | 'querySelectorAll' | 'replace' | 'append' | 'classes' | 'height' | 'width'>;
declare type SvgListMethods = {
    [method in SvgMethods]: (...args: Parameters<Svg[method]>) => SvgList;
};
/**
 * This helper class is to wrap multiple `Svg` elements into a list where you can call the `Svg` functions on all elements in the list with one call. This is helpful when you'd like to perform calls with `Svg` on multiple elements.
 * An instance of this class is also returned by `Svg.querySelectorAll`.
 */
export declare class SvgList implements SvgListMethods {
    private svgElements;
    /**
     * @param nodeList An Array of SVG DOM nodes or a SVG DOM NodeList (as returned by document.querySelectorAll)
     */
    constructor(nodeList: ArrayLike<Element>);
    private call;
    attr(...args: Parameters<Svg['attr']>): this;
    elem(...args: Parameters<Svg['elem']>): this;
    root(...args: Parameters<Svg['root']>): this;
    getNode(...args: Parameters<Svg['getNode']>): this;
    foreignObject(...args: Parameters<Svg['foreignObject']>): this;
    text(...args: Parameters<Svg['text']>): this;
    empty(...args: Parameters<Svg['empty']>): this;
    remove(...args: Parameters<Svg['remove']>): this;
    addClass(...args: Parameters<Svg['addClass']>): this;
    removeClass(...args: Parameters<Svg['removeClass']>): this;
    removeAllClasses(...args: Parameters<Svg['removeAllClasses']>): this;
    animate(...args: Parameters<Svg['animate']>): this;
}
export {};
//# sourceMappingURL=SvgList.d.ts.map