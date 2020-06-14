"use strict";
/**
 * Event listener which removes itself if the page gets redirected.
 * Should be used so the events get removed and don't stay
 */
class EventListener {
    /**
     * New event listener
     * @param element The element the listener should be attached to
     * @param type The event type
     * @param callback The callback function
     */
    constructor(element, type, callback) {
        this.element = element;
        this.type = type;
        this.callback = callback;
        // @ts-ignore
        this.element.addEventListener(this.type, this.callback);
        this.removeListenerFunction = this.remove.bind(this);
        document.addEventListener('urlchange', this.removeListenerFunction);
    }
    /**
     * Remove the event listener and the beforeunload listener
     */
    remove() {
        // @ts-ignore
        this.element.removeEventListener(this.type, this.callback);
        document.removeEventListener('urlchange', this.removeListenerFunction);
    }
}
//# sourceMappingURL=EventListener.js.map