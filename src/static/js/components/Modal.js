class Modal extends Component {

    html = `
    <div class="modal-overlay">
    
        <div class="modal">
        
            <div class="modal-header">
                <h1>{{ header }}</h1>
            </div>
            <div class="modal-body">{{ body }}</div>
            
            <div class="modal-footer">
                <button class="default-btn" listener="{'type':'click', 'handler': 'remove'}">Close</button>
                <button class="primary-btn" listener="{'type':'click', 'handler': 'submit'}">Submit</button>
            </div>
            
        </div>
   
    </div>
    `;

    /**
     *
     * @param {string} header
     * @param {string} body
     */
    constructor(header, body) {
        super();

        this.header = header;
        this.body = body;
        this.root = document.body;
    }

    _create() {
        const elementString = this.parser.parseDocument(this.html, {header: this.header, body: this.body});
        this.element = this._createElement(elementString);
        this._addListener();
    }

    show() {
        this._create();
        this.root.appendChild(this.element);
        this.element.classList.add('fade-in');
    }

    remove() {
        this.element.classList.add('fade-out');
        setTimeout(() => {
            this.element.remove();
        }, 300);
    }

    submit() {
        alert('hey');
    }
}