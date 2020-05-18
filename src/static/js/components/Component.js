class Component {

    constructor() {
        this.parser = new Parser();
        this.element = null;
    }

    _createElement(string) {
        const temp = document.createElement('div');
        temp.innerHTML = string;

        const child = temp.children;
        if (child.length === 1) {
            return child[0];
        } else {
            return temp;
        }
    }

    show() {
        throw Error('Not implemented');
    }

    remove() {
        throw Error('Not implemented');
    }
}