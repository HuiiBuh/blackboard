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
        try {
            return await this.request('PUT', url, urlParams, body);
        } catch (e) {
            new Message(e.message.detail, 'error').show();
            throw new Error(JSON.stringify(e));
        }
    }

    /**
     * Get request (Exceptions get handled)
     * @param url {string} The url (relative to the base url)
     * @param urlParams {object} A json object which will be used to create the url params
     * @param body {object} The body as a json
     * @return {Promise<string|object>}
     */
    async get(url, urlParams = {}, body = {}) {
        try {
            return await this.request('GET', url, urlParams, body);
        } catch (e) {
            new Message(e.message.detail, 'error').show();
            throw new Error(JSON.stringify(e));
        }
    }

    /**
     * Post request (Exceptions get handled)
     * @param url {string} The url (relative to the base url)
     * @param urlParams {object} A json object which will be used to create the url params
     * @param body {object} The body as a json
     * @return {Promise<string|object>}
     */
    async post(url, urlParams = {}, body = {}) {
        try {
            return await this.request('POST', url, urlParams, body);
        } catch (e) {
            new Message(e.message.detail, 'error').show();
            throw new Error(JSON.stringify(e));
        }
    }

    /**
     * Delete request (Exceptions get handled)
     * @param url {string} The url (relative to the base url)
     * @param urlParams {object} A json object which will be used to create the url params
     * @param body {object} The body as a json
     * @return {Promise<string|object>}
     */
    async delete(url, urlParams = {}, body = {}) {
        try {
            return await this.request('DELETE', url, urlParams, body);
        } catch (e) {
            new Message(e.message.detail, 'error').show();
            throw new Error(JSON.stringify(e));
        }
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
        const self = this;

        // Add url params
        url = this.baseURL + url;
        if (urlParams) {
            url += new URLSearchParams(urlParams).toString();
        }

        // Parse the json object to string
        if (typeof body === 'object') {
            body = JSON.stringify(body);
        }

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

}

