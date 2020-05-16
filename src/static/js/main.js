async function main() {

    /**
     * @type {{path: string, view: Function, title?: string}[]}
     */
    const routes = [
        {path: '\/blackboard\/[a-zA-Z-._~]+\/?', view: oneBlackboard},
        {path: '\/', view: home, title: 'Home'},
        {path: '**', view: notFound, title: 'Not found'}
    ];

    const app = new WebApp(routes);
    await app.init();
}

const pageApiClient = new APIClient('/static/html/');
const parser = new Parser();

async function home() {
    const content = await pageApiClient.get('overview.html').catch((reason => {
        throw Error(JSON.stringify(reason));
    }));

    const apiResponse = {
        blackboardList: [{
            url: 'first-url',
            name: 'first-name',
            editingDate: '12.01.2019',
            empty: 'check'
        }]
    };

    parser.insertAt(content, apiResponse, '.container');
}

async function oneBlackboard() {
    const content = await pageApiClient.get('one_blackboard.html').catch((reason => {
        throw Error(JSON.stringify(reason));
    }));

    const apiResponse = {
        name:'TestBoard',
        value:'<h4>hello <b>world</b></h4>'
    };

    parser.insertAt(content, apiResponse, '.container');
}

async function notFound() {
    const content = await pageApiClient.get('not_found.html').catch((reason => {
        throw Error(JSON.stringify(reason));
    }));

    parser.insertAt(content, {}, '.container');

}


window.onload = main;

