class OneBlackboard extends Component {

    static html = `
    <input class="custom-input text-center title" value="{{ name }}">
    <h1 class="text-center title">{{ name }}</h1>

    <div class="blackboard-wrapper">
        <i class="material-icons edit pointer" listener="{'type':'click', 'handler':'startEditing'}">edit</i>
    
        <div class="blackboard-preview">
            <div class="spinner"></div>
            <div>{{ markdown }}</div>
        </div>
    
        <div class="textarea">
            <textarea placeholder="Markdown supported">{{ content }}</textarea>
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
        this.blackboardHandler = new BlackboardHandler();
    }

    /**
     * Show the blackboard
     * @return {Promise<void>}
     */
    async show() {
        await this._create();
        this.root.appendChild(this.element);
    }

    /**
     * Create the Blackboard
     * @return {Promise<void>}
     * @private
     */
    async _create() {
        this.apiResponse.markdown = await this.getGithubMarkdown(this.apiResponse.content);

        const elementString = this.parser.parseDocument(OneBlackboard.html, this.apiResponse);
        this.element = this._createElement(elementString);

        this._addListener();
    }

    /**
     * Remove the blackboard
     */
    remove() {
        this.element.remove();
    }

    /**
     * Start the editing
     */
    async startEditing() {
        await this.blackboardHandler.acquireBlackboard(this.apiResponse.name);
        document.body.classList.add('editing');
    }

    /**
     * Save the changes made to the blackboard
     * @return {Promise<void>}
     */
    async saveChanges() {
        this.apiResponse.content = document.querySelector('textarea').value;
        this.apiResponse.name = document.querySelector('input.title').value;
        document.title = this.apiResponse.name;

        const spinnerElement = document.querySelector('.spinner');

        await this.blackboardHandler.updateBlackboard(this.apiResponse.content, this.apiResponse.name);

        spinnerElement.style.display = 'inline-block';
        document.body.classList.remove('editing');

        document.querySelector('.blackboard-preview > div:not(.spinner)').innerHTML = await this.getGithubMarkdown(this.apiResponse.content);
        document.querySelector('h1.title').innerHTML = this.apiResponse.name;

        spinnerElement.style.display = 'none';
    }

    /**
     * Get the markdown representation of the string
     * @param value The markdown in html
     * @return {Promise<string>}
     */
    async getGithubMarkdown(value) {
        try {
            return await this.apiClient.request('POST', 'https://api.github.com/markdown/raw', {}, value);
        } catch (e) {
            e = JSON.parse(e.message);
            new Message(e.message, 'error').show();
            console.error(e);
        }
        return '<h1>The preview could not be rendered, because of a GitHub API error</h1>';
    }
}
