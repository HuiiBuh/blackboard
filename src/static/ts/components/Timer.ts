class Timer extends EventEmitter {

    static HTML = `
        <div style="position: fixed; bottom: 0; right: 50%; transform: translateX(50%); background: white">
            <span>Remaining time</span>
            <span id="{{ randomNumber }}">{{ initialValue }}</span>
        </div>
    `;

    private _time: number;
    private _parser = new Parser();
    private readonly _initialValue: number;
    private readonly _selector: string;
    private _element: HTMLElement | any = {
        remove: () => null
    };

    constructor(time: number = 0, selector: string = '#timer-wrapper') {
        super();

        this._selector = selector;
        this._initialValue = time;
    }

    /**
     * Reset the countdown to the original value
     */
    public resetCountdown(): void {
        this._time = this._initialValue;
    }

    /**
     * Start the countdown
     */
    public async startCountdown() {
        const id = `countdown-${Math.floor(Math.random() * 1000000) + 1}`;

        const variables = {
            randomNumber: id,
            initialValue: Timer._secondsToHumanReadable(this._time)

        };

        this._element = this._parser.insertAt(Timer.HTML, variables, this._selector);
        const countdown = document.getElementById(id);

        while (this._time >= 0) {
            await Timer._sleep(1000);
            countdown.innerText = Timer._secondsToHumanReadable(this._time);
            --this._time;
        }

        this.dispatchEvent('finished');
    }

    /**
     * Convert seconds to hh:mm:ss
     * @param value The seconds
     */
    private static _secondsToHumanReadable(value: number): string {

        //The human readable duration
        let hDuration: string = '';

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
    private static _sleep(ms: number) {
        return new Promise(resolve => setTimeout(() => resolve(null), ms));
    }

    /**
     * Pad a string with a number of leading characters (default 0)
     * @param value The item that is supposed to be padded
     * @param width The number of pads
     * @param characters What character should pad
     */
    private static _pad(value: any, width: number, characters: string = '0'): string {
        value += '';
        return value.length >= width ? value : new Array(width - value.length + 1).join(characters) + value;
    }


    /**
     * Set the time to a specific value
     * @param value The time (in seconds) the timer should have
     */
    public set time(value: number) {
        this._time = value;
    }

    public remove(): void {
        this._time = -1;
        this._element.remove();
    }
}