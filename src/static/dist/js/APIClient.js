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
class APIClient {
    /**
     * A new async api client which converts callbacks to promises
     * @param baseURL The base url of the server
     * @param header The headers which should be sent with every request
     */
    constructor(baseURL = '', header = 'application/json') {
        this._baseURL = baseURL;
        this._header = header;
    }
    /**
     * Put request (Errors get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    put(url, urlParams = null, body = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request('PUT', url, urlParams, body);
        });
    }
    /**
     * Get request (Errors get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    get(url, urlParams = null, body = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request('GET', url, urlParams, body);
        });
    }
    /**
     * Post request (Errors get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    post(url, urlParams = null, body = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request('POST', url, urlParams, body);
        });
    }
    /**
     * Delete request (Errors get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    delete(url, urlParams = null, body = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request('DELETE', url, urlParams, body);
        });
    }
    /**
     * Start the request (Errors get handled)
     * @param method The method which should be used for the request
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    request(method, url, urlParams = null, body = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // Add url params
            url = this._baseURL + url;
            if (urlParams) {
                url += '?' + new URLSearchParams(urlParams).toString();
            }
            // Parse the json object to string
            if (typeof body === 'object') {
                // @ts-ignore
                body = JSON.stringify(body);
            }
            // @ts-ignore
            return yield this.executeRequest(method, url, body).catch(error => {
                this._handleError(error);
            });
        });
    }
    /**
     * Make the available request (No error handling)
     * @param method The request method
     * @param url The complete request url
     * @param body The body json as a json string
     */
    executeRequest(method, url, body) {
        const self = this;
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (this.readyState === this.DONE && this.status >= 200 && this.status < 300) {
                    resolve(self._extractResponse(this));
                }
                else if (this.readyState === this.DONE) {
                    reject({
                        status: this.status,
                        message: self._extractResponse(this),
                    });
                }
            };
            request.open(method, url, true);
            request.setRequestHeader('Content-Type', this._header);
            request.send(body);
        });
    }
    /**
     * Extract the response based on the content type
     * @param request The request object
     */
    _extractResponse(request) {
        const contentType = request.getResponseHeader('Content-Type');
        if (contentType && contentType.toLowerCase() === 'application/json') {
            return JSON.parse(request.responseText);
        }
        return request.responseText;
    }
    /**
     * Handle possible errors which happened during the request
     */
    _handleError(error) {
        if (error.status === 422) {
            new Message('There was a type error in your response or you did not submit a required input value', 'warn').show();
        }
        else if (error.message.detail) {
            new Message(error.message.detail, 'error').show();
        }
        else if (error.status >= 500) {
            new Message('Internal server error. View the console for more details.', 'error').show();
        }
        else if (error.status < 500 && error.status >= 400) {
            new Message('There was an error on your side. View the console for more details.', 'error').show();
        }
        console.error(error);
        throw new Error('See the object above for more details');
    }
}
//# sourceMappingURL=APIClient.js.map