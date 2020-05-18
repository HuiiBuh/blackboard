async function home() {
    document.title = 'Select blackboard';

    const apiResponse = {
        blackboardList: [{
            url: 'first-url',
            name: 'first-name',
            editingDate: '12.01.2019',
            empty: 'check'
        }, {
            url: 'first-url',
            name: 'first-name',
            editingDate: '12.01.2019',
            empty: 'check'
        }, {
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
        value: `
# Your markdown here
        
| Tables   |      Are      |  Cool |
|----------|:-------------:|------:|
| col 1 is |  left-aligned | $1600 |
| col 2 is |    centered   |   $12 |
| col 3 is | right-aligned |    $1 |
`
    };

    const oneBlackboardComponent = new OneBlackboard(apiResponse);
    await oneBlackboardComponent.show();
}

function notFound() {
    const notFoundComponent = new NotFound();
    notFoundComponent.show();
}
