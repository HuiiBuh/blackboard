"use strict";
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
        this.prepareComponent();
        this.root.appendChild(this.element);
        setTimeout(() => {
            this.remove();
        }, this.timeout);
    }
    /**
     * Create the html element
     */
    prepareComponent() {
        const elementString = this.parser.parseDocument(Message.HTML, { 'message': this.message, 'type': this.type });
        this.element = this.createElement(elementString);
        this.element.querySelector('.material-icons.close').onclick = this.remove.bind(this);
    }
    /**
     * Remove the message (is called if the X is clicked)
     */
    remove() {
        this.element.classList.remove('fade-int');
        this.element.classList.add('fade-out');
        setTimeout(() => {
            this.element.remove();
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