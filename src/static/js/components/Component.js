class Component {

    /**
     * Create a new component (an abstract class would be better, but JS does not have such a thing)
     */
    constructor() {
        this.parser = new Parser();
        this.element = null;
    }

    /**
     * Create a html element from a string
     * @param string The html string
     * @param styleObject {object} A list of styles which should be added to the base element
     * @return {Element} An valid html element
     * @protected
     */
    _createElement(string, styleObject = {}) {
        const temp = document.createElement('div');
        temp.innerHTML = string;

        for (let style in styleObject) {
            temp.style[style] = styleObject[style];
        }

        return temp;
    }

    /**
     * Add Listener to the element after it was translated to html
     * @protected
     */
    _addListener() {

        // Get all declared listener
        const listenerList = [...this.element.querySelectorAll('[listener]')];
        for (let listener of listenerList) {

            let attribute = listener.getAttribute('listener').replace(/'/g, '"');
            attribute = JSON.parse(attribute);

            let args = [];
            if (typeof attribute.args !== 'undefined') {
                args = attribute.args.split(',').map(value => value.trim());
            }

            // Add the event listener
            listener.addEventListener(attribute.type, async (event) => {
                this[attribute.handler].bind(this)(event, ...args);
            });
        }
    }

    /**
     * Overwrite
     */
    _prepareComponent() {
    }

    /**
     * Overwrite
     */
    show() {
    }

    /**
     * Overwrite
     */
    remove() {
    }
}