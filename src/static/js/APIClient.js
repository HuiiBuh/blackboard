class APIClient {
    constructor(baseURL, header = 'application/json') {
        this.baseURL = baseURL;
        this.header = header;
    }

    async put() {

    }


    async get(url, urlParams = '', body = {}) {
        return await this.request('GET', url, urlParams, body);
    }

    async post(url, urlParams = {}, body = {}) {
        return await this.request('POST', url, urlParams, body);
    }

    async request(method, url, urlParams = '', body = {}) {
        const self = this;

        url = this.baseURL + url;

        if (urlParams) {
            url += new URLSearchParams(urlParams).toString();
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

    _extractResponse(request) {
        const contentType = request.getResponseHeader('Content-Type');

        if (contentType.toLowerCase() === 'application/json') {
            return JSON.parse(request.responseText);
        }
        return request.responseText;
    }

}

