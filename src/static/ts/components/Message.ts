class Message extends Component {

    private static HTML = `
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
    public show(): void {
        this.prepareComponent();
        this.root.appendChild(this.element);

        setTimeout(() => {
            this.remove();
        }, this.timeout);
    }

    /**
     * Create the html element
     */
    private prepareComponent(): void {
        const elementString = this.parser.parseDocument(Message.HTML, {'message': this.message, 'type': this.type});
        this.element = this.createElement(elementString);
        this.element.querySelector<HTMLElement>('.material-icons.close').onclick = this.remove.bind(this);
    }

    /**
     * Remove the message (is called if the X is clicked)
     */
    public remove(): void {
        this.element.classList.remove('fade-int');
        this.element.classList.add('fade-out');

        setTimeout(() => {
            this.element.remove();
        }, 300);
    }

}