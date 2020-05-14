/**
 * Custom implementation of a client side router
 */
class Router {

    /**
     * Create a new router
     * @param observerConfig The config for the change observer
     */
    constructor(observerConfig = {attributes: true, childList: true, characterData: true, subtree: true}) {
        this._observer = new MutationObserver(this._bodyChange.bind(this));

        this._config = observerConfig;
        this._observer.observe(document.body, this._config);
        this._bodyChange();

        this.urlChangeEmitter = new URLChangeEmitter();
    }

    /**
     * Start the observation of the rout change
     */
    startObservation() {
        this._observer.observe(document.body, this._config);
        this.urlChangeEmitter.emitValues = true;
    }

    /**
     * End the observation of the route
     */
    endObservation() {
        this._observer.disconnect();
        this.urlChangeEmitter.emitValues = false;
    }

    /**
     * React to the body changes
     * @private
     */
    _bodyChange() {
        const linkElements = [...document.querySelectorAll("[routerLink]")];

        for (let link of linkElements) {
            link.addEventListener('click', this._handleRedirect(link).bind(this));
        }
    }

    /**
     * Handle the redirect to another page
     * @param linkElement The element which links the new page
     * @returns {function(...[*]=)}
     * @private
     */
    _handleRedirect(linkElement) {
        return () => {
            const route = linkElement.getAttribute('routerLink');
            const title = linkElement.getAttribute('title');

            window.history.pushState({}, title, route);
        };
    }
}
