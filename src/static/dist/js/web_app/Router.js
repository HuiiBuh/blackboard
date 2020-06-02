"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Custom implementation of a client side router
 */
class Router {
    /**
     * Create a new router
     * @param preRouteFunction Function which will be called before the route function is executed
     */
    constructor(preRouteFunction) {
        /**
         * The config for the mutation observer
         */
        this._config = {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        };
        this._urlChangeEmitter = new URLChangeEmitter();
        this._routeList = [];
        // Add router links to the element if the DOM changes
        this._observer = new MutationObserver(this._addRouterLinks.bind(this));
        this._preRouteFunction = preRouteFunction;
        this._urlChangeEmitter.subscribe(this._urlChange.bind(this));
    }
    /**
     * Start the observation of the rout change
     */
    startObservation() {
        return __awaiter(this, void 0, void 0, function* () {
            // Look for new router links
            this._observer.observe(document.body, this._config);
            // Add the router links the first time
            this._addRouterLinks();
            // Start emitting url events
            this._urlChangeEmitter.active = true;
            // Call the first url change manually
            this._urlChangeEmitter.currentURL = location.pathname;
            yield this._urlChange(location.pathname);
        });
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
     */
    _addRouterLinks() {
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
     * @param currentURL The current url without any parameters
     */
    _urlChange(currentURL) {
        return __awaiter(this, void 0, void 0, function* () {
            // Execute the pre route function
            this._preRouteFunction();
            let route;
            for (route of this._routeList) {
                const routeRegex = new RegExp(route.path);
                if (routeRegex.test(currentURL)) {
                    // Set the title if defined else title = undefined
                    document.title = route.title;
                    // Show the loading animation during the page loading
                    document.body.classList.add('loading');
                    yield route.view.call(this);
                    document.body.classList.remove('loading');
                    break;
                }
            }
        });
    }
    /**
     * Handle the redirect to another page
     * @param linkElement The element which links the new page
     */
    _handleRedirect(linkElement) {
        return () => {
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
    set routeList(value) {
        this._routeList = value;
    }
    /**
     * Get the currently active routes
     */
    get routeList() {
        return this._routeList;
    }
}
//# sourceMappingURL=Router.js.map