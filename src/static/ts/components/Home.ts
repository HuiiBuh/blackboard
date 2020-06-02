class Home extends Component {
    static HTML = `
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

    static FORM = `
    <div style="min-width: 100%;">
        <input class="custom-input" placeholder="Blackboard name" id="blackboard-name" minlength="4" maxlength="31"> 
    </div>
    `;

    static INSTANCE: Home;
    private apiClient: APIClient = new APIClient('/api');
    private modal: Modal;
    private root: HTMLElement;


    /**
     * Create a new home component
     */
    constructor() {
        super();
        if (Home.INSTANCE) return Home.INSTANCE;
        Home.INSTANCE = this;

        this.modal = new Modal('Create Blackboard', Home.FORM, this.createNewBlackboard.bind(this));
        this.root = document.querySelector('.container');
    }

    /**
     * Show the component
     */
    async show() {
        await this._prepareComponent();
        this.root.appendChild(this._element as Node);
    }

    /**
     * Create the component
     */
    async _prepareComponent() {
        // Get data from the api
        let apiResponse = await this.apiClient.get('/blackboards');
        apiResponse = formatApiData(apiResponse);

        // Parse the api data
        const elementString = this._parser.parseDocument(Home.HTML, apiResponse);

        // Add the created element to the class
        this._element = this.createElement(elementString);
        this.addListener();
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
    async refresh() {
        this.remove();
        await this.show();
        new Message('Reload finished').show();
    }

    /**
     * Open the modal
     */
    openModal() {
        this.modal.show();
    }

    /**
     * Create a new blackboard
     */
    async createNewBlackboard(): Promise<void> {
        const value = document.querySelector<HTMLInputElement>('#blackboard-name').value;

        if (!value) {
            new Message('No name provided', 'warn').show();
            return;
        }

        await this.apiClient.post('/blackboards', null, {name: value});
        this.modal.close();

        new Message(`Created blackboard ${value}`, 'success').show();

        this.remove();
        await this.show();
    }


    /**
     * Delete the blackboard
     * @param _ Ignore the keyboard event
     * @param blackboardID The id of the blackboard
     * @param blackboardName The blackboard name
     */
    async deleteBlackboard(_: KeyboardEvent, blackboardID: string, blackboardName: string): Promise<void> {
        await this.apiClient.delete(`/blackboards/${blackboardID}`);

        new Message(`Deleted blackboard ${blackboardName}`, 'success').show();

        this.remove();
        await this.show();
    }
}
