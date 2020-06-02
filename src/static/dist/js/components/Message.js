class Message extends Component {
    /**
     * Create a new message
     * @param message The message string
     * @param type The message type
     * @param timeout The timeout after which the message will disappear
     */
    constructor(message, type = 'default', timeout = 4000) {
        super();
        this.message = message;
        this.type = type;
        this.timeout = timeout;
        this.root = document.querySelector('#message-container');
    }
    /**
     * Show the message
     */
    show() {
        this._prepareComponent();
        this.root.appendChild(this._element);
        setTimeout(() => {
            this.remove();
        }, this.timeout);
    }
    /**
     * Create the html element
     */
    _prepareComponent() {
        const elementString = this._parser.parseDocument(Message.HTML, { 'message': this.message, 'type': this.type });
        this._element = this.createElement(elementString);
        this._element.querySelector('.material-icons.close').onclick = this.remove.bind(this);
    }
    /**
     * Remove the message (is called if the X is clicked)
     */
    remove() {
        this._element.classList.remove('fade-int');
        this._element.classList.add('fade-out');
        setTimeout(() => {
            this._element.remove();
        }, 300);
    }
}
Message.HTML = `
    <div class="message {{ type }} fade-in">
        <i class="material-icons close">close</i>
        <div class="message-body">
            <div class="message-content">
                {{ message }}
            </div>
        </div>
    </div>
    `;
//# sourceMappingURL=Message.js.map