class URLChangeEmitter extends EventEmitter {

    /**
     * Create a new URLChangeEmitter which fires a event if the url changes
     */
    constructor() {
        super();
        this.addURLChangeEventListener();

        /**
         * Should the Emitter emit values
         * @type {boolean}
         */
        this.active = false;

        /**
         * The last url (before url change)
         * @type {string}
         */
        this.currentURL = location.pathname;

        /**
         * The timeout for url changes
         * @type {number}
         * @private
         */
        this._changeTimeout = 0;
    }

    /**
     * Start the listening
     */
    addURLChangeEventListener() {
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
     * @private
     */
    _handleRedirects() {

        // Check if event should be emitted
        // Check if the url has changed
        // Check if the timeout has expired
        if (!this.active || this.currentURL === location.pathname || this._changeTimeout) {
            return;
        }
        this.currentURL = location.pathname;

        this.dispatchEvent('urlchange', this.currentURL);

        // Set a timeout for 20ms so a push and pop event does not register twice
        this._changeTimeout = this._changeTimeout = setTimeout(() => this._changeTimeout = 0, 20);
    }
}
