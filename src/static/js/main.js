function main() {
    const router = new Router();

    router.urlChangeEmitter.addEventListener('blackboard-overview', async (event) => {
        document.title = event.title;
        const overview = new DashboardOverview('Select blackboard');
        await overview.init();
    });
    router.urlChangeEmitter.addEventListener('one-blackboard', async (event) => {
        document.title = event.title;
        const oneBlackboard = new OneBlackboard(event.title);
        await oneBlackboard.init();
    });
    router.urlChangeEmitter.addEventListener('not-found', (event) => {
        document.title = event.title;
        console.log('not-found');
        console.log(event);
    });

    router.startObservation();
}


window.onload = main;

// TODO DOMParser() for templating
