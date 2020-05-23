// Create all the components and initialize them
let homeComponent = new Component();
let oneBlackboardComponent = new Component();
let notFoundComponent = new Component();

/**
 * Remove all current components
 */
function removeAll() {
    homeComponent.remove();
    oneBlackboardComponent.remove();
    notFoundComponent.remove();
}

const blackboardHandler = new BlackboardHandler();

/**
 * Main entry point
 * @return {Promise<void>}
 */
async function main() {

    new Search();

    /**
     * @type {{path: string, view: Function, title?: string}[]}
     */
    const routes = [
        {path: '/blackboard/{board_name}', view: oneBlackboard},
        {path: '/', view: home, title: 'Select blackboard'},
        {path: '**', view: notFound, title: 'Not found'}
    ];

    const app = new WebApp(routes, removeAll);
    await app.init();
}

window.onload = main;
