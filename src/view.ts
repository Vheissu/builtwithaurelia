import {autoinject} from 'aurelia-framework';

import {Api} from './api';

@autoinject
export class View {
    api: Api;
    project;

    canActivate(params) {
        if (params.slug) {
            this.api.getProject(params.slug).then(project => {
                this.project = project;
            }).catch(e => {
                console.error(e);
            });
        }
    }

    constructor(api: Api) {
        this.api = api;
    }
}
