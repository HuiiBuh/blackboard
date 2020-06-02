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

    static INSTANCE: Search;

    private _searchContainer: HTMLElement = document.querySelector('.search-container');
    private _searchOverlay: HTMLElement = document.querySelector('.search-overlay');
    private _closeButton: HTMLElement = this._searchOverlay.querySelector('.top-right');
    private _navigationBar: HTMLElement = document.querySelector('.navigation-bar');
    private _input: HTMLInputElement = this._navigationBar.querySelector('input');
    private _searchPreview: HTMLElement = document.querySelector('.search-results');

    private _visible: boolean;

    private _timeout: number;

    private _apiClient: APIClient = new APIClient('/api');
    private _parser: Parser = new Parser();

    /**
     * Create a new search class which handles the search requests
     */
    constructor() {
        if (Search.INSTANCE) return Search.INSTANCE;
        Search.INSTANCE = this;

        this._visible = false;
        this._timeout = 10;

        this._addListener();
    }

    /**
     * Add listeners to the elements
     */
    _addListener() {
        this._searchContainer.onclick = this.showSearchOverlay.bind(this);
        this._input.onkeyup = this.search.bind(this);
        this._closeButton.onclick = this.hideSearchOverlay.bind(this);
        this._navigationBar.onclick = this.hideSearchOverlay.bind(this);

        document.addEventListener('urlchange', this.hideSearchOverlay.bind(this));
        document.addEventListener('suppressed_urlchange', this.hideSearchOverlay.bind(this));
    }

    /**
     * Show the search overlay
     */
    async showSearchOverlay() {
        this._visible = true;

        this._searchOverlay.classList.add('fade-enlarge-in');
        this._searchOverlay.classList.remove('none');
        this._searchOverlay.classList.remove('fade-enlarge-out');

        const value = document.querySelector<HTMLInputElement>('.search-container > input').value;
        await this.getSearchResults(value);
    }

    /**
     * Hide the search overlay
     * @param event The mouse event which triggered the hiding
     */
    hideSearchOverlay(event: MouseEvent): void {
        if (this._input.contains(event.target as Node) || !this._visible) return;

        this._visible = false;

        this._searchOverlay.classList.add('fade-enlarge-out');
        this._searchOverlay.classList.remove('fade-enlarge-in');
        setTimeout(() => {
            this._searchOverlay.classList.add('none');
        }, 300);
    }

    /**
     * Search for the search input
     * @param event The keyboard event which triggered the search
     */
    search(event: KeyboardEvent): void {
        // @ts-ignore
        const searchValue = event.target.value;

        if (this._timeout) {
            clearTimeout(this._timeout);
        }

        if (!searchValue) {
            this._searchPreview.innerHTML = '<h2>Nothing found</h2>';
            return;
        }

        this._timeout = setTimeout(async () => {
            await this.getSearchResults(searchValue);
        }, 300);
    }

    /**
     * Get the search results from the api
     * @param search The search term
     */
    async getSearchResults(search: string) {
        if (!search) {
            this._searchPreview.innerHTML = '<h2>Nothing found</h2>';
            return;
        }

        let apiResponse = await this._apiClient.get<any>(`/search?q=${search}`);
        apiResponse = formatApiData(apiResponse);

        // TODO
        if (apiResponse.blackboard_list.length === 0) {
            this._searchPreview.innerHTML = '<h2>Nothing found</h2>';
            return;
        }

        this.showSearchResults(apiResponse);
    }

    /**
     * Show the search results
     * @param apiResponse The api response
     */
    showSearchResults(apiResponse: object): void {
        this._parser.insertAt(Search.HTML, apiResponse, '.search-results');
    }
}