class Timer {
    constructor(time) {
        this._initialValue = time;
    }
    reset() {
        this._time = this._initialValue;
    }
    set time(value) {
        this._time = value;
    }
}
