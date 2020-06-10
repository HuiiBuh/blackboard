class BlackboardHandler {

    static INSTANCE: BlackboardHandler;
    private apiClient: APIClient = new APIClient('/api');

    private token = '';
    private blackboardID: string = '';

    private _shortcutListener: EventListener;


    /**
     * Create a new Blackboard handler which deals with locking, unlocking, and updating the blackboards
     */
    constructor() {
        if (BlackboardHandler.INSTANCE) return BlackboardHandler.INSTANCE;
        BlackboardHandler.INSTANCE = this;

        this.addSaveShortcut();
        this._removeLockOnNavigation();
    }


    /**
     * Acquire a blackboard and if there is a blackboard locked, release it
     * @param blackboardID The  id of the blackboard you want to acquire
     * @return A timeout for limiting the editing time
     */
    public async acquireBlackboard(blackboardID: string): Promise<number> {
        if (this.token) await this.releaseBlackboard();

        this.blackboardID = blackboardID;

        const response: any = await this.apiClient.get<object>(`/blackboards/${this.blackboardID}/acquire`);
        this.token = response.token;

        // Add some margin
        return response.timeout - 10;
    }

    /**
     * Release the current blackboard
     * @param event Optional if you try to leave the page without saving
     */
    public async releaseBlackboard(event: BeforeUnloadEvent | null = null): Promise<void> {
        if (event && this.token) {
            event.preventDefault();
            await new OneBlackboard().discardChanges();
        }

        if (!this.token) return;

        await this.apiClient.put(`/blackboards/${this.blackboardID}/release`, null, {token: this.token});
        this.token = null;
    }

    /**
     * Updated the blackboard
     * @param content The content of the blackboard
     * @param name The current (updated?) name of the blackboard
     */
    public async updateBlackboard(content: string, name: string): Promise<void> {
        const body = {
            token: this.token,
            name: name,
            content: content
        };

        await this.apiClient.put(`/blackboards/${this.blackboardID}/update`, null, body);
        await this.releaseBlackboard();
    }


    /**
     * Reset the blackboard timeout
     */
    public async resetBlackboardTimer(): Promise<number> {
        const urlParams: URLSearchParams = new URLSearchParams([['token', this.token]]);
        const response: any = await this.apiClient.get<object>(`/blackboards/${this.blackboardID}/acquire`, urlParams);
        return response.timeout - 10;
    }

    /**
     * Remove the lock on the blackboard if you have it and navigate away
     */
    private _removeLockOnNavigation(): void {
        document.addEventListener('urlchange', this.releaseBlackboard.bind(this));
        window.addEventListener('beforeunload', this.releaseBlackboard.bind(this));
    }


    /**
     * Add a shortcut which saves the page if you press Strg + s
     */
    public addSaveShortcut(): void {
        if (this._shortcutListener) this._shortcutListener.remove();

        this._shortcutListener = new EventListener(document, 'keydown', async (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === 's' && event.ctrlKey) {
                event.preventDefault();
                event.stopPropagation();

                if (this.token) await new OneBlackboard().saveChanges();
            }
        });
    }

}