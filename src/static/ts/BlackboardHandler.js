var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class BlackboardHandler {
    /**
     * Create a new Blackboard handler which deals with locking, and updating the blackboards
     * @return {BlackboardHandler}
     */
    constructor() {
        this.apiClient = new APIClient('/api');
        this.token = '';
        this.blackboardID = '';
        if (BlackboardHandler.INSTANCE)
            return BlackboardHandler.INSTANCE;
        BlackboardHandler.INSTANCE = this;
        this._removeLockOnNavigation();
        this._addSaveShortcut();
    }
    /**
     * Acquire a blackboard and if there is a blackboard locked, release it
     * @param blackboardID
     * @return The timeout
     */
    acquireBlackboard(blackboardID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.token)
                yield this.releaseBlackboard();
            this.blackboardID = blackboardID;
            const response = yield this.apiClient.get(`/blackboards/${this.blackboardID}/acquire`);
            this.token = response.token;
            return response.timeout;
        });
    }
    /**
     * Release the current blackboard
     * @param event {BeforeUnloadEvent|null} Optional if some cleanup has to be done
     * @return {Promise<void>}
     */
    releaseBlackboard(event = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event && this.token)
                event.preventDefault();
            if (!this.token)
                return;
            yield this.apiClient.put(`/blackboards/${this.blackboardID}/release`, null, { token: this.token });
            this.token = null;
        });
    }
    /**
     * Updated the blackboard
     * @param content {string} The content of the blackboard
     * @param name {string} The updated name of the blackboard
     * @return {Promise<void>}
     */
    updateBlackboard(content, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                token: this.token,
                name: name,
                content: content
            };
            yield this.apiClient.put(`/blackboards/${this.blackboardID}/update`, null, body);
            yield this.releaseBlackboard();
        });
    }
    /**
     * Remove the lock on the blackboard if you have
     */
    _removeLockOnNavigation() {
        document.addEventListener('urlchange', this.releaseBlackboard.bind(this));
        window.addEventListener('beforeunload', this.releaseBlackboard.bind(this));
    }
    /**
     * Add a shortcut which saves the page if you press Strg + s
     */
    _addSaveShortcut() {
        document.addEventListener('keydown', (event) => __awaiter(this, void 0, void 0, function* () {
            if (event.key.toLowerCase() === 's' && event.ctrlKey) {
                event.preventDefault();
                event.stopPropagation();
                if (this.token)
                    yield new OneBlackboard().saveChanges();
            }
        }));
    }
}
