class OneBlackboard extends Component {

    static html = `
    <h1 class="text-center title">{{ name }}</h1>

    <div class="blackboard-wrapper">
        <i class="material-icons edit pointer" listener="{'type':'click', 'handler':'startEditing'}">edit</i>
    
        <div class="blackboard-preview">{{ markdown }}</div>
    
        <div class="textarea">
            <textarea placeholder="Markdown supported">{{ value }}</textarea>
        </div>
    
        <i class="material-icons save pointer" listener="{'type':'click', 'handler':'saveChanges'}">save</i>
    </div>
    `;

    constructor(apiResponse) {
        super();
        this.apiResponse = apiResponse;

        document.title = apiResponse.name;
        this.root = document.querySelector('.container');
        this.apiClient = new APIClient('', 'text/plain');
    }

    async show() {
        await this._create();
        this.root.innerText = '';
        this.root.appendChild(this.element);
    }

    async _create() {
        this.apiResponse.markdown = await this.getGithubMarkdown(this.apiResponse.value);

        const elementString = this.parser.parseDocument(OneBlackboard.html, this.apiResponse);
        this.element = this._createElement(elementString);

        this._addListener();
    }

    remove() {
        this.element.remove();
        super.remove();
    }


    saveListener = null;

    startEditing() {

        document.querySelector('.blackboard-wrapper').classList.add('editing');

        if (this.saveListener) return;

        this.saveListener = new EventListener(document, 'keydown', async (event) => {
            if (event.key === 'Escape') {
                await this.saveChanges();
            }
        });
    }

    async saveChanges() {
        document.querySelector('.blackboard-wrapper').classList.remove('editing');
        const value = document.querySelector('textarea').value;

        document.querySelector('.blackboard-preview').innerHTML = await this.getGithubMarkdown(value);
    }

    async getGithubMarkdown(value) {
        return await this.apiClient.post(' https://api.github.com/markdown/raw', {}, value).catch((err) => {
            new Message(JSON.stringify(err), 'error').show();
            throw Error(JSON.stringify(err));
        });
    }
}
