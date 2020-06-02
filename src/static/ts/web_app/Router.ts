/**
 * Custom implementation of a client side router
 */
class Router {

    private _config: { subtree: boolean; attributes: boolean; childList: boolean; characterData: boolean } = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
    };

    private _observer: MutationObserver;
    private readonly _preRouteFunction: Function;

    private _urlChangeEmitter: URLChangeEmitter = new URLChangeEmitter();
    private _routeList: any[] = [];


    /**
     * Create a new router
     * @param preRouteFunction Function which will be called before the route function is executed
     */
    constructor(preRouteFunction: Function) {
        this._observer = new MutationObserver(this._addRouterLinks.bind(this));

        this._preRouteFunction = preRouteFunction;

        this._urlChangeEmitter.addEventListener('urlchange', this._urlChange.bind(this));
    }


    /**
     * Start the observation of the rout change
     */
    public async startObservation() {

        // Look for new router links
        this._observer.observe(document.body, this._config);

        // Add the router links the first time
        this._addRouterLinks();

        // Start emitting url events
        this._urlChangeEmitter.active = true;

        // Call the first url change manually
        this._urlChangeEmitter.currentURL = location.pathname;
        await this._urlChange(location.pathname);
    }

    /**
     * End the observation of the route
     */
    public endObservation() {
        this._observer.disconnect();
        this._urlChangeEmitter.active = false;
    }

    /**
     * React to the body changes and add the router links
     */
    private _addRouterLinks() {
        // @ts-ignore
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
     * Handle the url changes and call the function which is associated with the url
     * @param currentURL
     */
    async _urlChange(currentURL: string) {

        // Execute the pre route function
        this._preRouteFunction();

        let route: { path: string, view: Function, title?: string };
        for (route of this._routeList) {

            const routeRegex = new RegExp(route.path);
            if (routeRegex.test(currentURL)) {

                // Set the title if defined else title = undefined
                document.title = route.title;

                // Show the loading animation during the page loading
                document.body.classList.add('loading');
                await route.view.call(this);
                document.body.classList.remove('loading');

                break;
            }
        }
    }


    /**
     * Handle the redirect to another page
     * @param linkElement The element which links the new page
     */
    _handleRedirect(linkElement: HTMLElement): () => void {
        return (): void => {

            const route = linkElement.getAttribute('routerLink');

            // Ignore redirects which point to the same route
            if (encodeURI(route) === this._urlChangeEmitter.currentURL)
                return;

            history.pushState({}, '', route);
        };
    }

    /**
     * Set the routes
     */
    set routeList(value: { path: string, view: Function, title?: string }[]) {
        this._routeList = value;
    }

    /**
     * Get the currently active routes
     */
    get routeList(): { path: string, view: Function, title?: string }[] {
        return this._routeList;
    }
}
