'use strict';

// TODO better error handling

class APIClient {
    /**
     * A new async base client
     * @param baseURL The base url of the server
     * @param header The headers which should be sent with the app
     */
    constructor(baseURL = '', header = 'application/json') {
        this.baseURL = baseURL;
        this.header = header;
    }

    /**
     * Put request (Exceptions get handled)
     * @param url {string} The url (relative to the base url)
     * @param urlParams {object} A json object which will be used to create the url params
     * @param body {object} The body as a json
     * @return {Promise<string|object>}
     */
    async put(url, urlParams = {}, body = {}) {
        return await this.request('PUT', url, urlParams, body);
    }

    /**
     * Get request (Exceptions get handled)
     * @param url {string} The url (relative to the base url)
     * @param urlParams {object} A json object which will be used to create the url params
     * @param body {object} The body as a json
     * @return {Promise<string|object>}
     */
    async get(url, urlParams = {}, body = {}) {
        return await this.request('GET', url, urlParams, body);
    }

    /**
     * Post request (Exceptions get handled)
     * @param url {string} The url (relative to the base url)
     * @param urlParams {object} A json object which will be used to create the url params
     * @param body {object} The body as a json
     * @return {Promise<string|object>}
     */
    async post(url, urlParams = {}, body = {}) {
        return await this.request('POST', url, urlParams, body);
    }

    /**
     * Delete request (Exceptions get handled)
     * @param url {string} The url (relative to the base url)
     * @param urlParams {object} A json object which will be used to create the url params
     * @param body {object} The body as a json
     * @return {Promise<string|object>}
     */
    async delete(url, urlParams = {}, body = {}) {
        return await this.request('DELETE', url, urlParams, body);
    }

    /**
     * Standard request request
     * @param method {'GET'|'POST'|'DELETE'|'PUT'}
     * @param url {string} The url (relative to the base url)
     * @param urlParams {object} A json object which will be used to create the url params
     * @param body {object} The body as a json
     * @return {Promise<string|object>}
     */
    async request(method, url, urlParams = '', body = {}) {
        // Add url params
        url = this.baseURL + url;
        if (urlParams) {
            url += new URLSearchParams(urlParams).toString();
        }

        // Parse the json object to string
        if (typeof body === 'object') {
            body = JSON.stringify(body);
        }
        try {
            return await this.executeRequest(method, url, body);
        } catch (e) {
            this._handleError(e);
        }
    }

    /**
     * Make the available request
     * @param method {string} The method
     * @param url {string} The url
     * @param body {object} The body as a json
     * @return {Promise<string|{}>}
     */
    executeRequest(method, url, body) {
        const self = this;
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();

            request.onreadystatechange = function () {
                if (this.readyState === this.DONE && this.status >= 200 && this.status < 300) {
                    resolve(self._extractResponse(this));
                } else if (this.readyState === this.DONE) {
                    reject({
                            status: this.status,
                            message: self._extractResponse(this),
                        },
                    );
                }
            };

            request.open(method, url, true);
            request.setRequestHeader('Content-Type', this.header);
            request.send(body);
        });
    }

    /**
     * Extract the response based on the4 content type
     * @param request The request object
     * @return {string|object}
     * @private
     */
    _extractResponse(request) {
        const contentType = request.getResponseHeader('Content-Type');

        if (contentType && contentType.toLowerCase() === 'application/json') {
            return JSON.parse(request.responseText);
        }
        return request.responseText;
    }

    /**
     * Handle error
     * @param error {object}
     * @private
     */
    _handleError(error) {

        if (error.status === 422) {
            new Message('There was a type error in your response or you did not submit a required input value', 'warn').show();
        } else if (error.status >= 500 && error.message.detail) {
            new Message(error.message.detail, 'warn').show();
        } else {
            new Message('Internal server error', 'error').show();
        }

        console.error(error);
        throw new Error('See the object above for more details');
    }
}

