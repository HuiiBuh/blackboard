/**
 * Custom implementation of a client side router
 */
class Router {

    /**
     * The config for the mutation observer
     */
    private config: { subtree: boolean; attributes: boolean; childList: boolean; characterData: boolean } = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
    };

    private observer: MutationObserver;
    private readonly _preRouteFunction: Function;

    private urlChangeEmitter: URLChangeEmitter = new URLChangeEmitter();
    private _routeList: any[] = [];


    /**
     * Create a new router
     * @param preRouteFunction Function which will be called before the route function is executed
     */
    constructor(preRouteFunction: Function) {
        // Add router links to the element if the DOM changes
        this.observer = new MutationObserver(this._addRouterLinks.bind(this));

        this._preRouteFunction = preRouteFunction;

        this.urlChangeEmitter.subscribe(this.urlChange.bind(this));
    }


    /**
     * Start the observation of the rout change
     */
    public async startObservation() {

        // Look for new router links
        this.observer.observe(document.body, this.config);

        // Add the router links the first time
        this._addRouterLinks();

        // Start emitting url events
        this.urlChangeEmitter.active = true;

        // Call the first url change manually
        this.urlChangeEmitter.currentURL = location.pathname;
        await this.urlChange(location.pathname);
    }

    /**
     * End the observation of the route
     */
    public endObservation() {
        this.observer.disconnect();
        this.urlChangeEmitter.active = false;
    }

    /**
     * React to the body changes and add the router links
     */
    private _addRouterLinks() {
        // @ts-ignore
        const linkElements = [...document.querySelectorAll('[routerLink]')];

        for (let link of linkElements) {
            link.addEventListener('click', this.handleRedirect(link).bind(this));
            link.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    this.handleRedirect(event.currentTarget);
                }
            });
        }
    }


    /**
     * Handle the url changes and call the function which is associated with the url
     * @param currentURL The current url without any parameters
     */
    private async urlChange(currentURL: string) {

        // Execute the pre route function
        this._preRouteFunction();

        let route: { path: string, view: Function, title?: string };
        for (route of this._routeList) {

            const routeRegex = new RegExp(route.path);
            if (routeRegex.test(currentURL)) {

                // Set the title if defined else title = undefined
                document.title = route.title;

                // Call the attached method
                await route.view.call(this);
                break;
            }
        }
    }


    /**
     * Handle the redirect to another page
     * @param linkElement The element which links the new page
     */
    private handleRedirect(linkElement: HTMLElement): () => void {
        return (): void => {

            const route = linkElement.getAttribute('routerLink');

            // Ignore redirects which point to the same route
            if (encodeURI(route) === this.urlChangeEmitter.currentURL)
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
