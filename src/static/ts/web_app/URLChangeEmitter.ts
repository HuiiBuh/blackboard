class URLChangeEmitter extends EventEmitter {

    static INSTANCE: URLChangeEmitter;
    public active: boolean = false;
    private _changeTimeout: number = 0;
    public currentURL: string = location.pathname;

    /**
     * Create a new URLChangeEmitter which fires a event if the url changes
     */
    constructor() {
        super();
        if (URLChangeEmitter.INSTANCE) return URLChangeEmitter.INSTANCE;
        URLChangeEmitter.INSTANCE = this;

        this._monkeyPatchListener();
    }

    /**
     * Start the listening
     */
    private _monkeyPatchListener(): void {
        const self = this;
        history.pushState = (f => function pushState() {
            const ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            self._handleRedirects();
            return ret;
        })(history.pushState);

        history.replaceState = (f => function replaceState() {
            const ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            self._handleRedirects();
            return ret;
        })(history.replaceState);

        window.addEventListener('popstate', () => {
            self._handleRedirects();
        });
    }


    /**
     * Handle redirects
     */
    private _handleRedirects() {


        // Check if event should be emitted
        // Check if the url has changed
        // Check if the timeout has expired
        if (!this.active || this.currentURL === location.pathname || this._changeTimeout) {
            document.dispatchEvent(new Event('suppressed_urlchange'));
            return;
        }
        this.currentURL = location.pathname;

        this.dispatchEvent('urlchange', this.currentURL);
        document.dispatchEvent(new Event('urlchange'));

        // Set a timeout for 20ms so a push and pop event does not register twice
        this._changeTimeout = setTimeout(() => this._changeTimeout = 0, 20);
    }
}
