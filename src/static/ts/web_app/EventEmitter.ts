/**
 * Custom event emitter implementation for event driven communication
 */
class EventEmitter {
    private _listeners: Function[] = [];

    /**
     * Add a listener to the emitter
     * @param callback The callback function which will be executed
     */
    subscribe(callback: Function): void {
        this._listeners.push(callback);
    };

    /**
     * Remove the event listener
     * @param callback The callback function which was added
     */
    unsubscribe(callback: Function): void {
        this._listeners.forEach((stack: Function, index: number) => {
            if (stack === callback) {
                this._listeners.splice(index, 1);
            }
        });
    }


    /**
     * Dispatch an event to the right listeners event
     * @param eventInformation Some additional information to the event
     */
    emit(eventInformation: object | string | null = null): void {
        for (let stack of this._listeners) {
            stack.call(this, eventInformation);
        }
    };

}
