const apiClient = new APIClient('/api');


async function home() {
    homeComponent = new Home();
    await homeComponent.show();
}

async function oneBlackboard() {

    let apiResponse;
    try {
        apiResponse = await apiClient.request('GET', `/blackboards/${location.pathname.split('/').pop()}`);
    } catch (e) {
        if (e.status === 404) return notFound();

        new Message(e.message.detail, 'error').show();
    }

    if (!apiResponse.content) {
        apiResponse.content = '';
    }

    oneBlackboardComponent = new OneBlackboard();
    await oneBlackboardComponent.show(apiResponse);
}

function notFound() {
    notFoundComponent = new NotFound();
    notFoundComponent.show();
}
