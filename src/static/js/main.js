async function main() {

    new Search();

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


/**
 * Sleep for a specific amount of time
 * @param ms {number} Sleep duration
 * @return {Promise<void>}
 */
async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}