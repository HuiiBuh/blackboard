class Modal extends Component {

    private static HTML = `
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

        this.prepareComponent();
    }


    /**
     * Show the modal
     */
    public show() {
        document.body.appendChild(this.element);
        this.element.classList.remove('fade-out');
        this.element.classList.add('fade-in');
    }

    /**
     * Create the html element
     */
    private prepareComponent() {
        const elementString = this.parser.parseDocument(Modal.HTML, {header: this.header, body: this.body});
        this.element = this.createElement(elementString, {position: 'fixed', 'z-index': 500});
        this.addListener();
    }

    /**
     * Remove the modal from the page
     */
    public remove() {
        this.element.classList.add('fade-out');
        setTimeout(() => {
            this.element.remove();
        }, 300);
    }

    /**
     * Close the current modal
     */
    public close() {
        this.element.classList.add('fade-out');
    }

    /**
     * Handle overlay click events
     */
    private overlayClicked(event: KeyboardEvent): void {
        const modal = this.element.querySelector('.modal');
        if (!modal.contains(event.target as Node)) {
            this.close();
        }
    }


    /**
     * Is the event a KeyboardEvent and if yes submit the modal
     * @param event The keyboard event
     */
    private async isEnter(event: KeyboardEvent): Promise<void> {
        if (event.key !== 'Enter') return;
        await this.submit();
    }
}