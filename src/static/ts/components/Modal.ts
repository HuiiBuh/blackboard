class Modal extends Component {

    static HTML = `
    <div class="modal-overlay" listener="{'type':'click', 'handler': '_overlayClicked'}">
    
        <div class="modal">
        
            <div class="modal-header">
                <h1>{{ header }}</h1>
            </div>
            <div class="modal-body" listener="{'type':'keydown', 'handler': '_isEnter'}">{{ body }}</div>
            
            <div class="modal-footer">
                <button class="default-btn" listener="{'type':'click', 'handler': 'close'}">Close</button>
                <button class="primary-btn" listener="{'type':'click', 'handler': 'submit'}">Submit</button>
            </div>
            
        </div>
   
    </div>
    `;
    private readonly header: string;
    private readonly body: string;
    private readonly submit: Function;

    /**
     * Create a new modal
     * @param header The modal header (HTML supported)
     * @param body The modal body (HTML supported)
     * @param submitCallback The callback function if the submit button is clicked
     */
    constructor(header: string, body: string, submitCallback: Function) {
        super();

        this.header = header;
        this.body = body;
        this.submit = submitCallback;

        this._prepareComponent();
    }


    /**
     * Show the modal
     */
    show() {
        document.body.appendChild(this._element);
        this._element.classList.remove('fade-out');
        this._element.classList.add('fade-in');
    }

    /**
     * Create the html element
     */
    _prepareComponent() {
        const elementString = this._parser.parseDocument(Modal.HTML, {header: this.header, body: this.body});
        this._element = this.createElement(elementString, {position: 'fixed', 'z-index': 500});
        this.addListener();
    }

    /**
     * Remove the modal from the page
     */
    remove() {
        this._element.classList.add('fade-out');
        setTimeout(() => {
            this._element.remove();
        }, 300);
    }

    /**
     * Close the current modal
     */
    close() {
        this._element.classList.add('fade-out');
    }

    /**
     * Handle overlay click events
     * @param event {KeyboardEvent}
     */
    _overlayClicked(event) {
        const modal = this._element.querySelector('.modal');
        if (!modal.contains(event.target)) {
            this.close();
        }
    }


    /**
     * Is the event a KeyboardEvent and if yes submit the modal
     * @param event {KeyboardEvent}
     */
    async _isEnter(event) {
        if (event.key !== 'Enter') return;
        await this.submit();
    }
}