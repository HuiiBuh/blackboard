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
    
        {% for blackboard in blackboardList %}
    
            <tr>
                <td routerLink="/blackboard/{{ blackboard.url }}">{{ blackboard.name }}</td>
                <td>{{ blackboard.editingDate }}</td>
                <td class="text-center"><i class="material-icons ">{{ blackboard.empty }}</i></td>
                <td class="text-center"><i class="material-icons warn-icon pointer">delete</i></td>
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
        <input class="custom-input" placeholder="Blackboard name"> 
    </div>
    `;

    /**
     * Create a new home component
     * @param apiResponse The api response which describes the home component
     */
    constructor(apiResponse) {
        super();
        this.apiResponse = apiResponse;

        this.modal = new Modal('Create Blackboard', Home.form);
        this.root = document.querySelector('.container');
    }


    /**
     * Show the component
     */
    show() {
        this._create();
        this.root.innerText = '';
        this.root.appendChild(this.element);
    }

    /**
     * Create the component
     * @private
     */
    _create() {
        const elementString = this.parser.parseDocument(Home.html, this.apiResponse);
        this.element = this._createElement(elementString);
        this._addListener();
    }

    /**
     * Remove the component
     */
    remove() {
        this.element.remove();
    }

    openModal() {
        this.modal.show();
    }
}