"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class OneBlackboard extends Component {
    /**
     * Create a new blackboard component
     */
    constructor() {
        super();
        this.root = document.querySelector('.container');
        this.blackboardHandler = new BlackboardHandler();
        this.apiClient = new APIClient('/api');
        if (OneBlackboard.INSTANCE)
            return OneBlackboard.INSTANCE;
        OneBlackboard.INSTANCE = this;
        this._bindSaveChanges = this.saveChanges.bind(this);
        this.timer = new Timer(0, this.resetCountdown.bind(this));
    }
    /**
     * Show the blackboard
     */
    show(apiResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            this.apiResponse = apiResponse;
            this.blackboardHandler.addSaveShortcut();
            document.title = this.apiResponse.name;
            yield this.prepareComponent();
            this.root.appendChild(this.element);
        });
    }
    /**
     * Create the Blackboard
     */
    prepareComponent() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the github markdown
            this.apiResponse.markdown = yield OneBlackboard.getGithubMarkdown(this.apiResponse.content);
            const elementString = this.parser.parseDocument(OneBlackboard.HTML, this.apiResponse);
            this.element = this.createElement(elementString);
            this.addListener();
        });
    }
    /**
     * Remove the blackboard from the page
     */
    remove() {
        this.timer.unsubscribe(this._bindSaveChanges);
        this.timer.remove();
        this.element.remove();
    }
    /**
     * Start the editing
     */
    startEditing() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.reloadContent();
            this.timer.time = yield this.blackboardHandler.acquireBlackboard(this.apiResponse.id);
            // IMPORTANT do not await it
            this.timer.startCountdown();
            this.timer.subscribe(this._bindSaveChanges);
            document.querySelector('#editing-wrapper').classList.add('editing');
        });
    }
    /**
     * Reset the timeout for the blackboard
     */
    resetCountdown() {
        return __awaiter(this, void 0, void 0, function* () {
            this.timer.time = yield this.blackboardHandler.resetBlackboardTimer();
            new Message('Timeout was reset successfully', 'default', 2000).show();
        });
    }
    /**
     * Reload the content to ensure that the newest data is shown
     */
    reloadContent() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.apiClient.get(`/blackboards/${this.apiResponse.id}`);
            this.apiResponse = response;
            document.querySelector('.custom-input.text-center.title').value = response.name;
            document.querySelector('textarea').innerHTML = response.content;
        });
    }
    /**
     * Discard the changes made to the blackboard and lock it again
     */
    discardChanges() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.blackboardHandler.releaseBlackboard();
            this.timer.unsubscribe(this._bindSaveChanges);
            this.timer.remove();
            document.querySelector('#editing-wrapper').classList.remove('editing');
        });
    }
    /**
     * Save the changes made to the blackboard
     */
    saveChanges() {
        return __awaiter(this, void 0, void 0, function* () {
            this.timer.unsubscribe(this._bindSaveChanges);
            this.timer.remove();
            // Get the updated values of the blackboard
            const content = document.querySelector('textarea').value;
            const name = document.querySelector('input.title').value;
            // Updated the blackboard
            yield this.blackboardHandler.updateBlackboard(content, name);
            document.querySelector('#editing-wrapper').classList.remove('editing');
            // Shows the spinner while the markdown gets loaded
            const spinnerElement = document.querySelector('.spinner');
            spinnerElement.style.display = 'inline-block';
            // Update the preview
            document.querySelector('.blackboard-preview > div:not(.spinner)').innerHTML = yield OneBlackboard.getGithubMarkdown(content);
            document.querySelector('h1.title').innerHTML = name;
            document.title = name;
            spinnerElement.style.display = 'none';
        });
    }
    /**
     * Get the markdown representation of the string
     * @param value The markdown in html
     */
    static getGithubMarkdown(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiClient = new APIClient('', 'text/plain');
            let response;
            try {
                response = yield apiClient.executeRequest('POST', 'https://api.github.com/markdown/raw', value);
            }
            catch (error) {
                console.warn(error);
                if (error.status === 403) {
                    new Message('Github API limit exceeded.', 'warn').show();
                }
                else {
                    new Message('There was an error rendering the preview.', 'warn').show();
                }
                response = value;
            }
            return response;
        });
    }
}
OneBlackboard.HTML = `
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
//# sourceMappingURL=OneBlackboard.js.map