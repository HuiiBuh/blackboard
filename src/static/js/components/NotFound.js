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

    constructor() {
        super();

        document.title = 'Not found - 404';
        this.root = document.querySelector('.container');
    }


    show() {
        this.element = this._createElement(NotFound.html);
        this.root.innerText = '';
        this.root.appendChild(this.element);
    }

    remove() {
        this.element.remove();
    }
}