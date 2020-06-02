"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Search {
    /**
     * Create a new search class which handles the search requests
     */
    constructor() {
        this._searchContainer = document.querySelector('.search-container');
        this._searchOverlay = document.querySelector('.search-overlay');
        this._closeButton = this._searchOverlay.querySelector('.top-right');
        this._navigationBar = document.querySelector('.navigation-bar');
        this._input = this._navigationBar.querySelector('input');
        this._searchPreview = document.querySelector('.search-results');
        this._apiClient = new APIClient('/api');
        this._parser = new Parser();
        if (Search.INSTANCE)
            return Search.INSTANCE;
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
    showSearchOverlay() {
        return __awaiter(this, void 0, void 0, function* () {
            this._visible = true;
            this._searchOverlay.classList.add('fade-enlarge-in');
            this._searchOverlay.classList.remove('none');
            this._searchOverlay.classList.remove('fade-enlarge-out');
            const value = document.querySelector('.search-container > input').value;
            yield this.getSearchResults(value);
        });
    }
    /**
     * Hide the search overlay
     * @param event The mouse event which triggered the hiding
     */
    hideSearchOverlay(event) {
        if (this._input.contains(event.target) || !this._visible)
            return;
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
    search(event) {
        // @ts-ignore
        const searchValue = event.target.value;
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
        if (!searchValue) {
            this._searchPreview.innerHTML = '<h2>Nothing found</h2>';
            return;
        }
        this._timeout = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            yield this.getSearchResults(searchValue);
        }), 300);
    }
    /**
     * Get the search results from the api
     * @param search The search term
     */
    getSearchResults(search) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!search) {
                this._searchPreview.innerHTML = '<h2>Nothing found</h2>';
                return;
            }
            let apiResponse = yield this._apiClient.get(`/search?q=${search}`);
            apiResponse = formatApiData(apiResponse);
            // TODO
            if (apiResponse.blackboard_list.length === 0) {
                this._searchPreview.innerHTML = '<h2>Nothing found</h2>';
                return;
            }
            this.showSearchResults(apiResponse);
        });
    }
    /**
     * Show the search results
     * @param apiResponse The api response
     */
    showSearchResults(apiResponse) {
        this._parser.insertAt(Search.HTML, apiResponse, '.search-results');
    }
}
Search.HTML = `
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
//# sourceMappingURL=Search.js.map