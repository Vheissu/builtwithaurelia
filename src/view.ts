import {autoinject} from 'aurelia-framework';

import {Api} from './api';

@autoinject
export class View {
    private api: Api;

    private project;

    constructor(api: Api) {
        this.api = api;
    }

    canActivate(params, currentRoute) {
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
