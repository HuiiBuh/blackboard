function main() {
    const router = new Router();

    router.urlChangeEmitter.addEventListener('locationchange', (event) => {
        console.log('location changed');
        console.log(event);
    });

    router.startObservation();
}


window.onload = main;

// TODO DOMParser() for templating


function addThing() {
    const link = document.getElementById('no-link');
    link.setAttribute('routerLink', '/blackboard/test');
}
