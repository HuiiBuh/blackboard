class Timer {
    private _time: number;
    private readonly _initialValue: number;

    constructor(time: number) {
        this._initialValue = time;
    }

    reset(): void {
        this._time = this._initialValue;
    }

    set time(value: number) {
        this._time = value;
    }
}