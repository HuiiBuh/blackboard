class Search {

    private static HTML = `
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

    private static INSTANCE: Search;

    private searchContainer: HTMLElement = document.querySelector('.search-container');
    private searchOverlay: HTMLElement = document.querySelector('.search-overlay');
    private closeButton: HTMLElement = this.searchOverlay.querySelector('.top-right');
    private navigationBar: HTMLElement = document.querySelector('.navigation-bar');
    private input: HTMLInputElement = this.navigationBar.querySelector('input');
    private searchPreview: HTMLElement = document.querySelector('.search-results');

    private visible: boolean;

    private timeout: number;

    private apiClient: APIClient = new APIClient('/api');
    private parser: Parser = new Parser();

    /**
     * Create a new search class which handles the search requests
     */
    constructor() {
        if (Search.INSTANCE) return Search.INSTANCE;
        Search.INSTANCE = this;

        this.visible = false;
        this.timeout = 10;

        this.addListener();
    }

    /**
     * Add listeners to the elements
     */
    private addListener() {
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
    public async showSearchOverlay(): Promise<void> {
        this.visible = true;

        this.searchOverlay.classList.add('fade-enlarge-in');
        this.searchOverlay.classList.remove('none');
        this.searchOverlay.classList.remove('fade-enlarge-out');

        const value = document.querySelector<HTMLInputElement>('.search-container input').value;
        await this.getSearchResults(value);
    }

    /**
     * Hide the search overlay
     * @param event The mouse event which triggered the hiding
     */
    public hideSearchOverlay(event: MouseEvent): void {
        if (this.input.contains(event.target as Node) || !this.visible) return;

        this.visible = false;

        this.searchOverlay.classList.add('fade-enlarge-out');
        this.searchOverlay.classList.remove('fade-enlarge-in');
        setTimeout(() => {
            this.searchOverlay.classList.add('none');
        }, 300);
    }

    /**
     * Search for the search input
     * @param event The keyboard event which triggered the search
     */
    private search(event: KeyboardEvent): void {
        // @ts-ignore
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
     * @param search The search term
     */
    private async getSearchResults(search: string) {
        if (!search) {
            this.searchPreview.innerHTML = '<h2>Nothing found</h2>';
            return;
        }

        let apiResponse = await this.apiClient.get<any>(`/search?q=${search}`);
        apiResponse = formatApiData(apiResponse);

        // TODO
        if (apiResponse.blackboard_list.length === 0) {
            this.searchPreview.innerHTML = '<h2>Nothing found</h2>';
            return;
        }

        this.showSearchResults(apiResponse);
    }

    /**
     * Show the search results
     * @param apiResponse The api response
     */
    private showSearchResults(apiResponse: object): void {
        this.parser.insertAt(Search.HTML, apiResponse, '.search-results');
    }
}