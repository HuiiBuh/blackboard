class WebApp {

    /**
     * Create a new web app
     * @param  {{path: string, view: Function, title?: string}[]} routes
     */
    constructor(routes) {

        this._router = new Router();
        this.routes = routes;
    }

    /**
     * Set the routes of the web app
     * @param  {{path: string, view: Function, title?: string}[]} value
     */
    set routes(value) {

        for (let route of value) {
            if (route.path === '**') {
                route.path = '.*';
            }
            route.path = `^${route.path}$`
        }

        this._router.routeList = value;
    }

    /**
     * Get the currently active routes of the web app
     * @returns  {{path: string, view: Function, title?: string}[]}
     */
    get routes() {
        return this._router.routeList;
    }

    /**
     * Start the lifecycle of the app
     */
    async init() {
        await this._router.startObservation();
    }

    /**
     * Pause the observation of paths and other events
     */
    pause() {
        this._router.endObservation();
    }
}


// if (/^\/blackboard\/[^\/]*$/.test(location.pathname)) {
//     this.dispatchEvent('one-blackboard', eventParameter);
// } else if (location.pathname === "/") {
//     this.dispatchEvent('blackboard-overview', eventParameter);
// } else {
//     eventParameter.title = '404';
//     this.dispatchEvent('not-found', eventParameter);
// }