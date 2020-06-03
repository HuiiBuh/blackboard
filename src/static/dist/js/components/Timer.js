"use strict";
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
     * @param resetFunction A function which should be called if the reset button is called
     * @param selector The selector for the timers root element
     */
    constructor(time = 0, resetFunction = () => null, selector = '#timer-wrapper') {
        super();
        this._parser = new Parser();
        this._element = { remove: () => null };
        this._selector = selector;
        this._initialValue = time;
        this._customResetFunction = resetFunction;
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
            const elementString = this._parser.parseDocument(Timer.HTML, variables);
            this._element = this._createElement(elementString);
            this._addListener();
            document.querySelector(this._selector).appendChild(this._element);
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
     * Add Listener to the element after it was translated to html
     * Because multiple inheritance is not a thing in js I have to copy paste
     */
    _addListener() {
        // Get all declared listener
        // @ts-ignore
        const listenerList = [...this._element.querySelectorAll('[listener]')];
        for (let listener of listenerList) {
            let attribute = listener.getAttribute('listener').replace(/'/g, '"');
            attribute = JSON.parse(attribute);
            let args = [];
            if (typeof attribute.args !== 'undefined') {
                args = attribute.args.split(',').map(value => value.trim());
            }
            // Add the event listener
            listener.addEventListener(attribute.type, (event) => __awaiter(this, void 0, void 0, function* () {
                yield this[attribute.handler].bind(this)(event, ...args);
            }));
        }
    }
    /**
     * Create a html element from a string
     * @param string The html string
     * @param styleObject A list of styles which should be added to the base element
     */
    _createElement(string, styleObject = {}) {
        const temp = document.createElement('div');
        temp.innerHTML = string;
        for (let style in styleObject) {
            temp.style[style] = styleObject[style];
        }
        return temp;
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
        <style>
        .timer{
            position: fixed; 
            bottom: 0; right: 50%; 
            transform: translateX(50%); 
            display: flex;
            justify-content:space-between;
        }
        .timer > * { 
            margin:0 .2rem ;
        }
        </style>

        <div class="timer">
            <span>Remaining time</span>
            <span id="{{ randomNumber }}">{{ initialValue }}</span>
            <span class="material-icons pointer" listener="{'type':'click', 'handler':'_customResetFunction'}">restore</span>
        </div>
    `;
//# sourceMappingURL=Timer.js.map