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
                <td routerLink="/blackboard/{{ blackboard.name }}">{{ blackboard.name }}</td>
                <td>{{ blackboard.timestamp_edit }}</td>
                <td class="text-center"><i class="material-icons ">{{ blackboard.state }}</i></td>
                <td class="text-center"><i class="material-icons warn-icon pointer" listener="{'type':'click', 'handler': 'deleteBlackboard', 'args':'{{ blackboard.name }}'}">delete</i></td>
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
     * Create a new home component
     * @param apiResponse The api response which describes the home component
     */
    constructor(apiResponse) {
        super();
        this.apiResponse = apiResponse;

        this.apiClient = new APIClient('/api');

        this.modal = new Modal('Create Blackboard', Home.form, this.createNewBlackboard.bind(this));
        this.root = document.querySelector('.container');
    }

    /**
     * Show the component
     */
    async show() {
        await this._create();
        this.root.innerText = '';
        this.root.appendChild(this.element);
    }

    /**
     * Create the component
     * @private
     */
    async _create() {
        // Get data from the api
        await this.getData();

        // Parse the api data
        const elementString = this.parser.parseDocument(Home.html, this.apiResponse);

        // Add the created element to the class
        this.element = this._createElement(elementString);
        this._addListener();
    }

    /**
     * Get the data of all blackboards from the api
     * @return {Promise<void>}
     */
    async getData() {
        try {
            this.apiResponse = await this.apiClient.get('/blackboards');
        } catch (e) {
            new Message(e.message.detail, 'error').show();
        }
    }


    /**
     * Remove the component
     */
    remove() {
        this.element.remove();
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
            new Message('No name provided', 'error', 500000).show();
            return;
        }

        try {
            await this.apiClient.post('/blackboards', {}, {name: value});
        } catch (e) {
            new Message(e.message.detail, 'warn').show();
            return;
        }

        new Message(`Created blackboard ${value}`, 'success').show();
        this.modal.close();
        await this.show();
    }


    /**
     * Delete a modal
     * @param _ {KeyboardEvent}
     * @param blackboardName {string} The blackboard name
     * @return {Promise<void>}
     */
    async deleteBlackboard(_, blackboardName) {
        try {
            await this.apiClient.delete(`/blackboards/${blackboardName}`);
        } catch (e) {
            new Message(e.message.detail, 'warn').show();
            return;
        }

        new Message(`Deleted blackboard ${blackboardName}`, 'success').show();
        await this.show();
    }
}