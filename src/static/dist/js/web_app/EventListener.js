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
        this._element = element;
        this._type = type;
        this._callback = callback;
        // @ts-ignore
        this._element.addEventListener(this._type, this._callback);
        this.removeListenerFunction = this.remove.bind(this);
        document.addEventListener('urlchange', this.removeListenerFunction);
    }
    /**
     * Remove the event listener and the beforeunload listener
     */
    remove() {
        // @ts-ignore
        this._element.removeEventListener(this._type, this._callback);
        document.removeEventListener('urlchange', this.removeListenerFunction);
    }
}
//# sourceMappingURL=EventListener.js.map