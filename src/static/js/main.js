function main() {
    const router = new Router();

    router.urlChangeEmitter.addEventListener('locationchange', (event) => {
        console.log(event)
    });
}

window.onload = main;
