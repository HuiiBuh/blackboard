'use strict';

const apiClient = new APIClient('/api');


/**
 * Render the home view
 */
async function home() {
    await homeComponent.show();
}

/**
 * Render the one blackboard view
 */
async function oneBlackboard() {

    let apiResponse;
    try {
        apiResponse = await apiClient.request('GET', `/blackboards/${location.pathname.split('/').pop()}`);
    } catch (e) {
        if (e.status === 404) return notFound();

        new Message(e.message.detail, 'error').show();
    }

    // Remove the null in the api response for a empty string
    if (!apiResponse.content) {
        apiResponse.content = '';
    }

    oneBlackboardComponent = new OneBlackboard();
    await oneBlackboardComponent.show(apiResponse);
}

/**
 * Render the not found view
 */
function notFound() {
    notFoundComponent.show();
}
