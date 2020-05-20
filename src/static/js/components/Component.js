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
     * @return {Element} An valid html element
     * @private
     */
    _createElement(string) {
        const temp = document.createElement('div');
        temp.innerHTML = string;

        const child = temp.children;
        if (child.length === 1) {
            return child[0];
        } else {
            return temp;
        }
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

            // Add the event listener
            listener.addEventListener(attribute.type, this[attribute.handler].bind(this));
        }
    }

    /**
     * Overwrite
     */
    show() {
        throw Error('Not implemented');
    }

    /**
     * Overwrite
     */
    remove() {
        throw Error('Not implemented');
    }
}