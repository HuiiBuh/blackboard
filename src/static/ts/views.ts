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

    const url: string = `/api/blackboards/${location.pathname.split('/').pop()}`;
    const apiResponse = await apiClient.executeRequest('GET', url, '').catch((e) => {

        console.error(e);

        // Return the not found page if the server returns a 404
        if (e.status === 404) return notFound();

        new Message(e.message.detail, 'error').show();
        return;
    });

    // Replace the 'null' in the api response for a empty string
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
