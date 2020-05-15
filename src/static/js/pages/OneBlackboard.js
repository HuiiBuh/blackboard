class OneBlackboard extends BasePage {

    async init() {
        await super.init();

        this.titleElement.innerText = this.title;

        let content = await this.apiClient.get('one_blackboard.html').catch((reason => {
            throw Error(JSON.stringify(reason));
        }));

        const parser = new Parser();
        content = parser.parseDocument(content, {
            test: 'X',
            fifty: Array.from(Array(1000).keys()),
            hello: {
                test: 'Y',
                kuchen: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
            },
        });
        this.root.innerHTML = content;
    }
}
