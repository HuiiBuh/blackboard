class BlackboardHandler {

    static INSTANCE: BlackboardHandler;
    private apiClient: APIClient = new APIClient('/api');

    private token = '';
    private blackboardID: string = '';


    /**
     * Create a new Blackboard handler which deals with locking, and updating the blackboards
     */
    constructor() {
        if (BlackboardHandler.INSTANCE) return BlackboardHandler.INSTANCE;
        BlackboardHandler.INSTANCE = this;

        this._removeLockOnNavigation();
        this._addSaveShortcut();
    }


    /**
     * Acquire a blackboard and if there is a blackboard locked, release it
     * @param blackboardID
     * @return The timeout
     */
    async acquireBlackboard(blackboardID: string): Promise<number> {
        if (this.token) await this.releaseBlackboard();

        this.blackboardID = blackboardID;

        const response: any = await this.apiClient.get<object>(`/blackboards/${this.blackboardID}/acquire`);
        this.token = response.token;

        return response.timeout;
    }

    /**
     * Release the current blackboard
     * @param event Optional if some cleanup has to be done
     * @return
     */
    async releaseBlackboard(event: BeforeUnloadEvent | null = null): Promise<void> {
        if (event && this.token) event.preventDefault();

        if (!this.token) return;

        await this.apiClient.put(`/blackboards/${this.blackboardID}/release`, null, {token: this.token});
        this.token = null;
    }

    /**
     * Updated the blackboard
     * @param content The content of the blackboard
     * @param name The updated name of the blackboard
     */
    async updateBlackboard(content: string, name: string): Promise<void> {
        const body = {
            token: this.token,
            name: name,
            content: content
        };

        await this.apiClient.put(`/blackboards/${this.blackboardID}/update`, null, body);
        await this.releaseBlackboard();
    }

    /**
     * Remove the lock on the blackboard if you have
     */
    _removeLockOnNavigation(): void {
        document.addEventListener('urlchange', this.releaseBlackboard.bind(this));
        window.addEventListener('beforeunload', this.releaseBlackboard.bind(this));
    }

    /**
     * Add a shortcut which saves the page if you press Strg + s
     */
    _addSaveShortcut(): void {
        document.addEventListener('keydown', async (event) => {
            if (event.key.toLowerCase() === 's' && event.ctrlKey) {
                event.preventDefault();
                event.stopPropagation();

                if (this.token) await new OneBlackboard().saveChanges();
            }
        });
    }

}