let homeComponent = null;
let oneBlackboardComponent = null;
let notFoundComponent = null;

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

    homeComponent = new Home(apiResponse);
    homeComponent.show();
}

async function oneBlackboard() {
    const apiResponse = {
        name: 'TestBoard',
        value: '<h4>hello world</h4>'
    };

    oneBlackboardComponent = new OneBlackboard(apiResponse);
    oneBlackboardComponent.show();
}

function notFound() {
    notFoundComponent = new NotFound();
    notFoundComponent.show();
}
