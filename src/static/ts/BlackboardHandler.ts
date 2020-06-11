class BlackboardHandler {

    private static INSTANCE: BlackboardHandler;
    private apiClient: APIClient = new APIClient('/api');

    private token = '';
    private blackboardID: string = '';

    private shortcutListener: EventListener;


    /**
     * Create a new Blackboard handler which deals with locking, unlocking, and updating the blackboards
     */
    constructor() {
        if (BlackboardHandler.INSTANCE) return BlackboardHandler.INSTANCE;
        BlackboardHandler.INSTANCE = this;

        this.addSaveShortcut();
        this.removeLockOnNavigation();
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
        if (!this.token) return;

        if (event) {
            event.preventDefault();
            await new OneBlackboard().discardChanges();
            return;
        }

        await this.apiClient.put(`/blackboards/${this.blackboardID}/release`, null, {token: this.token});
        this.token = null;
    }

    /**
     * Updated the blackboard
     * @param content The content of the blackboard
     * @param name The current (updated?) name of the blackboard
     */
    public async updateBlackboard(content: string, name: string): Promise<void> {
        if (!this.token) return;

        const body = {
            token: this.token,
            name: name,
            content: content
        };

        await this.apiClient.put(`/blackboards/${this.blackboardID}/update`, null, body);

        new Message('Blackboard saved', 'default', 2000).show();

        await this.releaseBlackboard();
    }


    /**
     * Reset the blackboard timeout
     */
    public async resetBlackboardTimer(): Promise<number> {
        if (!this.token) return;

        const urlParams: URLSearchParams = new URLSearchParams([['token', this.token]]);
        const response: any = await this.apiClient.get<object>(`/blackboards/${this.blackboardID}/acquire`, urlParams);

        new Message('Timeout was reset successfully', 'default', 2000).show();

        return response.timeout - 10;
    }

    /**
     * Remove the lock on the blackboard if you have it and navigate away
     */
    private removeLockOnNavigation(): void {
        document.addEventListener('urlchange', this.releaseBlackboard.bind(this));
        window.addEventListener('beforeunload', this.releaseBlackboard.bind(this));
    }


    /**
     * Add a shortcut which saves the page if you press Strg + s
     */
    public addSaveShortcut(): void {
        if (this.shortcutListener) this.shortcutListener.remove();

        this.shortcutListener = new EventListener(document, 'keydown', async (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === 's' && event.ctrlKey) {
                event.preventDefault();
                event.stopPropagation();

                if (this.token) await new OneBlackboard().saveChanges();
            }
        });
    }

}