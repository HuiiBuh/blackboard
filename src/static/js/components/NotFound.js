class NotFound extends Component {

    static html = `
    <div class="text-center not-found-position">

        <div>
            <div class="number number-1">4</div>
            <div class="number number-2">0</div>
            <div class="number number-3">4</div>
        </div>
        <h1 style="padding-top: 1rem"> The page or blackboard you asked for was not found </h1>

    </div>
    `;

    /**
     * Create the not found Component
     */
    constructor() {
        super();

        document.title = 'Not found - 404';
        this.root = document.querySelector('.container');
    }


    /**
     * Show the Component
     */
    show() {
        this.element = this._createElement(NotFound.html);
        this.root.appendChild(this.element);
    }

    /**
     * Remove the Component
     */
    remove() {
        this.element.remove();
    }
}