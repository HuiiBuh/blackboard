class EventEmitter {
    constructor() {
        this.listeners = {};
    }

    addEventListener(type, callback) {
        if (!(type in this.listeners)) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(callback);
    };


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
