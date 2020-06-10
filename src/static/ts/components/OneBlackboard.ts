class OneBlackboard extends Component {

    static HTML = `
    <div id="editing-wrapper">
        <input class="custom-input text-center title" value="{{ name }}">
        <h1 class="text-center title">{{ name }}</h1>
    
        <div class="blackboard-wrapper">
            <i class="material-icons edit pointer" listener="{'type':'click', 'handler':'_startEditing'}">edit</i>
        
            <div class="blackboard-preview">
                <div class="spinner"></div>
                <div class="markdown-body">{{ markdown }}</div>
            </div>
        
            <div class="textarea">
                <textarea placeholder="Markdown supported"></textarea>
            </div>
        
            <i class="material-icons save pointer" listener="{'type':'click', 'handler':'saveChanges'}">save</i>
        </div>
        <div id="timer-wrapper"></div>
    </div>
    `;

    static INSTANCE: OneBlackboard;

    private root: HTMLElement = document.querySelector('.container');

    private apiResponse: { name: string, content: string, id: string, markdown?: string };
    private blackboardHandler: BlackboardHandler = new BlackboardHandler();
    private apiClient: APIClient = new APIClient('/api');

    private _timer: Timer;
    private readonly _bindSaveChanges: Function;

    /**
     * Create a new blackboard component
     */
    constructor() {
        super();

        if (OneBlackboard.INSTANCE) return OneBlackboard.INSTANCE;
        OneBlackboard.INSTANCE = this;

        this._bindSaveChanges = this.saveChanges.bind(this);
        this._timer = new Timer(0, this._resetCountdown.bind(this));
    }

    /**
     * Show the blackboard
     */
    public async show(apiResponse): Promise<void> {
        this.apiResponse = apiResponse;

        this.blackboardHandler.addSaveShortcut();

        document.title = this.apiResponse.name;
        await this._prepareComponent();
        this.root.appendChild(this._element);
    }

    /**
     * Create the Blackboard
     */
    private async _prepareComponent(): Promise<void> {
        // Get the github markdown
        this.apiResponse.markdown = await OneBlackboard._getGithubMarkdown(this.apiResponse.content);

        const elementString = this._parser.parseDocument(OneBlackboard.HTML, this.apiResponse);
        this._element = this.createElement(elementString);

        this.addListener();
    }

    /**
     * Remove the blackboard from the page
     */
    public remove() {
        this._timer.unsubscribe(this._bindSaveChanges);
        this._timer.remove();
        this._element.remove();
    }

    /**
     * Start the editing
     */
    private async _startEditing() {
        await this._reloadContent();
        this._timer.time = await this.blackboardHandler.acquireBlackboard(this.apiResponse.id);

        // IMPORTANT do not await it
        this._timer.startCountdown();
        this._timer.subscribe(this._bindSaveChanges);

        document.querySelector('#editing-wrapper').classList.add('editing');
    }

    /**
     * Reset the timeout for the blackboard
     */
    private async _resetCountdown(): Promise<void> {
        this._timer.time = await this.blackboardHandler.resetBlackboardTimer();
        new Message('Timeout was reset successfully', 'default', 2000).show();
    }

    /**
     * Reload the content to ensure that the newest data is shown
     */
    private async _reloadContent(): Promise<void> {
        const response = await this.apiClient.get<any>(`/blackboards/${this.apiResponse.id}`);
        this.apiResponse = response;

        document.querySelector<HTMLInputElement>('.custom-input.text-center.title').value = response.name;
        document.querySelector<HTMLTextAreaElement>('textarea').innerHTML = response.content;
    }

    /**
     * Save the changes made to the blackboard
     */
    public async saveChanges(): Promise<void> {
        this._timer.unsubscribe(this._bindSaveChanges);
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
        document.querySelector('.blackboard-preview > div:not(.spinner)').innerHTML = await OneBlackboard._getGithubMarkdown(content);
        document.querySelector('h1.title').innerHTML = name;
        document.title = name;

        spinnerElement.style.display = 'none';
    }

    /**
     * Get the markdown representation of the string
     * @param value The markdown in html
     */
    private static async _getGithubMarkdown(value): Promise<string> {
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
