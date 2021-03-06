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
class BlackboardHandler {
    /**
     * Create a new Blackboard handler which deals with locking, unlocking, and updating the blackboards
     */
    constructor() {
        this.apiClient = new APIClient('/api');
        this.token = '';
        this.blackboardID = '';
        if (BlackboardHandler.INSTANCE)
            return BlackboardHandler.INSTANCE;
        BlackboardHandler.INSTANCE = this;
        this.addSaveShortcut();
        this.removeLockOnNavigation();
    }
    /**
     * Acquire a blackboard and if there is a blackboard locked, release it
     * @param blackboardID The  id of the blackboard you want to acquire
     * @return A timeout for limiting the editing time
     */
    acquireBlackboard(blackboardID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.token)
                yield this.releaseBlackboard();
            this.blackboardID = blackboardID;
            const response = yield this.apiClient.get(`/blackboards/${this.blackboardID}/acquire`);
            this.token = response.token;
            // Add some margin
            return response.timeout - 10;
        });
    }
    /**
     * Release the current blackboard
     * @param event Optional if you try to leave the page without saving
     */
    releaseBlackboard(event = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.token)
                return;
            if (event) {
                event.preventDefault();
                yield new OneBlackboard().discardChanges();
                return;
            }
            yield this.apiClient.put(`/blackboards/${this.blackboardID}/release`, null, { token: this.token });
            this.token = null;
        });
    }
    /**
     * Updated the blackboard
     * @param content The content of the blackboard
     * @param name The current (updated?) name of the blackboard
     */
    updateBlackboard(content, name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.token)
                return;
            const body = {
                token: this.token,
                name: name,
                content: content
            };
            yield this.apiClient.put(`/blackboards/${this.blackboardID}/update`, null, body);
            new Message('Blackboard saved', 'default', 2000).show();
            yield this.releaseBlackboard();
        });
    }
    /**
     * Reset the blackboard timeout
     */
    resetBlackboardTimer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.token)
                return;
            const urlParams = new URLSearchParams([['token', this.token]]);
            const response = yield this.apiClient.get(`/blackboards/${this.blackboardID}/acquire`, urlParams);
            new Message('Timeout was reset successfully', 'default', 2000).show();
            return response.timeout - 10;
        });
    }
    /**
     * Remove the lock on the blackboard if you have it and navigate away
     */
    removeLockOnNavigation() {
        document.addEventListener('urlchange', this.releaseBlackboard.bind(this));
        window.addEventListener('beforeunload', this.releaseBlackboard.bind(this));
    }
    /**
     * Add a shortcut which saves the page if you press Strg + s
     */
    addSaveShortcut() {
        if (this.shortcutListener)
            this.shortcutListener.remove();
        this.shortcutListener = new EventListener(document, 'keydown', (event) => __awaiter(this, void 0, void 0, function* () {
            if (event.key.toLowerCase() === 's' && event.ctrlKey) {
                event.preventDefault();
                event.stopPropagation();
                if (this.token)
                    yield new OneBlackboard().saveChanges();
            }
        }));
    }
}
//# sourceMappingURL=BlackboardHandler.js.map