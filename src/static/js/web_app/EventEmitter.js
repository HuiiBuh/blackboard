class EventEmitter {
    /**
     * Custom event emitter implementation for event driven communication
     */
    constructor() {
        this.listeners = {};
    }

    /**
     * Add a listener to the emitter
     * @param type The type of the event
     * @param callback The callback function which will be executed
     */
    addEventListener(type, callback) {
        if (!(type in this.listeners)) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(callback);
    };

    /**
     * Remove the event listener
     * @param type The type of the event listener which has been added
     * @param callback The callback function of event listener
     */
    removeEventListener(type, callback) {
        if (!(type in this.listeners)) {
            return;
        }

        const stackList = this.listeners[type].slice();
        stackList.forEach((stack, index) => {
            if (stack === callback) {
                stack.splice(index, 1);
                return;
            }
        });

    }


    /**
     * Dispatch an event to the right listeners event
     * @param eventType The event type
     * @param eventInformation Some additional information to the event
     * @return {boolean}
     */
    dispatchEvent(eventType, eventInformation = undefined) {
        if (!(eventType in this.listeners)) {
            return true;
        }

        const stackList = this.listeners[eventType].slice();
        for (let stack of stackList) {
            stack.call(this, eventInformation);
        }

        return !eventType.defaultPrevented;
    };

}
