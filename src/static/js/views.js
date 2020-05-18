async function home() {
    document.title = 'Select blackboard';

    const apiResponse = {
        blackboardList: [{
            url: 'first-url',
            name: 'first-name',
            editingDate: '12.01.2019',
            empty: 'check'
        }]
    };

    const homeComponent = new Home(apiResponse);
    homeComponent.show();
}

async function oneBlackboard() {
    const apiResponse = {
        name: 'TestBoard',
        value: '<h4>hello world</h4>'
    };

    const oneBlackboardComponent = new OneBlackboard(apiResponse);
    oneBlackboardComponent.show();
}

function notFound() {
    const notFoundComponent = new NotFound();
    notFoundComponent.show();
}
