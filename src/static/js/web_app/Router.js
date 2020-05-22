/**
 * Custom implementation of a client side router
 */
class Router {


    /**
     * Create a new router
     * @param preRouteFunction {Function} Function which will be called before the route function is executed
     */
    constructor(preRouteFunction) {
        this._config = {attributes: true, childList: true, characterData: true, subtree: true};
        this._observer = new MutationObserver(this._addRouterLinks.bind(this));
        this._preRouteFunction = preRouteFunction;

        /**
         * @type  {{path: string, view: Function, title?: string}[]}
         */
        this._routeList = [];

        this._urlChangeEmitter = new URLChangeEmitter();
        this._urlChangeEmitter.addEventListener('urlchange', this.urlChange.bind(this));
    }

    /**
     * Handle the url changes and call the function which is associated with the url
     * @param path {string}
     */
    async urlChange(path) {

        // Execute the pre route function
        this._preRouteFunction();

        /**
         * @type  {{path: string, view: Function, title?: string}}
         */
        let route;
        for (route of this._routeList) {

            const regex = new RegExp(route.path);
            if (regex.test(path)) {
                document.title = route.title;

                document.body.classList.add('loading');
                await route.view.call(this);
                document.body.classList.remove('loading');

                break;
            }
        }
    }


    /**
     * Start the observation of the rout change
     */
    async startObservation() {
        this._observer.observe(document.body, this._config);
        this._addRouterLinks();

        this._urlChangeEmitter.active = true;

        await this.urlChange(location.pathname);
    }

    /**
     * End the observation of the route
     */
    endObservation() {
        this._observer.disconnect();
        this._urlChangeEmitter.active = false;
    }

    /**
     * React to the body changes and add the router links
     * @private
     */
    _addRouterLinks() {
        const linkElements = [...document.querySelectorAll('[routerLink]')];

        for (let link of linkElements) {
            link.addEventListener('click', this._handleRedirect(link).bind(this));
            link.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    this._handleRedirect(event.currentTarget);
                }
            });
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

            if (encodeURI(route) === this._urlChangeEmitter.currentURL)
                return;

            history.pushState({}, '', route);
        };
    }

    /**
     * Set the routes
     * @param value  {{path: string, view: Function, title?: string}[]}
     */
    set routeList(value) {
        this._routeList = value;
    }

    /**
     * Get the currently active routes
     * @returns  {{path: string, view: Function, title?: string}[]}
     */
    get routeList() {
        return this._routeList;
    }
}
