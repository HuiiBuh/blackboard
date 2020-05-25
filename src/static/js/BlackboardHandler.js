'use strict';

class BlackboardHandler {

    /**
     * @type {BlackboardHandler}
     */
    static INSTANCE;


    /**
     * Create a new Blackboard handler which deals with locking, and updating the blackboards
     * @return {BlackboardHandler}
     */
    constructor() {
        if (BlackboardHandler.INSTANCE) return BlackboardHandler.INSTANCE;
        BlackboardHandler.INSTANCE = this;

        this._removeLockOnNavigation();
        this._addSaveShortcut();

        this.apiCLient = new APIClient('/api');
        this.token = '';
        this.blackboardID = -1;
    }


    /**
     * Acquire a blackboard and if there is a blackboard locked, release it
     * @param {number} blackboardID
     * @return {Promise<void>}
     */
    async acquireBlackboard(blackboardID) {
        if (this.token) await this.releaseBlackboard();

        this.blackboardID = blackboardID;

        const response = await this.apiCLient.get(`/blackboards/${this.blackboardID}/acquire`);
        this.token = response.token;
    }

    /**
     * Release the current blackboard
     * @param event {BeforeUnloadEvent|null} Optional if some cleanup has to be done
     * @return {Promise<void>}
     */
    async releaseBlackboard(event = null) {
        if (event && this.token) event.preventDefault();

        if (!this.token) return;

        await this.apiCLient.put(`/blackboards/${this.blackboardID}/release`, {}, {
            token: this.token
        });
        this.token = null;
    }

    /**
     * Updated the blackboard
     * @param content {string} The content of the blackboard
     * @param name {string} The updated name of the blackboard
     * @return {Promise<void>}
     */
    async updateBlackboard(content, name) {
        const body = {
            token: this.token,
            name: name,
            content: content
        };

        await this.apiCLient.put(`/blackboards/${this.blackboardID}/update`, {}, body);
        await this.releaseBlackboard();
    }

    /**
     * Remove the lock on the blackboard if you have
     * @private
     */
    _removeLockOnNavigation() {
        document.addEventListener('urlchange', this.releaseBlackboard.bind(this));
        window.addEventListener('beforeunload', this.releaseBlackboard.bind(this));
    }

    /**
     * Add a shortcut which saves the page if you press Strg + s
     * @private
     */
    _addSaveShortcut() {
        document.addEventListener('keydown', async (event) => {
            if (event.key.toLowerCase() === 's' && event.ctrlKey) {
                event.preventDefault();
                event.stopPropagation();

                if (this.token) await new OneBlackboard().saveChanges();
            }
        });
    }

}