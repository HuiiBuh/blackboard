class OneBlackboard extends Component {

    private static HTML = `
    <div id="editing-wrapper">
        <input class="custom-input text-center title" value="{{ name }}">
        <h1 class="text-center title">{{ name }}</h1>
    
        <div class="blackboard-wrapper">
            <i class="material-icons edit pointer" listener="{'type':'click', 'handler':'startEditing'}">edit</i>
            <i class="material-icons close pointer" listener="{'type':'click', 'handler':'discardChanges'}">close</i>
        
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

    private static INSTANCE: OneBlackboard;

    private root: HTMLElement = document.querySelector('.container');

    private apiResponse: { name: string, content: string, id: string, markdown?: string };
    private blackboardHandler: BlackboardHandler = new BlackboardHandler();
    private apiClient: APIClient = new APIClient('/api');

    private timer: Timer;
    private readonly _bindSaveChanges: Function;

    /**
     * Create a new blackboard component
     */
    constructor() {
        super();

        if (OneBlackboard.INSTANCE) return OneBlackboard.INSTANCE;
        OneBlackboard.INSTANCE = this;

        this._bindSaveChanges = this.saveChanges.bind(this);
        this.timer = new Timer(0, this.resetCountdown.bind(this));
    }

    /**
     * Show the blackboard
     */
    public async show(apiResponse): Promise<void> {
        this.apiResponse = apiResponse;

        this.blackboardHandler.addSaveShortcut();

        document.title = this.apiResponse.name;
        await this.prepareComponent();
        this.root.appendChild(this.element);
    }

    /**
     * Create the Blackboard
     */
    private async prepareComponent(): Promise<void> {
        // Get the github markdown
        this.apiResponse.markdown = await OneBlackboard.getGithubMarkdown(this.apiResponse.content);

        const elementString = this.parser.parseDocument(OneBlackboard.HTML, this.apiResponse);
        this.element = this.createElement(elementString);

        this.addListener();
    }

    /**
     * Remove the blackboard from the page
     */
    public remove() {
        this.timer.unsubscribe(this._bindSaveChanges);
        this.timer.remove();
        this.element.remove();
    }

    /**
     * Start the editing
     */
    private async startEditing() {
        await this.reloadContent();
        this.timer.time = await this.blackboardHandler.acquireBlackboard(this.apiResponse.id);

        // IMPORTANT do not await it
        this.timer.startCountdown();
        this.timer.subscribe(this._bindSaveChanges);

        document.querySelector('#editing-wrapper').classList.add('editing');
    }

    /**
     * Reset the timeout for the blackboard
     */
    private async resetCountdown(): Promise<void> {
        this.timer.time = await this.blackboardHandler.resetBlackboardTimer();
    }

    /**
     * Reload the content to ensure that the newest data is shown
     */
    private async reloadContent(): Promise<void> {
        const response = await this.apiClient.get<any>(`/blackboards/${this.apiResponse.id}`);
        this.apiResponse = response;

        document.querySelector<HTMLInputElement>('.custom-input.text-center.title').value = response.name;
        document.querySelector<HTMLTextAreaElement>('textarea').innerHTML = response.content;
    }

    /**
     * Discard the changes made to the blackboard and lock it again
     */
    public async discardChanges(): Promise<void> {
        await this.blackboardHandler.releaseBlackboard();
        new Message('Changes have been discarded', 'default', 2000).show();
        this.timer.unsubscribe(this._bindSaveChanges);
        this.timer.remove();
        document.querySelector('#editing-wrapper').classList.remove('editing');
    }

    /**
     * Save the changes made to the blackboard
     */
    public async saveChanges(): Promise<void> {
        this.timer.unsubscribe(this._bindSaveChanges);
        this.timer.remove();


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
        document.querySelector('.blackboard-preview > div:not(.spinner)').innerHTML = await OneBlackboard.getGithubMarkdown(content);
        document.querySelector('h1.title').innerHTML = name;
        document.title = name;

        spinnerElement.style.display = 'none';
    }

    /**
     * Get the markdown representation of the string
     * @param value The markdown in html
     */
    private static async getGithubMarkdown(value): Promise<string> {
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
