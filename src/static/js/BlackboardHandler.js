class BlackboardHandler {

    /**
     * @type {BlackboardHandler}
     */
    static instance;

    constructor() {
        if (BlackboardHandler.instance) return BlackboardHandler.instance;
        BlackboardHandler.instance = this;

        this._removeLockOnNavigation();

        this.apiCLient = new APIClient('/api');
        this.token = '';
        this.blackboardName = '';
    }


    async acquireBlackboard(blackboardName) {
        if (this.token) await this.releaseBlackboard();

        this.blackboardName = blackboardName;
        let response = await this.apiCLient.get(`/blackboards/${this.blackboardName}/acquire`);
        this.token = response.token;
    }

    async releaseBlackboard() {
        if (!this.token) return;

        await this.apiCLient.put(`/blackboards/${this.blackboardName}/release`, {}, {
            token: this.token
        });
    }

    async updateBlackboard(content, name) {
        const body = {
            token: this.token,
            blackboardName: name,
            content: content
        };

        await this.apiCLient.put(`/blackboards/${this.blackboardName}/update`, {}, body);
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

}