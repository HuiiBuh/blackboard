class Component {

    constructor() {
        this.parser = new Parser();
        this.element = null;
    }

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
     * Add Listener to the element
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

    show() {
        throw Error('Not implemented');
    }

    remove() {
        throw Error('Not implemented');
    }
}