import {autoinject} from 'aurelia-framework';

import {Api} from './api';

const maxProjectsPerPage = 10;

@autoinject
export class Home {
    private api: Api;

    private currentCategory = null;

    private categories = [
        {name: 'All', value: ''},
        {name: 'Plugins', value: 'plugin'},
        {name: 'Websites', value: 'website'}
    ];

    private projects = [];
    private backupProjects = [];

    private currentPage: number = 1;

    canActivate(params) {
        this.currentPage = params.currentPage || 1;

        this.api.getProjects(maxProjectsPerPage, this.currentPage).then(projects => {
            this.projects = projects;
        });
    }

    constructor(api: Api) {
        this.api = api;
    }

    activate() {
        this.currentCategory = this.categories[0];
    }

    filterCategory(category) {
        this.currentCategory = category;

        if (!this.backupProjects.length) {
            // Backup existing projects
            this.backupProjects = this.projects.slice(0);
        }

        // If we are not wanting to show everything
        if (category.value !== '') {
            this.projects = this.backupProjects.filter(project => {
                return project.category === category.value;
            });
        } else {
            this.projects = this.backupProjects;
        }
    }
}
