class DashboardOverview extends BasePage {

    async init() {
        await super.init();

        this.root.innerHTML = await this.apiClient.get('overview.html').catch((reason => {
            throw Error(JSON.stringify(reason));
        }));

        const blackboardList = [{
            name: 'First board',
            lastChange: '12.01.2019',
            isEmpty: false,
        }];

        const root = document.querySelector('tbody');
        for (let i = 0; i < 100; ++i) {
            for (let blackboard of blackboardList) {
                blackboard.name = 'First board' + i;
                root.appendChild(this.buildDashboard(blackboard));
            }
        }

    }

    buildDashboard(blackboard) {
        const tr = document.createElement('tr');

        const nameTd = document.createElement('td');
        nameTd.innerText = blackboard.name;
        nameTd.setAttribute('routerLink', `/blackboard/${blackboard.name}`);
        tr.appendChild(nameTd);

        const changeID = document.createElement('td');
        changeID.innerText = blackboard.lastChange;
        tr.appendChild(changeID);

        const contentTd = document.createElement('td');
        contentTd.setAttribute('class', 'text-center');
        contentTd.appendChild(this.getIcon(blackboard.isEmpty ? 'close' : 'check'));
        tr.appendChild(contentTd);

        const deleteTd = document.createElement('td');
        deleteTd.setAttribute('class', 'text-center');
        deleteTd.appendChild(this.getIcon('delete', 'warn pointer'));
        tr.appendChild(deleteTd);

        return tr;
    }

    getIcon(type, classString = '') {
        const i = document.createElement('i');
        i.setAttribute('class', `material-icons ${classString}`);
        i.innerText = type;

        return i;
    }


}
