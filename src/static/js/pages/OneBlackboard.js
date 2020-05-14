class OneBlackboard extends BasePage {

    async init() {
        await super.init();

        this.titleElement.innerText = this.title;

        this.root.innerHTML = await this.apiClient.get('one_blackboard.html').catch((reason => {
            throw Error(JSON.stringify(reason));
        }));
    }
}
