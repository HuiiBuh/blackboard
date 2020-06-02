class WebApp {
    private _router: Router;

    /**
     * Create a new web app which handles the webapp
     * @param routes A list of routes and the functions which should be executed if the route is called
     * @param preRouteFunction Function which will be called before the route function is executed
     */
    constructor(routes: { path: string, view: Function, title?: string }[], preRouteFunction: Function = () => null) {
        this._router = new Router(preRouteFunction);
        this.routes = routes;
    }

    /**
     * Translate a path to a valid regex
     * @param path The url path with wildcards
     * @returns The regex string
     */
    _pathToRegex(path: string): string {

        // Add the optional trailing slash to the url
        if (path[path.length - 1] !== '/') {
            path += '/?';
        } else if (path[path.length - 1] === '/') {
            path += '?';
        }

        // Check for wildcards
        const variableRegex = new RegExp('{[a-zA-Z_]+}', 'g');

        // Replace the wildcard with regex
        const match = variableRegex.exec(path);
        if (match) {
            path = path.slice(0, match.index) + '[a-zA-z0-9]+' + path.slice(match.index + match[0].length);
        }

        path = path.replace('/', '\/');
        path = `^${path}$`;
        return path;
    }

    /**
     * Set the routes of the web app
     * @param value a list of routes
     */
    set routes(value: { path: string, view: Function, title?: string }[]) {

        for (let route of value) {
            if (route.path === '**') {
                route.path = '.*';
            }

            route.path = this._pathToRegex(route.path);
        }

        this._router.routeList = value;
    }

    /**
     * Get the currently active routes of the web app
     */
    get routes(): { path: string, view: Function, title?: string }[] {
        return this._router.routeList;
    }

    /**
     * Start the lifecycle of the app
     */
    async init(): Promise<void> {
        await this._router.startObservation();
    }

    /**
     * Pause the observation of paths and other events
     */
    pause(): void {
        this._router.endObservation();
    }
}
