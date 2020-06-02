"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Component {
    /**
     * Create a new component
     */
    constructor() {
        this._parser = new Parser();
        // Init the element so the remove call does throw an error
        // @ts-ignore
        this._element = {
            remove: () => null
        };
    }
    /**
     * Create a html element from a string
     * @param string The html string
     * @param styleObject A list of styles which should be added to the base element
     */
    createElement(string, styleObject = {}) {
        const temp = document.createElement('div');
        temp.innerHTML = string;
        for (let style in styleObject) {
            temp.style[style] = styleObject[style];
        }
        return temp;
    }
    /**
     * Add Listener to the element after it was translated to html
     */
    addListener() {
        // Get all declared listener
        // @ts-ignore
        const listenerList = [...this._element.querySelectorAll('[listener]')];
        for (let listener of listenerList) {
            let attribute = listener.getAttribute('listener').replace(/'/g, '"');
            attribute = JSON.parse(attribute);
            let args = [];
            if (typeof attribute.args !== 'undefined') {
                args = attribute.args.split(',').map(value => value.trim());
            }
            // Add the event listener
            listener.addEventListener(attribute.type, (event) => __awaiter(this, void 0, void 0, function* () {
                yield this[attribute.handler].bind(this)(event, ...args);
            }));
        }
    }
}
//# sourceMappingURL=Component.js.map