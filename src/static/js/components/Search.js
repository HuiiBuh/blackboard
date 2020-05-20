class Search {

    static html = `
        <table>
        <thead>
        <tr>
            <th>Name</th>
            <th>Last Edited</th>
            <th class="text-center">Content</th>
            <th></th>
        </tr>
        </thead>
    
        <tbody>
    
        {% for blackboard in blackboardList %}
    
            <tr>
                <td routerLink="/blackboard/{{ blackboard.url }}">{{ blackboard.name }}</td>
                <td>{{ blackboard.editingDate }}</td>
                <td class="text-center"><i class="material-icons ">{{ blackboard.empty }}</i></td>
                <td class="text-center"><i class="material-icons warn-icon pointer">delete</i></td>
            </tr>
    
        {% endfor %}
    
        </tbody>
    `;

    timeout = 10;

    /**
     * Create a new search class which handles the search requests
     */
    constructor() {
        this.searchContainer = document.querySelector('.search-container');
        this.searchOverlay = document.querySelector('.search-overlay');
        this.closeButton = this.searchOverlay.querySelector('.top-right');
        this.navigationBar = document.querySelector('.navigation-bar');
        this.input = this.navigationBar.querySelector('input');
        this.searchPreview = document.querySelector('.search-results');

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
    }

    /**
     * Show the search overlay
     */
    showSearchOverlay() {
        this.searchOverlay.classList.add('fade-enlarge-in');
        this.searchOverlay.classList.remove('none');
        this.searchOverlay.classList.remove('fade-enlarge-out');
        this.getSearchResults();
    }

    /**
     * Hide the search overlay
     * @param event {MouseEvent}
     */
    hideSearchOverlay(event) {
        if (this.input.contains(event.target)) return;

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

        this.timeout = setTimeout(() => {
            this.getSearchResults();
        }, 300);
    }

    getSearchResults(search) {
        // TODO API
        const apiResponse = {
            blackboardList: [
                {url: 'first-url', name: 'first-name', editingDate: '12.01.2019', empty: 'check'},
                {url: 'first-url', name: 'first-name', editingDate: '12.01.2019', empty: 'check'},
                {url: 'first-url', name: 'first-name', editingDate: '12.01.2019', empty: 'check'}
            ]
        };
        this.showSearchResults(apiResponse);
    }

    showSearchResults(a) {
        this.parser.insertAt(Search.html, a, '.search-results');
    }
}