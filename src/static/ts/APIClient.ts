class APIClient {
    private readonly _baseURL: string;
    private readonly _header: string;

    /**
     * A new async base client
     * @param baseURL The base url of the server
     * @param header The headers which should be sent with the app
     */
    constructor(baseURL = '', header = 'application/json') {
        this._baseURL = baseURL;
        this._header = header;
    }

    /**
     * Put request (Exceptions get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    public async put<T>(url: string, urlParams: URLSearchParams = null, body: object = {}): Promise<T> {
        return await this.request('PUT', url, urlParams, body) as unknown as T;
    }

    /**
     * Get request (Exceptions get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    public async get<T>(url: string, urlParams: URLSearchParams = null, body: object = {}): Promise<T> {
        return await this.request('GET', url, urlParams, body) as unknown as T;
    }

    /**
     * Post request (Exceptions get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    public async post<T>(url: string, urlParams: URLSearchParams = null, body: object = {}): Promise<T> {
        return await this.request('POST', url, urlParams, body) as unknown as T;
    }

    /**
     * Delete request (Exceptions get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    public async delete<T>(url: string, urlParams: URLSearchParams = null, body: object = {}): Promise<T> {
        return await this.request('DELETE', url, urlParams, body) as unknown as T;
    }

    /**
     * Standard request request
     * @param method
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    async request(method: 'GET' | 'POST' | 'DELETE' | 'PUT', url: string, urlParams: URLSearchParams = null, body: object = {}): Promise<string | object> {

        // Add url params
        url = this._baseURL + url;
        if (urlParams) {
            url += new URLSearchParams(urlParams).toString();
        }

        // Parse the json object to string
        if (typeof body === 'object') {
            // @ts-ignore
            body = JSON.stringify(body);
        }

        try {
            // @ts-ignore
            return await this.executeRequest(method, url, body);
        } catch (e) {
            this._handleError(e);
        }
    }

    /**
     * Make the available request
     * @param method The method
     * @param url The url
     * @param body The body json as a string
     */
    executeRequest(method: string, url: string, body: string): Promise<any> {
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
            request.setRequestHeader('Content-Type', this._header);
            request.send(body);
        });
    }

    /**
     * Extract the response based on the4 content type
     * @param request The request object
     */
    _extractResponse(request): string | object {
        const contentType = request.getResponseHeader('Content-Type');

        if (contentType && contentType.toLowerCase() === 'application/json') {
            return JSON.parse(request.responseText);
        }
        return request.responseText;
    }

    /**
     * Handle error
     */
    _handleError(error): void {

        if (error.status === 422) {
            new Message('There was a type error in your response or you did not submit a required input value', 'warn').show();
        } else if (error.message.detail) {
            new Message(error.message.detail, 'error').show();
        } else if (error.status >= 500) {
            new Message('Internal server error. View the console for more details.', 'error').show();
        } else if (error.status < 500 && error.status >= 400) {
            new Message('There was an error on your side. View the console for more details.', 'error').show();
        }

        console.error(error);
        throw new Error('See the object above for more details');
    }
}

