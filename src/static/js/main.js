async function main() {

    /**
     * @type {{path: string, view: Function, title?: string}[]}
     */
    const routes = [
        {path: '/blackboard/{board_name}', view: oneBlackboard},
        {path: '/', view: home, title: 'Home'},
        {path: '**', view: notFound, title: 'Not found'}
    ];

    const app = new WebApp(routes);
    await app.init();
}

window.onload = main;