'use strict';

// Create all the components and initialize them
const homeComponent = new Home();
let oneBlackboardComponent = new OneBlackboard();
const notFoundComponent = new NotFound();

// Create a new search
new Search();

/**
 * Remove all current components
 */
function removeAll() {
    homeComponent.remove();
    oneBlackboardComponent.remove();
    notFoundComponent.remove();
}

/**
 * Main entry point
 * @return {Promise<void>}
 */
async function main() {

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

// Start the main app
window.onload = main;