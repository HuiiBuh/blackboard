class Timer extends EventEmitter {

    private static HTML = `
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
            <span class="material-icons pointer" listener="{'type':'click', 'handler':'customResetFunction'}">restore</span>
        </div>
    `;

    private _time: number;
    private parser = new Parser();
    private readonly initialValue: number;
    private readonly selector: string;

    private element: HTMLElement | any = {remove: () => null};
    private customResetFunction: Function;

    /**
     * Create a new timer which displays the remaining editing time
     * @param time The remaining time
     * @param resetFunction A function which should be called if the reset button is called
     * @param selector The selector for the timers root element
     */
    constructor(time: number = 0, resetFunction = () => null, selector: string = '#timer-wrapper') {
        super();

        this.selector = selector;
        this.initialValue = time;
        this.customResetFunction = resetFunction;
    }

    /**
     * Reset the countdown to the original value
     */
    public resetCountdown(): void {
        this._time = this.initialValue;
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

        const elementString: string = this.parser.parseDocument(Timer.HTML, variables);
        this.element = Timer.createElement(elementString);
        this.addListener();

        document.querySelector(this.selector).appendChild(this.element);

        const countdown = document.getElementById(id);
        while (this._time >= 0) {
            await Timer.sleep(1000);
            countdown.innerText = Timer._secondsToHumanReadable(this._time);
            --this._time;
        }

        this.emit();
    }

    /**
     * Add Listener to the element after it was translated to html
     * Because multiple inheritance is not a thing in js I have to copy paste
     */
    private addListener() {

        // Get all declared listener
        // @ts-ignore
        const listenerList = [...this.element.querySelectorAll('[listener]')];
        for (let listener of listenerList) {

            let attribute = listener.getAttribute('listener').replace(/'/g, '"');
            attribute = JSON.parse(attribute);

            let args = [];
            if (typeof attribute.args !== 'undefined') {
                args = attribute.args.split(',').map(value => value.trim());
            }

            // Add the event listener
            listener.addEventListener(attribute.type, async (event) => {
                await this[attribute.handler].bind(this)(event, ...args);
            });
        }
    }

    /**
     * Create a html element from a string
     * @param string The html string
     */
    private static createElement(string: string): HTMLElement {
        const temp = document.createElement('div');
        temp.innerHTML = string;
        return temp;
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
        seconds = Timer.pad(seconds, 2);
        let minutes = Math.floor((value / 60) % 60).toString();
        let hours = Math.floor((value / (60 * 60)) % 60).toString();

        //Pad leading 0s if the hour is not 0
        if (hours !== '0') {
            hours = Timer.pad(hours, 2);
            hDuration += hours + ':';
        }

        //pad 0s if the hour and minute of a song is 0
        if (hours !== '0' || minutes !== '0') {
            minutes = Timer.pad(minutes, 2);
            hDuration += minutes + ':';
        }

        hDuration += seconds;
        return hDuration;
    }

    /**
     * Sleep for a given amount of time
     * @param ms The ms the function sleeps
     */
    private static sleep(ms: number) {
        return new Promise(resolve => setTimeout(() => resolve(null), ms));
    }

    /**
     * Pad a string with a number of leading characters (default 0)
     * @param value The item that is supposed to be padded
     * @param width The number of pads
     * @param characters What character should pad
     */
    private static pad(value: any, width: number, characters: string = '0'): string {
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

    /**
     * Remove the timer
     */
    public remove(): void {
        this.element.remove();
    }
}