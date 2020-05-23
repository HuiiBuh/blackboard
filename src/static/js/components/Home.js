class Home extends Component {
    static html = `
    <h1 class="text-center">Select Blackboard</h1>

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
    
        {% for blackboard in blackboard_list %}
    
            <tr>
                <td routerLink="/blackboard/{{ blackboard.id }}">{{ blackboard.name }}</td>
                <td>{{ blackboard.timestamp_edit }}</td>
                <td class="text-center"><i class="material-icons ">{{ blackboard.state }}</i></td>
                <td class="text-center"><i class="material-icons warn-icon pointer" 
                listener="{'type':'click', 'handler': 'deleteBlackboard', 'args':'{{ blackboard.id }}, {{ blackboard.name }}'}">delete</i></td>
            </tr>
    
        {% endfor %}
    
        </tbody>
    
    </table>
    
    <a class="fab primary-btn" listener="{'type':'click', 'handler': 'openModal'}">
        <i class="material-icons">add</i>
    </a>
    
    <p>
        <button class="error-btn" onclick="const message = new Message('Error', 'error'); message.show() ">Error</button>
        <button class="success-btn" onclick="const message = new Message('Success', 'success'); message.show() ">Success</button>
        <button class="warn-btn" onclick="const message = new Message('Warn', 'warn'); message.show() ">Warn</button>
        <button class="primary-btn" onclick="const message = new Message('Default', 'default'); message.show() ">Default</button>
        <button class="primary-btn" onclick="const modal = new Modal('Default', 'primary'); modal.show() ">Modal</button>
    </p>
    `;

    static form = `
    <div style="min-width: 100%;">
        <input class="custom-input" placeholder="Blackboard name" id="blackboard-name" minlength="4" maxlength="31"> 
    </div>
    `;

    /**
     * @type {Home}
     */
    static instance;

    /**
     * Create a new home component
     */
    constructor() {
        super();

        if (Home.instance) return Home.instance;
        Home.instance = this;

        this.apiClient = new APIClient('/api');

        this.modal = new Modal('Create Blackboard', Home.form, this.createNewBlackboard.bind(this));
        this.root = document.querySelector('.container');
    }

    /**
     * Show the component
     */
    async show() {
        await this._prepareComponent();
        this.root.appendChild(this.element);
    }

    /**
     * Create the component
     * @private
     */
    async _prepareComponent() {
        // Get data from the api
        const apiResponse = await this.apiClient.get('/blackboards');

        // Parse the api data
        const elementString = this.parser.parseDocument(Home.html, apiResponse);

        // Add the created element to the class
        this.element = this._createElement(elementString);
        this._addListener();
    }


    /**
     * Remove the component
     */
    remove() {
        this.element.remove();
        this.modal.remove();
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
    async createNewBlackboard() {
        const value = document.querySelector('#blackboard-name').value;

        if (!value) {
            new Message('No name provided', 'warn').show();
            return;
        }

        await this.apiClient.post('/blackboards', {}, {name: value});
        this.modal.close();

        new Message(`Created blackboard ${value}`, 'success', 5000000).show();

        this.remove();
        await this.show();
    }


    /**
     * Delete a modal
     * @param _ {KeyboardEvent}
     * @param blackboardID {number} The id of the blackboard
     * @param blackboardName {string} The blackboard name
     * @return {Promise<void>}
     */
    async deleteBlackboard(_, blackboardID, blackboardName) {
        await this.apiClient.delete(`/blackboards/${blackboardID}`);

        new Message(`Deleted blackboard ${blackboardName}`, 'success').show();

        this.remove();
        await this.show();
    }
}