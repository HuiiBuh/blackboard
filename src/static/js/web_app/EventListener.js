/**
 * Event listener which removes itself if the page gets redirected.
 * Should be used so the events get removed and don't stay
 */
class EventListener {

    /**
     * New event listener
     * @param {Document, HTMLElement} element
     * @param {string} type
     * @param {Function} callback
     */
    constructor(element, type, callback) {
        this.element = element;
        this.type = type;
        this.callback = callback;

        this.element.addEventListener(this.type, this.callback);

        this.removeListenerFunction = this.removeListener.bind(this);
        document.addEventListener('urlchange', this.removeListenerFunction);
    }

    /**
     * Remove the event listener and the beforeunload listener
     */
    removeListener() {
        this.element.removeEventListener(this.type, this.callback);
        document.removeEventListener('urlchange', this.removeListenerFunction);
    }
}