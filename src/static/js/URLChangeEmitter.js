class URLChangeEmitter extends EventTarget {

    /**
     * Create a new URLChangeEmitter which fires a event if the url changes
     */
    constructor() {
        super();
        this.addURLChangeEventListener();

        this.emitValues = true;
    }

    /**
     * Start the listening
     */
    addURLChangeEventListener() {
        const self = this;
        history.pushState = (f => function pushState() {
            const ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            self.handleRedirects(arguments);
            return ret;
        })(history.pushState);

        history.replaceState = (f => function replaceState() {
            const ret = f.apply(this, arguments);
            self.handleRedirects(arguments);
            return ret;
        })(history.replaceState);

        window.addEventListener('popstate', () => {
            self.handleRedirects(null);
        });
    }


    /**
     * Handle redirects
     * @param args Some args like url and title of the new page
     */
    handleRedirects(args) {
        if (this.emitValues) {
            this.dispatchEvent(new Event('locationchange', args));
        }
    }
}
