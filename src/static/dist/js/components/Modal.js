"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Modal extends Component {
    /**
     * Create a new modal
     * @param header The modal header (HTML supported)
     * @param body The modal body (HTML supported)
     * @param submitCallback The callback function if the submit button is clicked
     */
    constructor(header, body, submitCallback) {
        super();
        this.header = header;
        this.body = body;
        this.submit = submitCallback;
        this.prepareComponent();
    }
    /**
     * Show the modal
     */
    show() {
        document.body.appendChild(this.element);
        this.element.classList.remove('fade-out');
        this.element.classList.add('fade-in');
    }
    /**
     * Create the html element
     */
    prepareComponent() {
        const elementString = this.parser.parseDocument(Modal.HTML, { header: this.header, body: this.body });
        this.element = this.createElement(elementString, { position: 'fixed', 'z-index': 500 });
        this.addListener();
    }
    /**
     * Remove the modal from the page
     */
    remove() {
        this.element.classList.add('fade-out');
        setTimeout(() => {
            this.element.remove();
        }, 300);
    }
    /**
     * Close the current modal
     */
    close() {
        this.element.classList.add('fade-out');
    }
    /**
     * Handle overlay click events
     */
    overlayClicked(event) {
        const modal = this.element.querySelector('.modal');
        if (!modal.contains(event.target)) {
            this.close();
        }
    }
    /**
     * Is the event a KeyboardEvent and if yes submit the modal
     * @param event The keyboard event
     */
    isEnter(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.key !== 'Enter')
                return;
            yield this.submit();
        });
    }
}
Modal.HTML = `
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
//# sourceMappingURL=Modal.js.map