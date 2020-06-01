var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Home extends Component {
    /**
     * Create a new home component
     */
    constructor() {
        super();
        this.apiClient = new APIClient('/api');
        if (Home.INSTANCE)
            return Home.INSTANCE;
        Home.INSTANCE = this;
        this.modal = new Modal('Create Blackboard', Home.FORM, this.createNewBlackboard.bind(this));
        this.root = document.querySelector('.container');
    }
    /**
     * Show the component
     */
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._prepareComponent();
            this.root.appendChild(this._element);
        });
    }
    /**
     * Create the component
     */
    _prepareComponent() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get data from the api
            let apiResponse = yield this.apiClient.get('/blackboards');
            apiResponse = formatApiData(apiResponse);
            // Parse the api data
            const elementString = this._parser.parseDocument(Home.HTML, apiResponse);
            // Add the created element to the class
            this._element = this.createElement(elementString);
            this.addListener();
        });
    }
    /**
     * Remove the component
     */
    remove() {
        this._element.remove();
        this.modal.remove();
    }
    /**
     * Refresh the home page
     */
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            this.remove();
            yield this.show();
            new Message('Reload finished').show();
        });
    }
    /**
     * Open the modal
     */
    openModal() {
        this.modal.show();
    }
    /**
     * Create a new blackboard
     * @return {Promise<void>}
     */
    createNewBlackboard() {
        return __awaiter(this, void 0, void 0, function* () {
            const value = document.querySelector('#blackboard-name').value;
            if (!value) {
                new Message('No name provided', 'warn').show();
                return;
            }
            yield this.apiClient.post('/blackboards', {}, { name: value });
            this.modal.close();
            new Message(`Created blackboard ${value}`, 'success').show();
            this.remove();
            yield this.show();
        });
    }
    /**
     * Delete the blackboard
     * @param _ {KeyboardEvent}
     * @param blackboardID {number} The id of the blackboard
     * @param blackboardName {string} The blackboard name
     * @return {Promise<void>}
     */
    deleteBlackboard(_, blackboardID, blackboardName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiClient.delete(`/blackboards/${blackboardID}`);
            new Message(`Deleted blackboard ${blackboardName}`, 'success').show();
            this.remove();
            yield this.show();
        });
    }
}
Home.HTML = `
    <h1 class="text-center">Select Blackboard</h1>
    
    <div class="align-right">
        <i class="material-icons pointer" listener="{'type':'click', 'handler': 'refresh'}">refresh</i>
    </div>

    <div class="scroll-table">
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Creation time</th>
                <th>Last Edited</th>
                <th class="text-center">Content</th>
                <th class="text-center">Currently edited</th>
                <th></th>
            </tr>
            </thead>
        
            <tbody>
        
            {% for blackboard in blackboard_list %}
        
                <tr>
                    <td routerLink="/blackboard/{{ blackboard.id }}">{{ blackboard.name }}</td>
                    <td>{{ blackboard.timestamp_create }}</td>
                    <td>{{ blackboard.timestamp_edit }}</td>
                    <td class="text-center"><i class="material-icons ">{{ blackboard.emptyIcon }}</i></td>
                    <td class="text-center"><i class="material-icons ">{{ blackboard.editedIcon }}</i></td>
                    <td class="text-center"><i class="material-icons warn-icon pointer" 
                    listener="{'type':'click', 'handler': 'deleteBlackboard', 'args':'{{ blackboard.id }}, {{ blackboard.name }}'}">delete</i></td>
                </tr>
        
            {% endfor %}
        
            </tbody>
        
        </table>
    </div>
    
    <a class="fab primary-btn" listener="{'type':'click', 'handler': 'openModal'}">
        <i class="material-icons">add</i>
    </a>
    `;
Home.FORM = `
    <div style="min-width: 100%;">
        <input class="custom-input" placeholder="Blackboard name" id="blackboard-name" minlength="4" maxlength="31"> 
    </div>
    `;
/**
 * Format the api response so it can be displayed properly
 * @param apiResponse {object} The api response
 * @return {*}
 */
function formatApiData(apiResponse) {
    apiResponse.blackboard_list.forEach(blackboard => {
        blackboard.editedIcon = blackboard.is_edit ? 'check' : 'close';
        blackboard.emptyIcon = blackboard.is_empty ? 'close' : 'check';
        blackboard.timestamp_create = new Date(blackboard.timestamp_create * 1000).toLocaleString();
        blackboard.timestamp_edit = new Date(blackboard.timestamp_edit * 1000).toLocaleString();
    });
    return apiResponse;
}
