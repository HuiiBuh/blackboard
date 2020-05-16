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
