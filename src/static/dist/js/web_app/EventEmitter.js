/**
 * Custom event emitter implementation for event driven communication
 */
class EventEmitter {
    constructor() {
        this._listeners = [];
    }
    /**
     * Add a listener to the emitter
     * @param callback The callback function which will be executed
     */
    subscribe(callback) {
        this._listeners.push(callback);
    }
    ;
    /**
     * Remove the event listener
     * @param callback The callback function which was added
     */
    unsubscribe(callback) {
        this._listeners.forEach((stack, index) => {
            if (stack === callback) {
                this._listeners.splice(index, 1);
            }
        });
    }
    /**
     * Dispatch an event to the right listeners event
     * @param eventInformation Some additional information to the event
     */
    emit(eventInformation = null) {
        for (let stack of this._listeners) {
            stack.call(this, eventInformation);
        }
    }
    ;
}
//# sourceMappingURL=EventEmitter.js.map