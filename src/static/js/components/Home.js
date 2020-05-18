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
                <td class="text-center"><i class="material-icons warn pointer">delete</i></td>
            </tr>
    
        {% endfor %}
    
        </tbody>
        
    
    </table>
    <p>
        <button class="default-btn" onclick="const message = new Message('Test message', 'error'); message.show() ">Show error message</button>
    </p>
    `;

    constructor(apiResponse) {
        super();
        this.apiResponse = apiResponse;

        this.root = document.querySelector('.container');
    }


    show() {
        this._create();
        this.root.innerText = '';
        this.root.appendChild(this.element);
    }

    _create() {
        const elementString = this.parser.parseDocument(Home.html, this.apiResponse);
        this.element = this._createElement(elementString);
    }

    remove() {
        this.element.remove();
    }

}