class OneBlackboard extends Component {

    static html = `
    <h1 class="text-center title">{{ name }}</h1>

    <div class="blackboard-wrapper">
        <i class="material-icons edit pointer" onclick="OneBlackboard.startEditing()">edit</i>
    
        <div class="blackboard-preview">{{ value }}</div>
    
        <textarea placeholder="HTML, CSS and JS supported">{{ value }}</textarea>
    
        <i class="material-icons save pointer" onclick="OneBlackboard.saveChanges()">save</i>
    </div>
    `;

    constructor(apiResponse) {
        super();
        this.apiResponse = apiResponse;

        document.title = apiResponse.name;
        this.root = document.querySelector('.container');
    }

    show() {
        this._create();
        this.root.appendChild(this.element);


    }

    _create() {
        const elementString = this.parser.parseDocument(OneBlackboard.html, this.apiResponse);
        this.element = this._createElement(elementString);
    }

    remove() {
        this.element.remove();
        super.remove();
    }


    static saveListener = null;

    static startEditing() {

        document.querySelector('.blackboard-wrapper').classList.add('editing');

        if (OneBlackboard.saveListener) return;

        OneBlackboard.saveListener = new EventListener(document, 'keydown', (event) => {
            if (event.key === 'Escape') {
                OneBlackboard.saveChanges();
            }
        });
    }

    static saveChanges() {
        document.querySelector('.blackboard-wrapper').classList.remove('editing');
        const value = document.querySelector('textarea').value;
        document.querySelector('.blackboard-preview').innerHTML = value;
    }
}
