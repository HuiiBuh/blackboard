class URLChangeEmitter extends EventEmitter {

    public active: boolean = false;
    public currentURL: string = location.pathname;

    private static INSTANCE: URLChangeEmitter;
    private changeTimeout: number = 0;

    /**
     * Create a new URLChangeEmitter which fires a event if the url changes
     */
    constructor() {
        super();

        if (URLChangeEmitter.INSTANCE) return URLChangeEmitter.INSTANCE;
        URLChangeEmitter.INSTANCE = this;

        this.monkeyPatchListener();
    }

    /**
     * Monkey patch the hostory and window to get notified if the url changes
     */
    private monkeyPatchListener(): void {
        const self = this;
        history.pushState = (f => function pushState() {
            const ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            self.handleRedirects();
            return ret;
        })(history.pushState);

        history.replaceState = (f => function replaceState() {
            const ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            self.handleRedirects();
            return ret;
        })(history.replaceState);

        window.addEventListener('popstate', () => {
            self.handleRedirects();
        });
    }


    /**
     * Handle redirects
     */
    private handleRedirects() {


        // Check if event should be emitted
        // Check if the url has changed
        // Check if the timeout has expired
        if (!this.active || this.currentURL === location.pathname || this.changeTimeout) {
            document.dispatchEvent(new Event('suppressed_urlchange'));
            return;
        }
        this.currentURL = location.pathname;

        this.emit(this.currentURL);
        document.dispatchEvent(new Event('urlchange'));

        // Set a timeout for 20ms so a push and pop event does not register twice
        this.changeTimeout = setTimeout(() => this.changeTimeout = 0, 20);
    }
}
