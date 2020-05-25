'use strict';

class Search {

    static HTML = `
        <table>
        <thead>
        <tr>
            <th>Name</th>
            <th>Last Edited</th>
            <th class="text-center">Content</th>
            <th class="text-center">Currently edited</th>
        </tr>
        </thead>
    
        <tbody>
    
        {% for blackboard in blackboard_list %}
    
            <tr>
                <td routerLink="/blackboard/{{ blackboard.id }}">{{ blackboard.name }}</td>
                <td>{{ blackboard.timestamp_edit }}</td>
                <td class="text-center"><i class="material-icons ">{{ blackboard.emptyIcon }}</i></td>
                <td class="text-center"><i class="material-icons ">{{ blackboard.editedIcon }}</i></td>
            </tr>
    
        {% endfor %}
    
        </tbody>
    `;

    /**
     * @type {Search}
     */
    static INSTANCE;

    /**
     * Create a new search class which handles the search requests
     */
    constructor() {
        if (Search.INSTANCE) return Search.INSTANCE;
        Search.INSTANCE = this;

        this.searchContainer = document.querySelector('.search-container');
        this.searchOverlay = document.querySelector('.search-overlay');
        this.closeButton = this.searchOverlay.querySelector('.top-right');
        this.navigationBar = document.querySelector('.navigation-bar');
        this.input = this.navigationBar.querySelector('input');
        this.searchPreview = document.querySelector('.search-results');

        this.visible = false;

        this.apiClient = new APIClient('/api');

        this.timeout = 10;

        this.parser = new Parser();

        this.addListener();
    }

    /**
     * Add listeners to the elements
     */
    addListener() {
        this.searchContainer.onclick = this.showSearchOverlay.bind(this);
        this.input.onkeyup = this.search.bind(this);
        this.closeButton.onclick = this.hideSearchOverlay.bind(this);
        this.navigationBar.onclick = this.hideSearchOverlay.bind(this);

        document.addEventListener('urlchange', this.hideSearchOverlay.bind(this));
        document.addEventListener('suppressed_urlchange', this.hideSearchOverlay.bind(this));
    }

    /**
     * Show the search overlay
     */
    async showSearchOverlay() {
        this.visible = true;

        this.searchOverlay.classList.add('fade-enlarge-in');
        this.searchOverlay.classList.remove('none');
        this.searchOverlay.classList.remove('fade-enlarge-out');

        const value = document.querySelector('.search-container > input').value;
        await this.getSearchResults(value);
    }

    /**
     * Hide the search overlay
     * @param event {MouseEvent}
     */
    hideSearchOverlay(event) {
        if (this.input.contains(event.target) || !this.visible) return;

        this.visible = false;

        this.searchOverlay.classList.add('fade-enlarge-out');
        this.searchOverlay.classList.remove('fade-enlarge-in');
        setTimeout(() => {
            this.searchOverlay.classList.add('none');
        }, 300);
    }

    /**
     * Search for the search input
     * @param event {KeyboardEvent}
     */
    search(event) {
        const searchValue = event.target.value;

        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        if (!searchValue) {
            this.searchPreview.innerHTML = '<h2>Nothing found</h2>';
            return;
        }

        this.timeout = setTimeout(async () => {
            await this.getSearchResults(searchValue);
        }, 300);
    }

    /**
     * Get the search results from the api
     * @param search {string} The search term
     */
    async getSearchResults(search) {
        if (!search) {
            this.searchPreview.innerHTML = '<h2>Nothing found</h2>';
            return;
        }

        let apiResponse = await this.apiClient.get(`/search?q=${search}`);
        apiResponse = formatApiData(apiResponse);

        if (apiResponse.blackboard_list.length === 0) {
            this.searchPreview.innerHTML = '<h2>Nothing found</h2>';
            return;
        }

        this.showSearchResults(apiResponse);
    }

    /**
     * Show the search results
     * @param apiResponse {{}} The api response
     */
    showSearchResults(apiResponse) {
        this.parser.insertAt(Search.HTML, apiResponse, '.search-results');
    }
}