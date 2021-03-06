abstract class Component {
    protected parser: Parser;
    protected element: HTMLElement;

    /**
     * Create a new component
     */
    protected constructor() {
        this.parser = new Parser();

        // Init the element so the remove call does throw an error
        // @ts-ignore
        this.element = {
            remove: () => null
        };
    }

    /**
     * Create a html element from a string
     * @param string The html string
     * @param styleObject A list of styles which should be added to the base element
     */
    protected createElement(string: string, styleObject: any = {}): HTMLElement {
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
    protected addListener() {

        // Get all declared listener
        // @ts-ignore
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
                await this[attribute.handler].bind(this)(event, ...args);
            });
        }
    }
}