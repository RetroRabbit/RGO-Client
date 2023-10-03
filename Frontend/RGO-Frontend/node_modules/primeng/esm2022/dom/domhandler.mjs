/**
 * @dynamic is for runtime initializing DomHandler.browser
 *
 * If delete below comment, we can see this error message:
 *  Metadata collected contains an error that will be reported at runtime:
 *  Only initialized variables and constants can be referenced
 *  because the value of this variable is needed by the template compiler.
 */
// @dynamic
class DomHandler {
    static zindex = 1000;
    static calculatedScrollbarWidth = null;
    static calculatedScrollbarHeight = null;
    static browser;
    static addClass(element, className) {
        if (element && className) {
            if (element.classList)
                element.classList.add(className);
            else
                element.className += ' ' + className;
        }
    }
    static addMultipleClasses(element, className) {
        if (element && className) {
            if (element.classList) {
                let styles = className.trim().split(' ');
                for (let i = 0; i < styles.length; i++) {
                    element.classList.add(styles[i]);
                }
            }
            else {
                let styles = className.split(' ');
                for (let i = 0; i < styles.length; i++) {
                    element.className += ' ' + styles[i];
                }
            }
        }
    }
    static removeClass(element, className) {
        if (element && className) {
            if (element.classList)
                element.classList.remove(className);
            else
                element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }
    static hasClass(element, className) {
        if (element && className) {
            if (element.classList)
                return element.classList.contains(className);
            else
                return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
        }
        return false;
    }
    static siblings(element) {
        return Array.prototype.filter.call(element.parentNode.children, function (child) {
            return child !== element;
        });
    }
    static find(element, selector) {
        return Array.from(element.querySelectorAll(selector));
    }
    static findSingle(element, selector) {
        return this.isElement(element) ? element.querySelector(selector) : null;
    }
    static index(element) {
        let children = element.parentNode.childNodes;
        let num = 0;
        for (var i = 0; i < children.length; i++) {
            if (children[i] == element)
                return num;
            if (children[i].nodeType == 1)
                num++;
        }
        return -1;
    }
    static indexWithinGroup(element, attributeName) {
        let children = element.parentNode ? element.parentNode.childNodes : [];
        let num = 0;
        for (var i = 0; i < children.length; i++) {
            if (children[i] == element)
                return num;
            if (children[i].attributes && children[i].attributes[attributeName] && children[i].nodeType == 1)
                num++;
        }
        return -1;
    }
    static appendOverlay(overlay, target, appendTo = 'self') {
        if (appendTo !== 'self' && overlay && target) {
            this.appendChild(overlay, target);
        }
    }
    static alignOverlay(overlay, target, appendTo = 'self', calculateMinWidth = true) {
        if (overlay && target) {
            if (calculateMinWidth) {
                overlay.style.minWidth = `${DomHandler.getOuterWidth(target)}px`;
            }
            if (appendTo === 'self') {
                this.relativePosition(overlay, target);
            }
            else {
                this.absolutePosition(overlay, target);
            }
        }
    }
    static relativePosition(element, target) {
        const getClosestRelativeElement = (el) => {
            if (!el)
                return;
            return getComputedStyle(el).getPropertyValue('position') === 'relative' ? el : getClosestRelativeElement(el.parentElement);
        };
        const elementDimensions = element.offsetParent ? { width: element.offsetWidth, height: element.offsetHeight } : this.getHiddenElementDimensions(element);
        const targetHeight = target.offsetHeight;
        const targetOffset = target.getBoundingClientRect();
        const windowScrollTop = this.getWindowScrollTop();
        const windowScrollLeft = this.getWindowScrollLeft();
        const viewport = this.getViewport();
        const relativeElement = getClosestRelativeElement(element);
        const relativeElementOffset = relativeElement?.getBoundingClientRect() || { top: -1 * windowScrollTop, left: -1 * windowScrollLeft };
        let top, left;
        if (targetOffset.top + targetHeight + elementDimensions.height > viewport.height) {
            top = targetOffset.top - relativeElementOffset.top - elementDimensions.height;
            element.style.transformOrigin = 'bottom';
            if (targetOffset.top + top < 0) {
                top = -1 * targetOffset.top;
            }
        }
        else {
            top = targetHeight + targetOffset.top - relativeElementOffset.top;
            element.style.transformOrigin = 'top';
        }
        const horizontalOverflow = targetOffset.left + elementDimensions.width - viewport.width;
        const targetLeftOffsetInSpaceOfRelativeElement = targetOffset.left - relativeElementOffset.left;
        if (elementDimensions.width > viewport.width) {
            // element wider then viewport and cannot fit on screen (align at left side of viewport)
            left = (targetOffset.left - relativeElementOffset.left) * -1;
        }
        else if (horizontalOverflow > 0) {
            // element wider then viewport but can be fit on screen (align at right side of viewport)
            left = targetLeftOffsetInSpaceOfRelativeElement - horizontalOverflow;
        }
        else {
            // element fits on screen (align with target)
            left = targetOffset.left - relativeElementOffset.left;
        }
        element.style.top = top + 'px';
        element.style.left = left + 'px';
    }
    static absolutePosition(element, target) {
        const elementDimensions = element.offsetParent ? { width: element.offsetWidth, height: element.offsetHeight } : this.getHiddenElementDimensions(element);
        const elementOuterHeight = elementDimensions.height;
        const elementOuterWidth = elementDimensions.width;
        const targetOuterHeight = target.offsetHeight;
        const targetOuterWidth = target.offsetWidth;
        const targetOffset = target.getBoundingClientRect();
        const windowScrollTop = this.getWindowScrollTop();
        const windowScrollLeft = this.getWindowScrollLeft();
        const viewport = this.getViewport();
        let top, left;
        if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
            top = targetOffset.top + windowScrollTop - elementOuterHeight;
            element.style.transformOrigin = 'bottom';
            if (top < 0) {
                top = windowScrollTop;
            }
        }
        else {
            top = targetOuterHeight + targetOffset.top + windowScrollTop;
            element.style.transformOrigin = 'top';
        }
        if (targetOffset.left + elementOuterWidth > viewport.width)
            left = Math.max(0, targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth);
        else
            left = targetOffset.left + windowScrollLeft;
        element.style.top = top + 'px';
        element.style.left = left + 'px';
    }
    static getParents(element, parents = []) {
        return element['parentNode'] === null ? parents : this.getParents(element.parentNode, parents.concat([element.parentNode]));
    }
    static getScrollableParents(element) {
        let scrollableParents = [];
        if (element) {
            let parents = this.getParents(element);
            const overflowRegex = /(auto|scroll)/;
            const overflowCheck = (node) => {
                let styleDeclaration = window['getComputedStyle'](node, null);
                return overflowRegex.test(styleDeclaration.getPropertyValue('overflow')) || overflowRegex.test(styleDeclaration.getPropertyValue('overflowX')) || overflowRegex.test(styleDeclaration.getPropertyValue('overflowY'));
            };
            for (let parent of parents) {
                let scrollSelectors = parent.nodeType === 1 && parent.dataset['scrollselectors'];
                if (scrollSelectors) {
                    let selectors = scrollSelectors.split(',');
                    for (let selector of selectors) {
                        let el = this.findSingle(parent, selector);
                        if (el && overflowCheck(el)) {
                            scrollableParents.push(el);
                        }
                    }
                }
                if (parent.nodeType !== 9 && overflowCheck(parent)) {
                    scrollableParents.push(parent);
                }
            }
        }
        return scrollableParents;
    }
    static getHiddenElementOuterHeight(element) {
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        let elementHeight = element.offsetHeight;
        element.style.display = 'none';
        element.style.visibility = 'visible';
        return elementHeight;
    }
    static getHiddenElementOuterWidth(element) {
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        let elementWidth = element.offsetWidth;
        element.style.display = 'none';
        element.style.visibility = 'visible';
        return elementWidth;
    }
    static getHiddenElementDimensions(element) {
        let dimensions = {};
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        dimensions.width = element.offsetWidth;
        dimensions.height = element.offsetHeight;
        element.style.display = 'none';
        element.style.visibility = 'visible';
        return dimensions;
    }
    static scrollInView(container, item) {
        let borderTopValue = getComputedStyle(container).getPropertyValue('borderTopWidth');
        let borderTop = borderTopValue ? parseFloat(borderTopValue) : 0;
        let paddingTopValue = getComputedStyle(container).getPropertyValue('paddingTop');
        let paddingTop = paddingTopValue ? parseFloat(paddingTopValue) : 0;
        let containerRect = container.getBoundingClientRect();
        let itemRect = item.getBoundingClientRect();
        let offset = itemRect.top + document.body.scrollTop - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
        let scroll = container.scrollTop;
        let elementHeight = container.clientHeight;
        let itemHeight = this.getOuterHeight(item);
        if (offset < 0) {
            container.scrollTop = scroll + offset;
        }
        else if (offset + itemHeight > elementHeight) {
            container.scrollTop = scroll + offset - elementHeight + itemHeight;
        }
    }
    static fadeIn(element, duration) {
        element.style.opacity = 0;
        let last = +new Date();
        let opacity = 0;
        let tick = function () {
            opacity = +element.style.opacity.replace(',', '.') + (new Date().getTime() - last) / duration;
            element.style.opacity = opacity;
            last = +new Date();
            if (+opacity < 1) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }
        };
        tick();
    }
    static fadeOut(element, ms) {
        var opacity = 1, interval = 50, duration = ms, gap = interval / duration;
        let fading = setInterval(() => {
            opacity = opacity - gap;
            if (opacity <= 0) {
                opacity = 0;
                clearInterval(fading);
            }
            element.style.opacity = opacity;
        }, interval);
    }
    static getWindowScrollTop() {
        let doc = document.documentElement;
        return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    }
    static getWindowScrollLeft() {
        let doc = document.documentElement;
        return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    }
    static matches(element, selector) {
        var p = Element.prototype;
        var f = p['matches'] ||
            p.webkitMatchesSelector ||
            p['mozMatchesSelector'] ||
            p['msMatchesSelector'] ||
            function (s) {
                return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
            };
        return f.call(element, selector);
    }
    static getOuterWidth(el, margin) {
        let width = el.offsetWidth;
        if (margin) {
            let style = getComputedStyle(el);
            width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        }
        return width;
    }
    static getHorizontalPadding(el) {
        let style = getComputedStyle(el);
        return parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    }
    static getHorizontalMargin(el) {
        let style = getComputedStyle(el);
        return parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }
    static innerWidth(el) {
        let width = el.offsetWidth;
        let style = getComputedStyle(el);
        width += parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        return width;
    }
    static width(el) {
        let width = el.offsetWidth;
        let style = getComputedStyle(el);
        width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        return width;
    }
    static getInnerHeight(el) {
        let height = el.offsetHeight;
        let style = getComputedStyle(el);
        height += parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
        return height;
    }
    static getOuterHeight(el, margin) {
        let height = el.offsetHeight;
        if (margin) {
            let style = getComputedStyle(el);
            height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        }
        return height;
    }
    static getHeight(el) {
        let height = el.offsetHeight;
        let style = getComputedStyle(el);
        height -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
        return height;
    }
    static getWidth(el) {
        let width = el.offsetWidth;
        let style = getComputedStyle(el);
        width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
        return width;
    }
    static getViewport() {
        let win = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], w = win.innerWidth || e.clientWidth || g.clientWidth, h = win.innerHeight || e.clientHeight || g.clientHeight;
        return { width: w, height: h };
    }
    static getOffset(el) {
        var rect = el.getBoundingClientRect();
        return {
            top: rect.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
            left: rect.left + (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0)
        };
    }
    static replaceElementWith(element, replacementElement) {
        let parentNode = element.parentNode;
        if (!parentNode)
            throw `Can't replace element`;
        return parentNode.replaceChild(replacementElement, element);
    }
    static getUserAgent() {
        if (navigator && this.isClient()) {
            return navigator.userAgent;
        }
    }
    static isIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return true;
        }
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return true;
        }
        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return true;
        }
        // other browser
        return false;
    }
    static isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window['MSStream'];
    }
    static isAndroid() {
        return /(android)/i.test(navigator.userAgent);
    }
    static isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    static appendChild(element, target) {
        if (this.isElement(target))
            target.appendChild(element);
        else if (target && target.el && target.el.nativeElement)
            target.el.nativeElement.appendChild(element);
        else
            throw 'Cannot append ' + target + ' to ' + element;
    }
    static removeChild(element, target) {
        if (this.isElement(target))
            target.removeChild(element);
        else if (target.el && target.el.nativeElement)
            target.el.nativeElement.removeChild(element);
        else
            throw 'Cannot remove ' + element + ' from ' + target;
    }
    static removeElement(element) {
        if (!('remove' in Element.prototype))
            element.parentNode.removeChild(element);
        else
            element.remove();
    }
    static isElement(obj) {
        return typeof HTMLElement === 'object' ? obj instanceof HTMLElement : obj && typeof obj === 'object' && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    }
    static calculateScrollbarWidth(el) {
        if (el) {
            let style = getComputedStyle(el);
            return el.offsetWidth - el.clientWidth - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth);
        }
        else {
            if (this.calculatedScrollbarWidth !== null)
                return this.calculatedScrollbarWidth;
            let scrollDiv = document.createElement('div');
            scrollDiv.className = 'p-scrollbar-measure';
            document.body.appendChild(scrollDiv);
            let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
            this.calculatedScrollbarWidth = scrollbarWidth;
            return scrollbarWidth;
        }
    }
    static calculateScrollbarHeight() {
        if (this.calculatedScrollbarHeight !== null)
            return this.calculatedScrollbarHeight;
        let scrollDiv = document.createElement('div');
        scrollDiv.className = 'p-scrollbar-measure';
        document.body.appendChild(scrollDiv);
        let scrollbarHeight = scrollDiv.offsetHeight - scrollDiv.clientHeight;
        document.body.removeChild(scrollDiv);
        this.calculatedScrollbarWidth = scrollbarHeight;
        return scrollbarHeight;
    }
    static invokeElementMethod(element, methodName, args) {
        element[methodName].apply(element, args);
    }
    static clearSelection() {
        if (window.getSelection) {
            if (window.getSelection().empty) {
                window.getSelection().empty();
            }
            else if (window.getSelection().removeAllRanges && window.getSelection().rangeCount > 0 && window.getSelection().getRangeAt(0).getClientRects().length > 0) {
                window.getSelection().removeAllRanges();
            }
        }
        else if (document['selection'] && document['selection'].empty) {
            try {
                document['selection'].empty();
            }
            catch (error) {
                //ignore IE bug
            }
        }
    }
    static getBrowser() {
        if (!this.browser) {
            let matched = this.resolveUserAgent();
            this.browser = {};
            if (matched.browser) {
                this.browser[matched.browser] = true;
                this.browser['version'] = matched.version;
            }
            if (this.browser['chrome']) {
                this.browser['webkit'] = true;
            }
            else if (this.browser['webkit']) {
                this.browser['safari'] = true;
            }
        }
        return this.browser;
    }
    static resolveUserAgent() {
        let ua = navigator.userAgent.toLowerCase();
        let match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || (ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) || [];
        return {
            browser: match[1] || '',
            version: match[2] || '0'
        };
    }
    static isInteger(value) {
        if (Number.isInteger) {
            return Number.isInteger(value);
        }
        else {
            return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
        }
    }
    static isHidden(element) {
        return !element || element.offsetParent === null;
    }
    static isVisible(element) {
        return element && element.offsetParent != null;
    }
    static isExist(element) {
        return element !== null && typeof element !== 'undefined' && element.nodeName && element.parentNode;
    }
    static focus(element, options) {
        element && document.activeElement !== element && element.focus(options);
    }
    static getFocusableElements(element) {
        let focusableElements = DomHandler.find(element, `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),
                [href]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),
                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]), select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),
                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]), [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),
                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]):not(.p-disabled)`);
        let visibleFocusableElements = [];
        for (let focusableElement of focusableElements) {
            if (!!(focusableElement.offsetWidth || focusableElement.offsetHeight || focusableElement.getClientRects().length))
                visibleFocusableElements.push(focusableElement);
        }
        return visibleFocusableElements;
    }
    static getNextFocusableElement(element, reverse = false) {
        const focusableElements = DomHandler.getFocusableElements(element);
        let index = 0;
        if (focusableElements && focusableElements.length > 0) {
            const focusedIndex = focusableElements.indexOf(focusableElements[0].ownerDocument.activeElement);
            if (reverse) {
                if (focusedIndex == -1 || focusedIndex === 0) {
                    index = focusableElements.length - 1;
                }
                else {
                    index = focusedIndex - 1;
                }
            }
            else if (focusedIndex != -1 && focusedIndex !== focusableElements.length - 1) {
                index = focusedIndex + 1;
            }
        }
        return focusableElements[index];
    }
    static generateZIndex() {
        this.zindex = this.zindex || 999;
        return ++this.zindex;
    }
    static getSelection() {
        if (window.getSelection)
            return window.getSelection().toString();
        else if (document.getSelection)
            return document.getSelection().toString();
        else if (document['selection'])
            return document['selection'].createRange().text;
        return null;
    }
    static getTargetElement(target, el) {
        if (!target)
            return null;
        switch (target) {
            case 'document':
                return document;
            case 'window':
                return window;
            case '@next':
                return el?.nextElementSibling;
            case '@prev':
                return el?.previousElementSibling;
            case '@parent':
                return el?.parentElement;
            case '@grandparent':
                return el?.parentElement.parentElement;
            default:
                const type = typeof target;
                if (type === 'string') {
                    return document.querySelector(target);
                }
                else if (type === 'object' && target.hasOwnProperty('nativeElement')) {
                    return this.isExist(target.nativeElement) ? target.nativeElement : undefined;
                }
                const isFunction = (obj) => !!(obj && obj.constructor && obj.call && obj.apply);
                const element = isFunction(target) ? target() : target;
                return (element && element.nodeType === 9) || this.isExist(element) ? element : null;
        }
    }
    static isClient() {
        return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
    }
    static getAttribute(element, name) {
        if (element) {
            const value = element.getAttribute(name);
            if (!isNaN(value)) {
                return +value;
            }
            if (value === 'true' || value === 'false') {
                return value === 'true';
            }
            return value;
        }
        return undefined;
    }
}
export { DomHandler };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9taGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9kb20vZG9taGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztHQU9HO0FBQ0gsV0FBVztBQUNYLE1BQWEsVUFBVTtJQUNaLE1BQU0sQ0FBQyxNQUFNLEdBQVcsSUFBSSxDQUFDO0lBRTVCLE1BQU0sQ0FBQyx3QkFBd0IsR0FBVyxJQUFJLENBQUM7SUFFL0MsTUFBTSxDQUFDLHlCQUF5QixHQUFXLElBQUksQ0FBQztJQUVoRCxNQUFNLENBQUMsT0FBTyxDQUFNO0lBRXJCLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBWSxFQUFFLFNBQWlCO1FBQ2xELElBQUksT0FBTyxJQUFJLFNBQVMsRUFBRTtZQUN0QixJQUFJLE9BQU8sQ0FBQyxTQUFTO2dCQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztnQkFDbkQsT0FBTyxDQUFDLFNBQVMsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDO1NBQzdDO0lBQ0wsQ0FBQztJQUVNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFZLEVBQUUsU0FBaUI7UUFDNUQsSUFBSSxPQUFPLElBQUksU0FBUyxFQUFFO1lBQ3RCLElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRTtnQkFDbkIsSUFBSSxNQUFNLEdBQWEsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3BDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNwQzthQUNKO2lCQUFNO2dCQUNILElBQUksTUFBTSxHQUFhLFNBQVMsQ0FB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LE9BQU8sS0FBSyxLQUFLLE1BQU0sQ0FBQzthQUMzQjtZQUVELE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQzs7U0E3ckJRLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBkeW5hbWljIGlzIGZvciBydW50aW1lIGluaXRpYWxpemluZyBEb21IYW5kbGVyLmJyb3dzZXJcbiAqXG4gKiBJZiBkZWxldGUgYmVsb3cgY29tbWVudCwgd2UgY2FuIHNlZSB0aGlzIGVycm9yIG1lc3NhZ2U6XG4gKiAgTWV0YWRhdGEgY29sbGVjdGVkIGNvbnRhaW5zIGFuIGVycm9yIHRoYXQgd2lsbCBiZSByZXBvcnRlZCBhdCBydW50aW1lOlxuICogIE9ubHkgaW5pdGlhbGl6ZWQgdmFyaWFibGVzIGFuZCBjb25zdGFudHMgY2FuIGJlIHJlZmVyZW5jZWRcbiAqICBiZWNhdXNlIHRoZSB2YWx1ZSBvZiB0aGlzIHZhcmlhYmxlIGlzIG5lZWRlZCBieSB0aGUgdGVtcGxhdGUgY29tcGlsZXIuXG4gKi9cbi8vIEBkeW5hbWljXG5leHBvcnQgY2xhc3MgRG9tSGFuZGxlciB7XG4gICAgcHVibGljIHN0YXRpYyB6aW5kZXg6IG51bWJlciA9IDEwMDA7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBjYWxjdWxhdGVkU2Nyb2xsYmFyV2lkdGg6IG51bWJlciA9IG51bGw7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBjYWxjdWxhdGVkU2Nyb2xsYmFySGVpZ2h0OiBudW1iZXIgPSBudWxsO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJvd3NlcjogYW55O1xuXG4gICAgcHVibGljIHN0YXRpYyBhZGRDbGFzcyhlbGVtZW50OiBhbnksIGNsYXNzTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmIChlbGVtZW50ICYmIGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgICAgIGVsc2UgZWxlbWVudC5jbGFzc05hbWUgKz0gJyAnICsgY2xhc3NOYW1lO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBhZGRNdWx0aXBsZUNsYXNzZXMoZWxlbWVudDogYW55LCBjbGFzc05hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBpZiAoZWxlbWVudCAmJiBjbGFzc05hbWUpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgICAgICAgICAgICAgIGxldCBzdHlsZXM6IHN0cmluZ1tdID0gY2xhc3NOYW1lLnRyaW0oKS5zcGxpdCgnICcpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChzdHlsZXNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0eWxlczogc3RyaW5nW10gPSBjbGFzc05hbWUuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSArPSAnICcgKyBzdHlsZXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyByZW1vdmVDbGFzcyhlbGVtZW50OiBhbnksIGNsYXNzTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmIChlbGVtZW50ICYmIGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgICAgICAgIGVsc2UgZWxlbWVudC5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJyhefFxcXFxiKScgKyBjbGFzc05hbWUuc3BsaXQoJyAnKS5qb2luKCd8JykgKyAnKFxcXFxifCQpJywgJ2dpJyksICcgJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGhhc0NsYXNzKGVsZW1lbnQ6IGFueSwgY2xhc3NOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgJiYgY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHJldHVybiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpO1xuICAgICAgICAgICAgZWxzZSByZXR1cm4gbmV3IFJlZ0V4cCgnKF58ICknICsgY2xhc3NOYW1lICsgJyggfCQpJywgJ2dpJykudGVzdChlbGVtZW50LmNsYXNzTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBzaWJsaW5ncyhlbGVtZW50OiBhbnkpOiBhbnkge1xuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmZpbHRlci5jYWxsKGVsZW1lbnQucGFyZW50Tm9kZS5jaGlsZHJlbiwgZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hpbGQgIT09IGVsZW1lbnQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZmluZChlbGVtZW50OiBhbnksIHNlbGVjdG9yOiBzdHJpbmcpOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZmluZFNpbmdsZShlbGVtZW50OiBhbnksIHNlbGVjdG9yOiBzdHJpbmcpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0VsZW1lbnQoZWxlbWVudCkgPyBlbGVtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIDogbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGluZGV4KGVsZW1lbnQ6IGFueSk6IG51bWJlciB7XG4gICAgICAgIGxldCBjaGlsZHJlbiA9IGVsZW1lbnQucGFyZW50Tm9kZS5jaGlsZE5vZGVzO1xuICAgICAgICBsZXQgbnVtID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGNoaWxkcmVuW2ldID09IGVsZW1lbnQpIHJldHVybiBudW07XG4gICAgICAgICAgICBpZiAoY2hpbGRyZW5baV0ubm9kZVR5cGUgPT0gMSkgbnVtKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgaW5kZXhXaXRoaW5Hcm91cChlbGVtZW50OiBhbnksIGF0dHJpYnV0ZU5hbWU6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGxldCBjaGlsZHJlbiA9IGVsZW1lbnQucGFyZW50Tm9kZSA/IGVsZW1lbnQucGFyZW50Tm9kZS5jaGlsZE5vZGVzIDogW107XG4gICAgICAgIGxldCBudW0gPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY2hpbGRyZW5baV0gPT0gZWxlbWVudCkgcmV0dXJuIG51bTtcbiAgICAgICAgICAgIGlmIChjaGlsZHJlbltpXS5hdHRyaWJ1dGVzICYmIGNoaWxkcmVuW2ldLmF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gJiYgY2hpbGRyZW5baV0ubm9kZVR5cGUgPT0gMSkgbnVtKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgYXBwZW5kT3ZlcmxheShvdmVybGF5OiBhbnksIHRhcmdldDogYW55LCBhcHBlbmRUbzogYW55ID0gJ3NlbGYnKSB7XG4gICAgICAgIGlmIChhcHBlbmRUbyAhPT0gJ3NlbGYnICYmIG92ZXJsYXkgJiYgdGFyZ2V0KSB7XG4gICAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKG92ZXJsYXksIHRhcmdldCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGFsaWduT3ZlcmxheShvdmVybGF5OiBhbnksIHRhcmdldDogYW55LCBhcHBlbmRUbzogYW55ID0gJ3NlbGYnLCBjYWxjdWxhdGVNaW5XaWR0aDogYm9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgaWYgKG92ZXJsYXkgJiYgdGFyZ2V0KSB7XG4gICAgICAgICAgICBpZiAoY2FsY3VsYXRlTWluV2lkdGgpIHtcbiAgICAgICAgICAgICAgICBvdmVybGF5LnN0eWxlLm1pbldpZHRoID0gYCR7RG9tSGFuZGxlci5nZXRPdXRlcldpZHRoKHRhcmdldCl9cHhgO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYXBwZW5kVG8gPT09ICdzZWxmJykge1xuICAgICAgICAgICAgICAgIHRoaXMucmVsYXRpdmVQb3NpdGlvbihvdmVybGF5LCB0YXJnZXQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFic29sdXRlUG9zaXRpb24ob3ZlcmxheSwgdGFyZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgcmVsYXRpdmVQb3NpdGlvbihlbGVtZW50OiBhbnksIHRhcmdldDogYW55KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGdldENsb3Nlc3RSZWxhdGl2ZUVsZW1lbnQgPSAoZWwpID0+IHtcbiAgICAgICAgICAgIGlmICghZWwpIHJldHVybjtcblxuICAgICAgICAgICAgcmV0dXJuIGdldENvbXB1dGVkU3R5bGUoZWwpLmdldFByb3BlcnR5VmFsdWUoJ3Bvc2l0aW9uJykgPT09ICdyZWxhdGl2ZScgPyBlbCA6IGdldENsb3Nlc3RSZWxhdGl2ZUVsZW1lbnQoZWwucGFyZW50RWxlbWVudCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgZWxlbWVudERpbWVuc2lvbnMgPSBlbGVtZW50Lm9mZnNldFBhcmVudCA/IHsgd2lkdGg6IGVsZW1lbnQub2Zmc2V0V2lkdGgsIGhlaWdodDogZWxlbWVudC5vZmZzZXRIZWlnaHQgfSA6IHRoaXMuZ2V0SGlkZGVuRWxlbWVudERpbWVuc2lvbnMoZWxlbWVudCk7XG4gICAgICAgIGNvbnN0IHRhcmdldEhlaWdodCA9IHRhcmdldC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIGNvbnN0IHRhcmdldE9mZnNldCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3Qgd2luZG93U2Nyb2xsVG9wID0gdGhpcy5nZXRXaW5kb3dTY3JvbGxUb3AoKTtcbiAgICAgICAgY29uc3Qgd2luZG93U2Nyb2xsTGVmdCA9IHRoaXMuZ2V0V2luZG93U2Nyb2xsTGVmdCgpO1xuICAgICAgICBjb25zdCB2aWV3cG9ydCA9IHRoaXMuZ2V0Vmlld3BvcnQoKTtcbiAgICAgICAgY29uc3QgcmVsYXRpdmVFbGVtZW50ID0gZ2V0Q2xvc2VzdFJlbGF0aXZlRWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgY29uc3QgcmVsYXRpdmVFbGVtZW50T2Zmc2V0ID0gcmVsYXRpdmVFbGVtZW50Py5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSB8fCB7IHRvcDogLTEgKiB3aW5kb3dTY3JvbGxUb3AsIGxlZnQ6IC0xICogd2luZG93U2Nyb2xsTGVmdCB9O1xuICAgICAgICBsZXQgdG9wOiBudW1iZXIsIGxlZnQ6IG51bWJlcjtcblxuICAgICAgICBpZiAodGFyZ2V0T2Zmc2V0LnRvcCArIHRhcmdldEhlaWdodCArIGVsZW1lbnREaW1lbnNpb25zLmhlaWdodCA+IHZpZXdwb3J0LmhlaWdodCkge1xuICAgICAgICAgICAgdG9wID0gdGFyZ2V0T2Zmc2V0LnRvcCAtIHJlbGF0aXZlRWxlbWVudE9mZnNldC50b3AgLSBlbGVtZW50RGltZW5zaW9ucy5oZWlnaHQ7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICdib3R0b20nO1xuICAgICAgICAgICAgaWYgKHRhcmdldE9mZnNldC50b3AgKyB0b3AgPCAwKSB7XG4gICAgICAgICAgICAgICAgdG9wID0gLTEgKiB0YXJnZXRPZmZzZXQudG9wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9wID0gdGFyZ2V0SGVpZ2h0ICsgdGFyZ2V0T2Zmc2V0LnRvcCAtIHJlbGF0aXZlRWxlbWVudE9mZnNldC50b3A7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICd0b3AnO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaG9yaXpvbnRhbE92ZXJmbG93ID0gdGFyZ2V0T2Zmc2V0LmxlZnQgKyBlbGVtZW50RGltZW5zaW9ucy53aWR0aCAtIHZpZXdwb3J0LndpZHRoO1xuICAgICAgICBjb25zdCB0YXJnZXRMZWZ0T2Zmc2V0SW5TcGFjZU9mUmVsYXRpdmVFbGVtZW50ID0gdGFyZ2V0T2Zmc2V0LmxlZnQgLSByZWxhdGl2ZUVsZW1lbnRPZmZzZXQubGVmdDtcbiAgICAgICAgaWYgKGVsZW1lbnREaW1lbnNpb25zLndpZHRoID4gdmlld3BvcnQud2lkdGgpIHtcbiAgICAgICAgICAgIC8vIGVsZW1lbnQgd2lkZXIgdGhlbiB2aWV3cG9ydCBhbmQgY2Fubm90IGZpdCBvbiBzY3JlZW4gKGFsaWduIGF0IGxlZnQgc2lkZSBvZiB2aWV3cG9ydClcbiAgICAgICAgICAgIGxlZnQgPSAodGFyZ2V0T2Zmc2V0LmxlZnQgLSByZWxhdGl2ZUVsZW1lbnRPZmZzZXQubGVmdCkgKiAtMTtcbiAgICAgICAgfSBlbHNlIGlmIChob3Jpem9udGFsT3ZlcmZsb3cgPiAwKSB7XG4gICAgICAgICAgICAvLyBlbGVtZW50IHdpZGVyIHRoZW4gdmlld3BvcnQgYnV0IGNhbiBiZSBmaXQgb24gc2NyZWVuIChhbGlnbiBhdCByaWdodCBzaWRlIG9mIHZpZXdwb3J0KVxuICAgICAgICAgICAgbGVmdCA9IHRhcmdldExlZnRPZmZzZXRJblNwYWNlT2ZSZWxhdGl2ZUVsZW1lbnQgLSBob3Jpem9udGFsT3ZlcmZsb3c7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBlbGVtZW50IGZpdHMgb24gc2NyZWVuIChhbGlnbiB3aXRoIHRhcmdldClcbiAgICAgICAgICAgIGxlZnQgPSB0YXJnZXRPZmZzZXQubGVmdCAtIHJlbGF0aXZlRWxlbWVudE9mZnNldC5sZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xuICAgICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGFic29sdXRlUG9zaXRpb24oZWxlbWVudDogYW55LCB0YXJnZXQ6IGFueSk6IHZvaWQge1xuICAgICAgICBjb25zdCBlbGVtZW50RGltZW5zaW9ucyA9IGVsZW1lbnQub2Zmc2V0UGFyZW50ID8geyB3aWR0aDogZWxlbWVudC5vZmZzZXRXaWR0aCwgaGVpZ2h0OiBlbGVtZW50Lm9mZnNldEhlaWdodCB9IDogdGhpcy5nZXRIaWRkZW5FbGVtZW50RGltZW5zaW9ucyhlbGVtZW50KTtcbiAgICAgICAgY29uc3QgZWxlbWVudE91dGVySGVpZ2h0ID0gZWxlbWVudERpbWVuc2lvbnMuaGVpZ2h0O1xuICAgICAgICBjb25zdCBlbGVtZW50T3V0ZXJXaWR0aCA9IGVsZW1lbnREaW1lbnNpb25zLndpZHRoO1xuICAgICAgICBjb25zdCB0YXJnZXRPdXRlckhlaWdodCA9IHRhcmdldC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIGNvbnN0IHRhcmdldE91dGVyV2lkdGggPSB0YXJnZXQub2Zmc2V0V2lkdGg7XG4gICAgICAgIGNvbnN0IHRhcmdldE9mZnNldCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3Qgd2luZG93U2Nyb2xsVG9wID0gdGhpcy5nZXRXaW5kb3dTY3JvbGxUb3AoKTtcbiAgICAgICAgY29uc3Qgd2luZG93U2Nyb2xsTGVmdCA9IHRoaXMuZ2V0V2luZG93U2Nyb2xsTGVmdCgpO1xuICAgICAgICBjb25zdCB2aWV3cG9ydCA9IHRoaXMuZ2V0Vmlld3BvcnQoKTtcbiAgICAgICAgbGV0IHRvcDogbnVtYmVyLCBsZWZ0OiBudW1iZXI7XG5cbiAgICAgICAgaWYgKHRhcmdldE9mZnNldC50b3AgKyB0YXJnZXRPdXRlckhlaWdodCArIGVsZW1lbnRPdXRlckhlaWdodCA+IHZpZXdwb3J0LmhlaWdodCkge1xuICAgICAgICAgICAgdG9wID0gdGFyZ2V0T2Zmc2V0LnRvcCArIHdpbmRvd1Njcm9sbFRvcCAtIGVsZW1lbnRPdXRlckhlaWdodDtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gJ2JvdHRvbSc7XG5cbiAgICAgICAgICAgIGlmICh0b3AgPCAwKSB7XG4gICAgICAgICAgICAgICAgdG9wID0gd2luZG93U2Nyb2xsVG9wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9wID0gdGFyZ2V0T3V0ZXJIZWlnaHQgKyB0YXJnZXRPZmZzZXQudG9wICsgd2luZG93U2Nyb2xsVG9wO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSAndG9wJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0YXJnZXRPZmZzZXQubGVmdCArIGVsZW1lbnRPdXRlcldpZHRoID4gdmlld3BvcnQud2lkdGgpIGxlZnQgPSBNYXRoLm1heCgwLCB0YXJnZXRPZmZzZXQubGVmdCArIHdpbmRvd1Njcm9sbExlZnQgKyB0YXJnZXRPdXRlcldpZHRoIC0gZWxlbWVudE91dGVyV2lkdGgpO1xuICAgICAgICBlbHNlIGxlZnQgPSB0YXJnZXRPZmZzZXQubGVmdCArIHdpbmRvd1Njcm9sbExlZnQ7XG5cbiAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xuICAgICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0UGFyZW50cyhlbGVtZW50OiBhbnksIHBhcmVudHM6IGFueSA9IFtdKTogYW55IHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRbJ3BhcmVudE5vZGUnXSA9PT0gbnVsbCA/IHBhcmVudHMgOiB0aGlzLmdldFBhcmVudHMoZWxlbWVudC5wYXJlbnROb2RlLCBwYXJlbnRzLmNvbmNhdChbZWxlbWVudC5wYXJlbnROb2RlXSkpO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRTY3JvbGxhYmxlUGFyZW50cyhlbGVtZW50OiBhbnkpIHtcbiAgICAgICAgbGV0IHNjcm9sbGFibGVQYXJlbnRzID0gW107XG5cbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGxldCBwYXJlbnRzID0gdGhpcy5nZXRQYXJlbnRzKGVsZW1lbnQpO1xuICAgICAgICAgICAgY29uc3Qgb3ZlcmZsb3dSZWdleCA9IC8oYXV0b3xzY3JvbGwpLztcbiAgICAgICAgICAgIGNvbnN0IG92ZXJmbG93Q2hlY2sgPSAobm9kZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHN0eWxlRGVjbGFyYXRpb24gPSB3aW5kb3dbJ2dldENvbXB1dGVkU3R5bGUnXShub2RlLCBudWxsKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3ZlcmZsb3dSZWdleC50ZXN0KHN0eWxlRGVjbGFyYXRpb24uZ2V0UHJvcGVydHlWYWx1ZSgnb3ZlcmZsb3cnKSkgfHwgb3ZlcmZsb3dSZWdleC50ZXN0KHN0eWxlRGVjbGFyYXRpb24uZ2V0UHJvcGVydHlWYWx1ZSgnb3ZlcmZsb3dYJykpIHx8IG92ZXJmbG93UmVnZXgudGVzdChzdHlsZURlY2xhcmF0aW9uLmdldFByb3BlcnR5VmFsdWUoJ292ZXJmbG93WScpKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZvciAobGV0IHBhcmVudCBvZiBwYXJlbnRzKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNjcm9sbFNlbGVjdG9ycyA9IHBhcmVudC5ub2RlVHlwZSA9PT0gMSAmJiBwYXJlbnQuZGF0YXNldFsnc2Nyb2xsc2VsZWN0b3JzJ107XG4gICAgICAgICAgICAgICAgaWYgKHNjcm9sbFNlbGVjdG9ycykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0b3JzID0gc2Nyb2xsU2VsZWN0b3JzLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVsID0gdGhpcy5maW5kU2luZ2xlKHBhcmVudCwgc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsICYmIG92ZXJmbG93Q2hlY2soZWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsYWJsZVBhcmVudHMucHVzaChlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocGFyZW50Lm5vZGVUeXBlICE9PSA5ICYmIG92ZXJmbG93Q2hlY2socGFyZW50KSkge1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxhYmxlUGFyZW50cy5wdXNoKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNjcm9sbGFibGVQYXJlbnRzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SGlkZGVuRWxlbWVudE91dGVySGVpZ2h0KGVsZW1lbnQ6IGFueSk6IG51bWJlciB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBsZXQgZWxlbWVudEhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcblxuICAgICAgICByZXR1cm4gZWxlbWVudEhlaWdodDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldEhpZGRlbkVsZW1lbnRPdXRlcldpZHRoKGVsZW1lbnQ6IGFueSk6IG51bWJlciB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBsZXQgZWxlbWVudFdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBlbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnRXaWR0aDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldEhpZGRlbkVsZW1lbnREaW1lbnNpb25zKGVsZW1lbnQ6IGFueSk6IGFueSB7XG4gICAgICAgIGxldCBkaW1lbnNpb25zOiBhbnkgPSB7fTtcbiAgICAgICAgZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGRpbWVuc2lvbnMud2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICBkaW1lbnNpb25zLmhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcblxuICAgICAgICByZXR1cm4gZGltZW5zaW9ucztcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHNjcm9sbEluVmlldyhjb250YWluZXIsIGl0ZW0pIHtcbiAgICAgICAgbGV0IGJvcmRlclRvcFZhbHVlOiBzdHJpbmcgPSBnZXRDb21wdXRlZFN0eWxlKGNvbnRhaW5lcikuZ2V0UHJvcGVydHlWYWx1ZSgnYm9yZGVyVG9wV2lkdGgnKTtcbiAgICAgICAgbGV0IGJvcmRlclRvcDogbnVtYmVyID0gYm9yZGVyVG9wVmFsdWUgPyBwYXJzZUZsb2F0KGJvcmRlclRvcFZhbHVlKSA6IDA7XG4gICAgICAgIGxldCBwYWRkaW5nVG9wVmFsdWU6IHN0cmluZyA9IGdldENvbXB1dGVkU3R5bGUoY29udGFpbmVyKS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nVG9wJyk7XG4gICAgICAgIGxldCBwYWRkaW5nVG9wOiBudW1iZXIgPSBwYWRkaW5nVG9wVmFsdWUgPyBwYXJzZUZsb2F0KHBhZGRpbmdUb3BWYWx1ZSkgOiAwO1xuICAgICAgICBsZXQgY29udGFpbmVyUmVjdCA9IGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgbGV0IGl0ZW1SZWN0ID0gaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgbGV0IG9mZnNldCA9IGl0ZW1SZWN0LnRvcCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIC0gKGNvbnRhaW5lclJlY3QudG9wICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIC0gYm9yZGVyVG9wIC0gcGFkZGluZ1RvcDtcbiAgICAgICAgbGV0IHNjcm9sbCA9IGNvbnRhaW5lci5zY3JvbGxUb3A7XG4gICAgICAgIGxldCBlbGVtZW50SGVpZ2h0ID0gY29udGFpbmVyLmNsaWVudEhlaWdodDtcbiAgICAgICAgbGV0IGl0ZW1IZWlnaHQgPSB0aGlzLmdldE91dGVySGVpZ2h0KGl0ZW0pO1xuXG4gICAgICAgIGlmIChvZmZzZXQgPCAwKSB7XG4gICAgICAgICAgICBjb250YWluZXIuc2Nyb2xsVG9wID0gc2Nyb2xsICsgb2Zmc2V0O1xuICAgICAgICB9IGVsc2UgaWYgKG9mZnNldCArIGl0ZW1IZWlnaHQgPiBlbGVtZW50SGVpZ2h0KSB7XG4gICAgICAgICAgICBjb250YWluZXIuc2Nyb2xsVG9wID0gc2Nyb2xsICsgb2Zmc2V0IC0gZWxlbWVudEhlaWdodCArIGl0ZW1IZWlnaHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGZhZGVJbihlbGVtZW50LCBkdXJhdGlvbjogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XG5cbiAgICAgICAgbGV0IGxhc3QgPSArbmV3IERhdGUoKTtcbiAgICAgICAgbGV0IG9wYWNpdHkgPSAwO1xuICAgICAgICBsZXQgdGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG9wYWNpdHkgPSArZWxlbWVudC5zdHlsZS5vcGFjaXR5LnJlcGxhY2UoJywnLCAnLicpICsgKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gbGFzdCkgLyBkdXJhdGlvbjtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IG9wYWNpdHk7XG4gICAgICAgICAgICBsYXN0ID0gK25ldyBEYXRlKCk7XG5cbiAgICAgICAgICAgIGlmICgrb3BhY2l0eSA8IDEpIHtcbiAgICAgICAgICAgICAgICAod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAmJiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljaykpIHx8IHNldFRpbWVvdXQodGljaywgMTYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRpY2soKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGZhZGVPdXQoZWxlbWVudCwgbXMpIHtcbiAgICAgICAgdmFyIG9wYWNpdHkgPSAxLFxuICAgICAgICAgICAgaW50ZXJ2YWwgPSA1MCxcbiAgICAgICAgICAgIGR1cmF0aW9uID0gbXMsXG4gICAgICAgICAgICBnYXAgPSBpbnRlcnZhbCAvIGR1cmF0aW9uO1xuXG4gICAgICAgIGxldCBmYWRpbmcgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBvcGFjaXR5ID0gb3BhY2l0eSAtIGdhcDtcblxuICAgICAgICAgICAgaWYgKG9wYWNpdHkgPD0gMCkge1xuICAgICAgICAgICAgICAgIG9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoZmFkaW5nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gb3BhY2l0eTtcbiAgICAgICAgfSwgaW50ZXJ2YWwpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0V2luZG93U2Nyb2xsVG9wKCk6IG51bWJlciB7XG4gICAgICAgIGxldCBkb2MgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHJldHVybiAod2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvYy5zY3JvbGxUb3ApIC0gKGRvYy5jbGllbnRUb3AgfHwgMCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRXaW5kb3dTY3JvbGxMZWZ0KCk6IG51bWJlciB7XG4gICAgICAgIGxldCBkb2MgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHJldHVybiAod2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvYy5zY3JvbGxMZWZ0KSAtIChkb2MuY2xpZW50TGVmdCB8fCAwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIG1hdGNoZXMoZWxlbWVudCwgc2VsZWN0b3I6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICB2YXIgcCA9IEVsZW1lbnQucHJvdG90eXBlO1xuICAgICAgICB2YXIgZiA9XG4gICAgICAgICAgICBwWydtYXRjaGVzJ10gfHxcbiAgICAgICAgICAgIHAud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgICAgICAgICBwWydtb3pNYXRjaGVzU2VsZWN0b3InXSB8fFxuICAgICAgICAgICAgcFsnbXNNYXRjaGVzU2VsZWN0b3InXSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW10uaW5kZXhPZi5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocyksIHRoaXMpICE9PSAtMTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIHJldHVybiBmLmNhbGwoZWxlbWVudCwgc2VsZWN0b3IpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T3V0ZXJXaWR0aChlbCwgbWFyZ2luPykge1xuICAgICAgICBsZXQgd2lkdGggPSBlbC5vZmZzZXRXaWR0aDtcblxuICAgICAgICBpZiAobWFyZ2luKSB7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgICAgICAgIHdpZHRoICs9IHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luTGVmdCkgKyBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpblJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3aWR0aDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldEhvcml6b250YWxQYWRkaW5nKGVsKSB7XG4gICAgICAgIGxldCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nTGVmdCkgKyBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdSaWdodCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRIb3Jpem9udGFsTWFyZ2luKGVsKSB7XG4gICAgICAgIGxldCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5MZWZ0KSArIHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luUmlnaHQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgaW5uZXJXaWR0aChlbCkge1xuICAgICAgICBsZXQgd2lkdGggPSBlbC5vZmZzZXRXaWR0aDtcbiAgICAgICAgbGV0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG5cbiAgICAgICAgd2lkdGggKz0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nTGVmdCkgKyBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdSaWdodCk7XG4gICAgICAgIHJldHVybiB3aWR0aDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHdpZHRoKGVsKSB7XG4gICAgICAgIGxldCB3aWR0aCA9IGVsLm9mZnNldFdpZHRoO1xuICAgICAgICBsZXQgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcblxuICAgICAgICB3aWR0aCAtPSBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdMZWZ0KSArIHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1JpZ2h0KTtcbiAgICAgICAgcmV0dXJuIHdpZHRoO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5uZXJIZWlnaHQoZWwpIHtcbiAgICAgICAgbGV0IGhlaWdodCA9IGVsLm9mZnNldEhlaWdodDtcbiAgICAgICAgbGV0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG5cbiAgICAgICAgaGVpZ2h0ICs9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1RvcCkgKyBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdCb3R0b20pO1xuICAgICAgICByZXR1cm4gaGVpZ2h0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T3V0ZXJIZWlnaHQoZWwsIG1hcmdpbj8pIHtcbiAgICAgICAgbGV0IGhlaWdodCA9IGVsLm9mZnNldEhlaWdodDtcblxuICAgICAgICBpZiAobWFyZ2luKSB7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgICAgICAgIGhlaWdodCArPSBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpblRvcCkgKyBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpbkJvdHRvbSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaGVpZ2h0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SGVpZ2h0KGVsKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGhlaWdodCA9IGVsLm9mZnNldEhlaWdodDtcbiAgICAgICAgbGV0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG5cbiAgICAgICAgaGVpZ2h0IC09IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1RvcCkgKyBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdCb3R0b20pICsgcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJUb3BXaWR0aCkgKyBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlckJvdHRvbVdpZHRoKTtcblxuICAgICAgICByZXR1cm4gaGVpZ2h0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0V2lkdGgoZWwpOiBudW1iZXIge1xuICAgICAgICBsZXQgd2lkdGggPSBlbC5vZmZzZXRXaWR0aDtcbiAgICAgICAgbGV0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG5cbiAgICAgICAgd2lkdGggLT0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nTGVmdCkgKyBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdSaWdodCkgKyBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlckxlZnRXaWR0aCkgKyBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlclJpZ2h0V2lkdGgpO1xuXG4gICAgICAgIHJldHVybiB3aWR0aDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldFZpZXdwb3J0KCk6IGFueSB7XG4gICAgICAgIGxldCB3aW4gPSB3aW5kb3csXG4gICAgICAgICAgICBkID0gZG9jdW1lbnQsXG4gICAgICAgICAgICBlID0gZC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICAgICAgICBnID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLFxuICAgICAgICAgICAgdyA9IHdpbi5pbm5lcldpZHRoIHx8IGUuY2xpZW50V2lkdGggfHwgZy5jbGllbnRXaWR0aCxcbiAgICAgICAgICAgIGggPSB3aW4uaW5uZXJIZWlnaHQgfHwgZS5jbGllbnRIZWlnaHQgfHwgZy5jbGllbnRIZWlnaHQ7XG5cbiAgICAgICAgcmV0dXJuIHsgd2lkdGg6IHcsIGhlaWdodDogaCB9O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T2Zmc2V0KGVsKSB7XG4gICAgICAgIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogcmVjdC50b3AgKyAod2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgfHwgMCksXG4gICAgICAgICAgICBsZWZ0OiByZWN0LmxlZnQgKyAod2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0IHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCB8fCAwKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgcmVwbGFjZUVsZW1lbnRXaXRoKGVsZW1lbnQ6IGFueSwgcmVwbGFjZW1lbnRFbGVtZW50OiBhbnkpOiBhbnkge1xuICAgICAgICBsZXQgcGFyZW50Tm9kZSA9IGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICAgICAgaWYgKCFwYXJlbnROb2RlKSB0aHJvdyBgQ2FuJ3QgcmVwbGFjZSBlbGVtZW50YDtcbiAgICAgICAgcmV0dXJuIHBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHJlcGxhY2VtZW50RWxlbWVudCwgZWxlbWVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRVc2VyQWdlbnQoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKG5hdmlnYXRvciAmJiB0aGlzLmlzQ2xpZW50KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBpc0lFKCkge1xuICAgICAgICB2YXIgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcblxuICAgICAgICB2YXIgbXNpZSA9IHVhLmluZGV4T2YoJ01TSUUgJyk7XG4gICAgICAgIGlmIChtc2llID4gMCkge1xuICAgICAgICAgICAgLy8gSUUgMTAgb3Igb2xkZXIgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0cmlkZW50ID0gdWEuaW5kZXhPZignVHJpZGVudC8nKTtcbiAgICAgICAgaWYgKHRyaWRlbnQgPiAwKSB7XG4gICAgICAgICAgICAvLyBJRSAxMSA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcbiAgICAgICAgICAgIHZhciBydiA9IHVhLmluZGV4T2YoJ3J2OicpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZWRnZSA9IHVhLmluZGV4T2YoJ0VkZ2UvJyk7XG4gICAgICAgIGlmIChlZGdlID4gMCkge1xuICAgICAgICAgICAgLy8gRWRnZSAoSUUgMTIrKSA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gb3RoZXIgYnJvd3NlclxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBpc0lPUygpIHtcbiAgICAgICAgcmV0dXJuIC9pUGFkfGlQaG9uZXxpUG9kLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmICF3aW5kb3dbJ01TU3RyZWFtJ107XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBpc0FuZHJvaWQoKSB7XG4gICAgICAgIHJldHVybiAvKGFuZHJvaWQpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGlzVG91Y2hEZXZpY2UoKSB7XG4gICAgICAgIHJldHVybiAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgfHwgbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzID4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGFwcGVuZENoaWxkKGVsZW1lbnQ6IGFueSwgdGFyZ2V0OiBhbnkpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbGVtZW50KHRhcmdldCkpIHRhcmdldC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgZWxzZSBpZiAodGFyZ2V0ICYmIHRhcmdldC5lbCAmJiB0YXJnZXQuZWwubmF0aXZlRWxlbWVudCkgdGFyZ2V0LmVsLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIGVsc2UgdGhyb3cgJ0Nhbm5vdCBhcHBlbmQgJyArIHRhcmdldCArICcgdG8gJyArIGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyByZW1vdmVDaGlsZChlbGVtZW50OiBhbnksIHRhcmdldDogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLmlzRWxlbWVudCh0YXJnZXQpKSB0YXJnZXQucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIGVsc2UgaWYgKHRhcmdldC5lbCAmJiB0YXJnZXQuZWwubmF0aXZlRWxlbWVudCkgdGFyZ2V0LmVsLm5hdGl2ZUVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIGVsc2UgdGhyb3cgJ0Nhbm5vdCByZW1vdmUgJyArIGVsZW1lbnQgKyAnIGZyb20gJyArIHRhcmdldDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHJlbW92ZUVsZW1lbnQoZWxlbWVudDogRWxlbWVudCkge1xuICAgICAgICBpZiAoISgncmVtb3ZlJyBpbiBFbGVtZW50LnByb3RvdHlwZSkpIGVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICAgICAgZWxzZSBlbGVtZW50LnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgaXNFbGVtZW50KG9iajogYW55KSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgSFRNTEVsZW1lbnQgPT09ICdvYmplY3QnID8gb2JqIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgOiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqICE9PSBudWxsICYmIG9iai5ub2RlVHlwZSA9PT0gMSAmJiB0eXBlb2Ygb2JqLm5vZGVOYW1lID09PSAnc3RyaW5nJztcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGNhbGN1bGF0ZVNjcm9sbGJhcldpZHRoKGVsPzogSFRNTEVsZW1lbnQpOiBudW1iZXIge1xuICAgICAgICBpZiAoZWwpIHtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgICAgICAgcmV0dXJuIGVsLm9mZnNldFdpZHRoIC0gZWwuY2xpZW50V2lkdGggLSBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlckxlZnRXaWR0aCkgLSBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlclJpZ2h0V2lkdGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2FsY3VsYXRlZFNjcm9sbGJhcldpZHRoICE9PSBudWxsKSByZXR1cm4gdGhpcy5jYWxjdWxhdGVkU2Nyb2xsYmFyV2lkdGg7XG5cbiAgICAgICAgICAgIGxldCBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHNjcm9sbERpdi5jbGFzc05hbWUgPSAncC1zY3JvbGxiYXItbWVhc3VyZSc7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcm9sbERpdik7XG5cbiAgICAgICAgICAgIGxldCBzY3JvbGxiYXJXaWR0aCA9IHNjcm9sbERpdi5vZmZzZXRXaWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc2Nyb2xsRGl2KTtcblxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVkU2Nyb2xsYmFyV2lkdGggPSBzY3JvbGxiYXJXaWR0aDtcblxuICAgICAgICAgICAgcmV0dXJuIHNjcm9sbGJhcldpZHRoO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBjYWxjdWxhdGVTY3JvbGxiYXJIZWlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuY2FsY3VsYXRlZFNjcm9sbGJhckhlaWdodCAhPT0gbnVsbCkgcmV0dXJuIHRoaXMuY2FsY3VsYXRlZFNjcm9sbGJhckhlaWdodDtcblxuICAgICAgICBsZXQgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHNjcm9sbERpdi5jbGFzc05hbWUgPSAncC1zY3JvbGxiYXItbWVhc3VyZSc7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2Nyb2xsRGl2KTtcblxuICAgICAgICBsZXQgc2Nyb2xsYmFySGVpZ2h0ID0gc2Nyb2xsRGl2Lm9mZnNldEhlaWdodCAtIHNjcm9sbERpdi5jbGllbnRIZWlnaHQ7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc2Nyb2xsRGl2KTtcblxuICAgICAgICB0aGlzLmNhbGN1bGF0ZWRTY3JvbGxiYXJXaWR0aCA9IHNjcm9sbGJhckhlaWdodDtcblxuICAgICAgICByZXR1cm4gc2Nyb2xsYmFySGVpZ2h0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgaW52b2tlRWxlbWVudE1ldGhvZChlbGVtZW50OiBhbnksIG1ldGhvZE5hbWU6IHN0cmluZywgYXJncz86IGFueVtdKTogdm9pZCB7XG4gICAgICAgIChlbGVtZW50IGFzIGFueSlbbWV0aG9kTmFtZV0uYXBwbHkoZWxlbWVudCwgYXJncyk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBjbGVhclNlbGVjdGlvbigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHdpbmRvdy5nZXRTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuZ2V0U2VsZWN0aW9uKCkuZW1wdHkpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkuZW1wdHkoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcyAmJiB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmFuZ2VDb3VudCA+IDAgJiYgd2luZG93LmdldFNlbGVjdGlvbigpLmdldFJhbmdlQXQoMCkuZ2V0Q2xpZW50UmVjdHMoKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGRvY3VtZW50WydzZWxlY3Rpb24nXSAmJiBkb2N1bWVudFsnc2VsZWN0aW9uJ10uZW1wdHkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnRbJ3NlbGVjdGlvbiddLmVtcHR5KCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIC8vaWdub3JlIElFIGJ1Z1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRCcm93c2VyKCkge1xuICAgICAgICBpZiAoIXRoaXMuYnJvd3Nlcikge1xuICAgICAgICAgICAgbGV0IG1hdGNoZWQgPSB0aGlzLnJlc29sdmVVc2VyQWdlbnQoKTtcbiAgICAgICAgICAgIHRoaXMuYnJvd3NlciA9IHt9O1xuXG4gICAgICAgICAgICBpZiAobWF0Y2hlZC5icm93c2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5icm93c2VyW21hdGNoZWQuYnJvd3Nlcl0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuYnJvd3NlclsndmVyc2lvbiddID0gbWF0Y2hlZC52ZXJzaW9uO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5icm93c2VyWydjaHJvbWUnXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYnJvd3Nlclsnd2Via2l0J10gPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJyb3dzZXJbJ3dlYmtpdCddKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5icm93c2VyWydzYWZhcmknXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5icm93c2VyO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgcmVzb2x2ZVVzZXJBZ2VudCgpIHtcbiAgICAgICAgbGV0IHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBsZXQgbWF0Y2ggPVxuICAgICAgICAgICAgLyhjaHJvbWUpWyBcXC9dKFtcXHcuXSspLy5leGVjKHVhKSB8fCAvKHdlYmtpdClbIFxcL10oW1xcdy5dKykvLmV4ZWModWEpIHx8IC8ob3BlcmEpKD86Lip2ZXJzaW9ufClbIFxcL10oW1xcdy5dKykvLmV4ZWModWEpIHx8IC8obXNpZSkgKFtcXHcuXSspLy5leGVjKHVhKSB8fCAodWEuaW5kZXhPZignY29tcGF0aWJsZScpIDwgMCAmJiAvKG1vemlsbGEpKD86Lio/IHJ2OihbXFx3Ll0rKXwpLy5leGVjKHVhKSkgfHwgW107XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJyb3dzZXI6IG1hdGNoWzFdIHx8ICcnLFxuICAgICAgICAgICAgdmVyc2lvbjogbWF0Y2hbMl0gfHwgJzAnXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBpc0ludGVnZXIodmFsdWUpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHZhbHVlKSAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGlzSGlkZGVuKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhZWxlbWVudCB8fCBlbGVtZW50Lm9mZnNldFBhcmVudCA9PT0gbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGlzVmlzaWJsZShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudCAmJiBlbGVtZW50Lm9mZnNldFBhcmVudCAhPSBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgaXNFeGlzdChlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudCAhPT0gbnVsbCAmJiB0eXBlb2YgZWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgZWxlbWVudC5ub2RlTmFtZSAmJiBlbGVtZW50LnBhcmVudE5vZGU7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBmb2N1cyhlbGVtZW50OiBIVE1MRWxlbWVudCwgb3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IHZvaWQge1xuICAgICAgICBlbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGVsZW1lbnQgJiYgZWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldEZvY3VzYWJsZUVsZW1lbnRzKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGxldCBmb2N1c2FibGVFbGVtZW50cyA9IERvbUhhbmRsZXIuZmluZChcbiAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICBgYnV0dG9uOm5vdChbdGFiaW5kZXggPSBcIi0xXCJdKTpub3QoW2Rpc2FibGVkXSk6bm90KFtzdHlsZSo9XCJkaXNwbGF5Om5vbmVcIl0pOm5vdChbaGlkZGVuXSksXG4gICAgICAgICAgICAgICAgW2hyZWZdOm5vdChbdGFiaW5kZXggPSBcIi0xXCJdKTpub3QoW2Rpc2FibGVkXSk6bm90KFtzdHlsZSo9XCJkaXNwbGF5Om5vbmVcIl0pOm5vdChbaGlkZGVuXSksXG4gICAgICAgICAgICAgICAgaW5wdXQ6bm90KFt0YWJpbmRleCA9IFwiLTFcIl0pOm5vdChbZGlzYWJsZWRdKTpub3QoW3N0eWxlKj1cImRpc3BsYXk6bm9uZVwiXSk6bm90KFtoaWRkZW5dKSwgc2VsZWN0Om5vdChbdGFiaW5kZXggPSBcIi0xXCJdKTpub3QoW2Rpc2FibGVkXSk6bm90KFtzdHlsZSo9XCJkaXNwbGF5Om5vbmVcIl0pOm5vdChbaGlkZGVuXSksXG4gICAgICAgICAgICAgICAgdGV4dGFyZWE6bm90KFt0YWJpbmRleCA9IFwiLTFcIl0pOm5vdChbZGlzYWJsZWRdKTpub3QoW3N0eWxlKj1cImRpc3BsYXk6bm9uZVwiXSk6bm90KFtoaWRkZW5dKSwgW3RhYkluZGV4XTpub3QoW3RhYkluZGV4ID0gXCItMVwiXSk6bm90KFtkaXNhYmxlZF0pOm5vdChbc3R5bGUqPVwiZGlzcGxheTpub25lXCJdKTpub3QoW2hpZGRlbl0pLFxuICAgICAgICAgICAgICAgIFtjb250ZW50ZWRpdGFibGVdOm5vdChbdGFiSW5kZXggPSBcIi0xXCJdKTpub3QoW2Rpc2FibGVkXSk6bm90KFtzdHlsZSo9XCJkaXNwbGF5Om5vbmVcIl0pOm5vdChbaGlkZGVuXSk6bm90KC5wLWRpc2FibGVkKWBcbiAgICAgICAgKTtcblxuICAgICAgICBsZXQgdmlzaWJsZUZvY3VzYWJsZUVsZW1lbnRzID0gW107XG4gICAgICAgIGZvciAobGV0IGZvY3VzYWJsZUVsZW1lbnQgb2YgZm9jdXNhYmxlRWxlbWVudHMpIHtcbiAgICAgICAgICAgIGlmICghIShmb2N1c2FibGVFbGVtZW50Lm9mZnNldFdpZHRoIHx8IGZvY3VzYWJsZUVsZW1lbnQub2Zmc2V0SGVpZ2h0IHx8IGZvY3VzYWJsZUVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKS5sZW5ndGgpKSB2aXNpYmxlRm9jdXNhYmxlRWxlbWVudHMucHVzaChmb2N1c2FibGVFbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmlzaWJsZUZvY3VzYWJsZUVsZW1lbnRzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TmV4dEZvY3VzYWJsZUVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQsIHJldmVyc2UgPSBmYWxzZSkge1xuICAgICAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IERvbUhhbmRsZXIuZ2V0Rm9jdXNhYmxlRWxlbWVudHMoZWxlbWVudCk7XG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIGlmIChmb2N1c2FibGVFbGVtZW50cyAmJiBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBmb2N1c2VkSW5kZXggPSBmb2N1c2FibGVFbGVtZW50cy5pbmRleE9mKGZvY3VzYWJsZUVsZW1lbnRzWzBdLm93bmVyRG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG5cbiAgICAgICAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZvY3VzZWRJbmRleCA9PSAtMSB8fCBmb2N1c2VkSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gZm9jdXNlZEluZGV4IC0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZvY3VzZWRJbmRleCAhPSAtMSAmJiBmb2N1c2VkSW5kZXggIT09IGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGZvY3VzZWRJbmRleCArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9jdXNhYmxlRWxlbWVudHNbaW5kZXhdO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZW5lcmF0ZVpJbmRleCgpIHtcbiAgICAgICAgdGhpcy56aW5kZXggPSB0aGlzLnppbmRleCB8fCA5OTk7XG4gICAgICAgIHJldHVybiArK3RoaXMuemluZGV4O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0U2VsZWN0aW9uKCkge1xuICAgICAgICBpZiAod2luZG93LmdldFNlbGVjdGlvbikgcmV0dXJuIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS50b1N0cmluZygpO1xuICAgICAgICBlbHNlIGlmIChkb2N1bWVudC5nZXRTZWxlY3Rpb24pIHJldHVybiBkb2N1bWVudC5nZXRTZWxlY3Rpb24oKS50b1N0cmluZygpO1xuICAgICAgICBlbHNlIGlmIChkb2N1bWVudFsnc2VsZWN0aW9uJ10pIHJldHVybiBkb2N1bWVudFsnc2VsZWN0aW9uJ10uY3JlYXRlUmFuZ2UoKS50ZXh0O1xuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VGFyZ2V0RWxlbWVudCh0YXJnZXQ6IGFueSwgZWw/OiBIVE1MRWxlbWVudCkge1xuICAgICAgICBpZiAoIXRhcmdldCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgc3dpdGNoICh0YXJnZXQpIHtcbiAgICAgICAgICAgIGNhc2UgJ2RvY3VtZW50JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQ7XG4gICAgICAgICAgICBjYXNlICd3aW5kb3cnOlxuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3c7XG4gICAgICAgICAgICBjYXNlICdAbmV4dCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsPy5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBjYXNlICdAcHJldic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsPy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgY2FzZSAnQHBhcmVudCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsPy5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgY2FzZSAnQGdyYW5kcGFyZW50JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gZWw/LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IHR5cGVvZiB0YXJnZXQ7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnICYmIHRhcmdldC5oYXNPd25Qcm9wZXJ0eSgnbmF0aXZlRWxlbWVudCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmlzRXhpc3QodGFyZ2V0Lm5hdGl2ZUVsZW1lbnQpID8gdGFyZ2V0Lm5hdGl2ZUVsZW1lbnQgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgaXNGdW5jdGlvbiA9IChvYmo6IGFueSkgPT4gISEob2JqICYmIG9iai5jb25zdHJ1Y3RvciAmJiBvYmouY2FsbCAmJiBvYmouYXBwbHkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBpc0Z1bmN0aW9uKHRhcmdldCkgPyB0YXJnZXQoKSA6IHRhcmdldDtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVUeXBlID09PSA5KSB8fCB0aGlzLmlzRXhpc3QoZWxlbWVudCkgPyBlbGVtZW50IDogbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgaXNDbGllbnQoKSB7XG4gICAgICAgIHJldHVybiAhISh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZG9jdW1lbnQgJiYgd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0QXR0cmlidXRlKGVsZW1lbnQsIG5hbWUpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUobmFtZSk7XG5cbiAgICAgICAgICAgIGlmICghaXNOYU4odmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICt2YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSAndHJ1ZScgfHwgdmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgPT09ICd0cnVlJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG59XG4iXX0=