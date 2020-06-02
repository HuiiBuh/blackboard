class Message extends Component {

    static HTML = `
    <div class="message {{ type }} fade-in">
        <i class="material-icons close">close</i>
        <div class="message-body">
            <div class="message-content">
                {{ message }}
            </div>
        </div>
    </div>
    `;

    private readonly message: any;
    private readonly type: 'error' | 'success' | 'warn' | 'default';
    private readonly timeout: number;
    private root: HTMLElement;


    /**
     * Create a new message
     * @param message The message string
     * @param type The message type
     * @param timeout The timeout after which the message will disappear
     */
    constructor(message: string, type: 'error' | 'success' | 'warn' | 'default' = 'default', timeout:number = 4000) {
        super();

        this.message = message;
        this.type = type;
        this.timeout = timeout;

        this.root = document.querySelector('#message-container');
    }


    /**
     * Show the message
     */
    show(): void {
        this._prepareComponent();
        this.root.appendChild(this._element);

        setTimeout(() => {
            this.remove();
        }, this.timeout);
    }

    /**
     * Create the html element
     */
    _prepareComponent(): void {
        const elementString = this._parser.parseDocument(Message.HTML, {'message': this.message, 'type': this.type});
        this._element = this.createElement(elementString);
        this._element.querySelector<HTMLElement>('.material-icons.close').onclick = this.remove.bind(this);
    }

    /**
     * Remove the message (is called if the X is clicked)
     */
    remove(): void {
        this._element.classList.remove('fade-int');
        this._element.classList.add('fade-out');

        setTimeout(() => {
            this._element.remove();
        }, 300);
    }

}