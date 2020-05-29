'use strict';

class WebApp {

    /**
     * Create a new web app
     * @param  {{path: string, view: Function, title?: string}[]} routes
     * @param preRouteFunction {Function} Function which will be called before the route function is executed
     */
    constructor(routes, preRouteFunction = () => null) {
        this._router = new Router(preRouteFunction);
        this.routes = routes;
    }

    /**
     * Translate a path to a valid regex
     * @param {string} path The url path with wildcards
     * @returns {string} The regex string
     */
    _pathToRegex(path) {

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
     * @param  {{path: string, view: Function, title?: string}[]} value
     */
    set routes(value) {

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
