// Create all the components and initialize them
const homeComponent = new Home();
const oneBlackboardComponent = new OneBlackboard();
const notFoundComponent = new NotFound();

// Create a new search
new Search();

/**
 * Remove all current components (gets called after every url change)
 */
function removeAll() {
    homeComponent.remove();
    oneBlackboardComponent.remove();
    notFoundComponent.remove();
}


/**
 * Format the api response so it can be displayed properly
 * @param apiResponse The api response
 * @return The modified api object
 */
function formatApiData(apiResponse: any): any {

    // Show the placeholder if no blackboard is in the database
    if (apiResponse.blackboard_list.length === 0) {
        apiResponse.placeholder_list = [1];
    } else {
        apiResponse.placeholder_list = [];
    }

    apiResponse.blackboard_list.forEach(blackboard => {
        blackboard.editedIcon = blackboard.is_edit ? 'check' : 'close';
        blackboard.emptyIcon = blackboard.is_empty ? 'close' : 'check';
        blackboard.timestamp_create = new Date(blackboard.timestamp_create * 1000).toLocaleString();
        blackboard.timestamp_edit = new Date(blackboard.timestamp_edit * 1000).toLocaleString();
    });

    return apiResponse;
}


/**
 * Main entry point
 */
async function main(): Promise<void> {

    const routes: { path: string, view: Function, title?: string }[] = [
        {path: '/blackboard/{board_name}', view: oneBlackboard},
        {path: '/', view: home, title: 'Select Blackboard'},
        {path: '**', view: notFound, title: 'Not found'}
    ];

    const app = new WebApp(routes, removeAll);
    await app.init();
}

// Start the main app
window.onload = main;