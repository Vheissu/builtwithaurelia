import {autoinject} from 'aurelia-framework';

import {Api} from './api';

@autoinject
export class Home {
    api: Api;

    currentCategory = null;

    categories = [
        {name: 'All', value: ''},
        {name: 'Plugins', value: 'plugin'},
        {name: 'Websites', value: 'website'}
    ];

    projects = [];

    canActivate() {
        this.api.getProjects().then(projects => {
            this.projects = projects;
        })
    }

    constructor(api: Api) {
        this.api = api;
    }

    activate() {
        this.currentCategory = this.categories[0];
    }

    filterCategory(category) {
        this.currentCategory = category;
    }
}
