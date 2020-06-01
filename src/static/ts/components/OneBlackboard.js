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
     * Show one blackboard
     */
    constructor() {
        super();
        this.root = document.querySelector('.container');
        this.blackboardHandler = new BlackboardHandler();
        this._timer = new Timer();
        if (OneBlackboard.INSTANCE)
            return OneBlackboard.INSTANCE;
        OneBlackboard.INSTANCE = this;
        this._timer.addEventListener('finished', () => __awaiter(this, void 0, void 0, function* () {
            yield this.saveChanges();
        }));
    }
    /**
     * Show the blackboard
     */
    show(apiResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            document.title = apiResponse.name;
            yield this._prepareComponent(apiResponse);
            this.root.appendChild(this._element);
        });
    }
    /**
     * Create the Blackboard
     */
    _prepareComponent(apiResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            this.apiResponse = apiResponse;
            // Get the github markdown
            this.apiResponse.markdown = yield this.getGithubMarkdown(this.apiResponse.content);
            const elementString = this._parser.parseDocument(OneBlackboard.HTML, this.apiResponse);
            this._element = this.createElement(elementString);
            this.addListener();
        });
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
    startEditing() {
        return __awaiter(this, void 0, void 0, function* () {
            this._timer.time = yield this.blackboardHandler.acquireBlackboard(this.apiResponse.id);
            // IMPORTANT do not await it
            this._timer.startCountdown();
            document.querySelector('#editing-wrapper').classList.add('editing');
        });
    }
    /**
     * Save the changes made to the blackboard
     */
    saveChanges() {
        return __awaiter(this, void 0, void 0, function* () {
            this._timer.remove();
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
            document.querySelector('.blackboard-preview > div:not(.spinner)').innerHTML = yield this.getGithubMarkdown(content);
            document.querySelector('h1.title').innerHTML = name;
            document.title = name;
            spinnerElement.style.display = 'none';
        });
    }
    /**
     * Get the markdown representation of the string
     * @param value The markdown in html
     * @return {Promise<string>}
     */
    getGithubMarkdown(value) {
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
