class OneBlackboard extends Component {

    static HTML = `
    <div id="editing-wrapper">
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
        <div id="timer-wrapper"></div>
    </div>
    `;

    /**
     * @type {OneBlackboard}
     */
    static INSTANCE;

    private apiResponse: { name: string, content: string, id: string, markdown?: string };
    private root: HTMLElement = document.querySelector('.container');
    private blackboardHandler: BlackboardHandler = new BlackboardHandler();

    private _timer = new Timer();


    /**
     * Show one blackboard
     */
    constructor() {
        super();

        if (OneBlackboard.INSTANCE) return OneBlackboard.INSTANCE;
        OneBlackboard.INSTANCE = this;

        this._timer.addEventListener('finished', async (): Promise<void> => {
            await this.saveChanges();
        });
    }

    /**
     * Show the blackboard
     */
    public async show(apiResponse): Promise<void> {
        document.title = apiResponse.name;
        await this._prepareComponent(apiResponse);
        this.root.appendChild(this._element);
    }

    /**
     * Create the Blackboard
     */
    async _prepareComponent(apiResponse): Promise<void> {
        this.apiResponse = apiResponse;

        // Get the github markdown
        this.apiResponse.markdown = await this.getGithubMarkdown(this.apiResponse.content);

        const elementString = this._parser.parseDocument(OneBlackboard.HTML, this.apiResponse);
        this._element = this.createElement(elementString);

        this.addListener();
    }

    /**
     * Remove the blackboard
     */
    remove() {
        this._timer.remove();
        this._element.remove();
    }

    /**
     * Start the editing
     */
    async startEditing() {
        this._timer.time = await this.blackboardHandler.acquireBlackboard(this.apiResponse.id);

        // IMPORTANT do not await it
        this._timer.startCountdown();

        document.querySelector('#editing-wrapper').classList.add('editing');
    }

    /**
     * Save the changes made to the blackboard
     */
    async saveChanges(): Promise<void> {
        this._timer.remove();


        // Get the updated values of the blackboard
        const content = document.querySelector('textarea').value;
        const name = document.querySelector<HTMLInputElement>('input.title').value;

        // Updated the blackboard
        await this.blackboardHandler.updateBlackboard(content, name);

        document.querySelector('#editing-wrapper').classList.remove('editing');

        // Shows the spinner while the markdown gets loaded
        const spinnerElement = document.querySelector<HTMLElement>('.spinner');
        spinnerElement.style.display = 'inline-block';

        // Update the preview
        document.querySelector('.blackboard-preview > div:not(.spinner)').innerHTML = await this.getGithubMarkdown(content);
        document.querySelector('h1.title').innerHTML = name;
        document.title = name;

        spinnerElement.style.display = 'none';
    }

    /**
     * Get the markdown representation of the string
     * @param value The markdown in html
     * @return {Promise<string>}
     */
    async getGithubMarkdown(value) {
        const apiClient = new APIClient('', 'text/plain');

        let response: string;
        try {
            response = await apiClient.executeRequest('POST', 'https://api.github.com/markdown/raw', value);
        } catch (error) {
            console.warn(error);

            if (error.status === 403) {
                new Message('Github API limit exceeded.', 'warn').show();
            } else {
                new Message('There was an error rendering the preview.', 'warn').show();
            }

            response = value;
        }

        return response;
    }
}
