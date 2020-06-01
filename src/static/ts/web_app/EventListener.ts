/**
 * Event listener which removes itself if the page gets redirected.
 * Should be used so the events get removed and don't stay
 */
class EventListener {
    private _element: HTMLElement | Document;
    private readonly _type: string;
    private readonly _callback: Function;
    private readonly removeListenerFunction: any;

    /**
     * New event listener
     * @param element The element the listener should be attached to
     * @param  type The event type
     * @param {Function} callback The callback function
     */
    constructor(element: HTMLElement | Document, type: string, callback: Function) {
        this._element = element;
        this._type = type;
        this._callback = callback;

        // @ts-ignore
        this._element.addEventListener(this._type, this._callback);

        this.removeListenerFunction = this.removeListener.bind(this);
        document.addEventListener('urlchange', this.removeListenerFunction);
    }

    /**
     * Remove the event listener and the beforeunload listener
     */
    removeListener(): void {
        // @ts-ignore
        this._element.removeEventListener(this._type, this._callback);
        document.removeEventListener('urlchange', this.removeListenerFunction);
    }
}