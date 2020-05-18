class Message extends Component {

    static html = `
    <div class="message {{ type }} fade-in">
        <i class="material-icons close">close</i>
        <div class="message-body">
            <div class="message-content">
                {{ message }}
            </div>
        </div>
    </div>
    `;


    /**
     *
     * @param {string} message
     * @param {string} type
     * @param {number} timeout
     */
    constructor(message, type, timeout = 5000) {
        super();

        this.message = message;
        this.type = type;
        this.timeout = timeout;

        this.root = document.querySelector('#message-container');
    }


    show() {
        this._create();
        this.root.appendChild(this.element);

        setTimeout(() => {
            this.remove();
        }, this.timeout);
    }

    _create() {
        const elementString = this.parser.parseDocument(Message.html, {'message': this.message, 'type': this.type});
        this.element = this._createElement(elementString);
        this.element.querySelector('.material-icons.close').onclick = this.remove.bind(this);
    }

    remove() {
        this.element.classList.remove('fade-int');
        this.element.classList.add('fade-out');

        setTimeout(() => {
            this.element.remove();
        }, 300000);
    }

}