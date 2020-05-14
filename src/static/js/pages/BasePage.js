class BasePage {
    constructor(title) {
        this.apiClient = new APIClient('/static/html/');
        this.root = document.getElementsByClassName('container')[0];
        this.title = title;
        this.titleElement = document.getElementById('page-title');
    }

    async init() {
        this.titleElement.innerText = this.title;
    }

}
