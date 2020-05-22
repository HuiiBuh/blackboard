const apiClient = new APIClient('/api');


async function home() {
    document.title = 'Select blackboard';
    const homeComponent = new Home();
    await homeComponent.show();
}

async function oneBlackboard() {

    const boardName = location.pathname.split('/').pop();

    let apiResponse;
    try {
        apiResponse = await apiClient.get(`/blackboards/${boardName}`);
    } catch (e) {
        if (e.status === 404) {
            notFound();
            return;
        }

        new Message(e.message.detail, 'error').show();
    }

    if (!apiResponse.content) {
        apiResponse.content = '';
    }

    const oneBlackboardComponent = new OneBlackboard(apiResponse);
    await oneBlackboardComponent.show();
}

function notFound() {
    const notFoundComponent = new NotFound();
    notFoundComponent.show();
}
