class NotFound extends Component {

    private static HTML = `
    <div class="text-center not-found-position">

        <div>
            <div class="number number-1">4</div>
            <div class="number number-2">0</div>
            <div class="number number-3">4</div>
        </div>
        <h1 style="padding-top: 1rem"> The page or blackboard you asked for was not found </h1>

    </div>
    `;

    private static INSTANCE: NotFound;
    private root: HTMLElement;

    /**
     * Create the not found Component
     */
    constructor() {
        super();

        if (NotFound.INSTANCE) return NotFound.INSTANCE;
        NotFound.INSTANCE = this;

        document.title = 'Not found - 404';
        this.root = document.querySelector('.container');
    }


    /**
     * Show the Component
     */
    public show() {
        this.element = this.createElement(NotFound.HTML);
        this.root.appendChild(this.element);
    }

    /**
     * Remove the Component
     */
    public remove() {
        this.element.remove();
    }
}