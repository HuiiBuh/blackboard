var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Timer extends EventEmitter {
    /**
     * Create a new timer which displays the remaining editing time
     * @param time The remaining time
     * @param selector The selector for the timers root element
     */
    constructor(time = 0, selector = '#timer-wrapper') {
        super();
        this._parser = new Parser();
        this._element = { remove: () => null };
        this._selector = selector;
        this._initialValue = time;
    }
    /**
     * Reset the countdown to the original value
     */
    resetCountdown() {
        this._time = this._initialValue;
    }
    /**
     * Start the countdown
     */
    startCountdown() {
        return __awaiter(this, void 0, void 0, function* () {
            const id = `countdown-${Math.floor(Math.random() * 1000000) + 1}`;
            const variables = {
                randomNumber: id,
                initialValue: Timer._secondsToHumanReadable(this._time)
            };
            this._element = this._parser.insertAt(Timer.HTML, variables, this._selector);
            const countdown = document.getElementById(id);
            while (this._time >= 0) {
                yield Timer._sleep(1000);
                countdown.innerText = Timer._secondsToHumanReadable(this._time);
                --this._time;
            }
            this.emit();
        });
    }
    /**
     * Convert seconds to hh:mm:ss
     * @param value The seconds
     */
    static _secondsToHumanReadable(value) {
        //The human readable duration
        let hDuration = '';
        //Get the seconds and fill the missing 0s
        let seconds = (value % 60).toString();
        seconds = Timer._pad(seconds, 2);
        let minutes = Math.floor((value / 60) % 60).toString();
        let hours = Math.floor((value / (60 * 60)) % 60).toString();
        //Pad leading 0s if the hour is not 0
        if (hours !== '0') {
            hours = Timer._pad(hours, 2);
            hDuration += hours + ':';
        }
        //pad 0s if the hour and minute of a song is 0
        if (hours !== '0' || minutes !== '0') {
            minutes = Timer._pad(minutes, 2);
            hDuration += minutes + ':';
        }
        hDuration += seconds;
        return hDuration;
    }
    /**
     * Sleep for a given amount of time
     * @param ms The ms the function sleeps
     */
    static _sleep(ms) {
        return new Promise(resolve => setTimeout(() => resolve(null), ms));
    }
    /**
     * Pad a string with a number of leading characters (default 0)
     * @param value The item that is supposed to be padded
     * @param width The number of pads
     * @param characters What character should pad
     */
    static _pad(value, width, characters = '0') {
        value += '';
        return value.length >= width ? value : new Array(width - value.length + 1).join(characters) + value;
    }
    /**
     * Set the time to a specific value
     * @param value The time (in seconds) the timer should have
     */
    set time(value) {
        this._time = value;
    }
    /**
     * Remove the timer
     */
    remove() {
        this._element.remove();
    }
}
Timer.HTML = `
        <div style="
        position: fixed; 
        bottom: 0; right: 50%; transform: translateX(50%); 
        ">
            <span>Remaining time</span>
            <span id="{{ randomNumber }}">{{ initialValue }}</span>
        </div>
    `;
//# sourceMappingURL=Timer.js.map