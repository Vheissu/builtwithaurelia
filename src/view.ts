import {autoinject} from 'aurelia-framework';

import {Api} from './api';

@autoinject
export class View {
    private api: Api;

    private project;

    constructor(api: Api) {
        this.api = api;
    }

    attached() {
        document.body.classList.add('single-view');
    }

    detached() {
        document.body.classList.remove('single-view');
    }

    activate(params, currentRoute) {
        if (params.slug) {
            this.api.getProject(params.slug).then(project => {
                this.project = project;
                currentRoute.navModel.title = project.name;
            }).catch(e => {
                console.error(e);
            });
        }
    }
}
