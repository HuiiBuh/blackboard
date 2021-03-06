class APIClient {
    private readonly _baseURL: string;
    private readonly _header: string;

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
    public async put<T>(url: string, urlParams: URLSearchParams = null, body: object = {}): Promise<T> {
        return await this.request('PUT', url, urlParams, body) as unknown as T;
    }

    /**
     * Get request (Errors get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    public async get<T>(url: string, urlParams: URLSearchParams = null, body: object = {}): Promise<T> {
        return await this.request('GET', url, urlParams, body) as unknown as T;
    }

    /**
     * Post request (Errors get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    public async post<T>(url: string, urlParams: URLSearchParams = null, body: object = {}): Promise<T> {
        return await this.request('POST', url, urlParams, body) as unknown as T;
    }

    /**
     * Delete request (Errors get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    public async delete<T>(url: string, urlParams: URLSearchParams = null, body: object = {}): Promise<T> {
        return await this.request('DELETE', url, urlParams, body) as unknown as T;
    }

    /**
     * Start the request (Errors get handled)
     * @param method The method which should be used for the request
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    public async request(method: 'GET' | 'POST' | 'DELETE' | 'PUT', url: string, urlParams: URLSearchParams = null, body: object = {}): Promise<string | object> {

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
        return await this.executeRequest(method, url, body).catch(error => {
            APIClient.handleError(error);
        });
    }

    /**
     * Make the available request (No error handling)
     * @param method The request method
     * @param url The complete request url
     * @param body The body json as a json string
     */
    public executeRequest(method: string, url: string, body: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();

            request.onreadystatechange = function () {
                if (this.readyState === this.DONE && this.status >= 200 && this.status < 300) {
                    resolve(APIClient.extractResponse(this));
                } else if (this.readyState === this.DONE) {
                    reject({
                            status: this.status,
                            message: APIClient.extractResponse(this),
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
     * Extract the response based on the content type
     * @param request The request object
     */
    private static extractResponse(request): string | object {
        const contentType = request.getResponseHeader('Content-Type');

        if (contentType && contentType.toLowerCase() === 'application/json') {
            return JSON.parse(request.responseText);
        }
        return request.responseText;
    }

    /**
     * Handle possible errors which happened during the request
     */
    private static handleError(error): void {

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
