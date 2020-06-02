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
        const url = `/api/blackboards/${location.pathname.split('/').pop()}`;
        apiResponse = await apiClient.executeRequest('GET', url, '');
    } catch (e) {
        console.error(e);
        if (e.status === 404) return notFound();

        new Message(e.message.detail, 'error').show();
        return;
    }

    // Remove the null in the api response for a empty string
    if (!apiResponse.content) {
        apiResponse.content = '';
    }

    await oneBlackboardComponent.show(apiResponse);
}

/**
 * Render the not found view
 */
function notFound() {
    notFoundComponent.show();
}
