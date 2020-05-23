class Modal extends Component {

    static html = `
    <div class="modal-overlay" listener="{'type':'click', 'handler': 'overlayClicked'}">
    
        <div class="modal">
        
            <div class="modal-header">
                <h1>{{ header }}</h1>
            </div>
            <div class="modal-body" listener="{'type':'keydown', 'handler': 'isEnter'}">{{ body }}</div>
            
            <div class="modal-footer">
                <button class="default-btn" listener="{'type':'click', 'handler': 'close'}">Close</button>
                <button class="primary-btn" listener="{'type':'click', 'handler': 'submit'}">Submit</button>
            </div>
            
        </div>
   
    </div>
    `;

    /**
     * Create a new modal
     * @param {string} header The modal header (HTML supported)
     * @param {string} body The modal body (HTML supported)
     * @param {Function} submitCallback The callback function if the submit button is clicked
     */
    constructor(header, body, submitCallback) {
        super();

        this.header = header;
        this.body = body;
        this.submit = submitCallback;

        this.root = document.body;
        this._create();
    }

    /**
     * Create the html element
     * @private
     */
    _create() {
        const elementString = this.parser.parseDocument(Modal.html, {header: this.header, body: this.body});
        this.element = this._createElement(elementString, {position: 'fixed', 'z-index': 500});
        this._addListener();
    }

    /**
     * Show the modal
     */
    show() {
        this.root.appendChild(this.element);
        this.element.classList.remove('fade-out');
        this.element.classList.add('fade-in');
    }

    /**
     * Remove the modal from the page
     */
    remove() {
        this.element.classList.add('fade-out');
        setTimeout(() => {
            this.element.remove();
        }, 300);
    }

    /**
     * Close the current modal
     */
    close() {
        this.element.classList.add('fade-out');
    }

    /**
     * Handle overlay click events
     * @param event {KeyboardEvent}
     */
    overlayClicked(event) {
        const modal = this.element.querySelector('.modal');
        if (!modal.contains(event.target)) {
            this.close();
        }
    }


    /**
     * Is the event a KeyboardEvent and if yes submit the modal
     * @param event {KeyboardEvent}
     */
    async isEnter(event) {
        if (event.key !== 'Enter') return;
        await this.submit();
    }
}