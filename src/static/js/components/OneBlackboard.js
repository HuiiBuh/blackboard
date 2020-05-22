class OneBlackboard extends Component {

    static html = `
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
    }

    /**
     * Show the blackboard
     * @return {Promise<void>}
     */
    async show() {
        await this._create();
        this.root.innerText = '';
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
    startEditing() {
        document.querySelector('.blackboard-wrapper').classList.add('editing');
    }

    /**
     * Save the changes made to the blackboard
     * @return {Promise<void>}
     */
    async saveChanges() {
        const value = document.querySelector('textarea').value;
        const preview = document.querySelector('.blackboard-preview > div:not(.spinner)');
        const spinner = document.querySelector('.spinner');

        preview.innerText = '';
        spinner.style.display = 'inline-block';
        document.querySelector('.blackboard-wrapper').classList.remove('editing');

        preview.innerHTML = await this.getGithubMarkdown(value);
        spinner.style.display = 'none';
    }

    /**
     * Get the markdown representation of the string
     * @param value The markdown in html
     * @return {Promise<string>}
     */
    async getGithubMarkdown(value) {
        try {
            return await this.apiClient.post(' https://api.github.com/markdown/raw', {}, value);
        } catch (e) {
            e = JSON.parse(e.message);
            new Message(e.message, 'error').show();
        }
        return '<h1>The preview could not be rendered, because of a GitHub API error</h1>';
    }
}
