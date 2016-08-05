import {autoinject, computedFrom} from 'aurelia-framework';
import {Router} from 'aurelia-router';

import {Api} from './api';
import {ApplicationService} from './services/application';

const maxProjectsPerPage = 10;

@autoinject
export class Home {
    private api: Api;
    private appService: ApplicationService;
    private router: Router;

    private currentCategory = null;

    private categories = {
        all: {name: 'All', value: '', count: 0},
        mobile: {name: 'Mobile', value: 'mobile', count: 0},
        plugin: {name: 'Plugins', value: 'plugin', count: 0},
        theme: {name: 'Themes', value: 'theme', count: 0},
        website: {name: 'Websites', value: 'website', count: 0}
    };

    private lastBackground = '';

    private bgClasses = [
        'bg--purple',
        'bg--grapefruit',
        'bg--medium-blue',
        'bg--bright-blue',
        'bg--gentle-pink',
        'bg--teal',
        'bg--light-cyan',
        'bg--brave-orange',
        'bg--yellow-its-me',
        'bg--green',
        'bg--pie',
        'bg--middle-blue'
    ];

    private projects = [];
    private backupProjects = [];

    private currentPage: number = 1;
    private totalNumberOfPages: number = -1;

    constructor(api: Api, appService, ApplicationService, router: Router) {
        this.api = api;
        this.appService = appService;
        this.router = router;
    }

    canActivate(params) {
        this.currentPage = params.page || 1;

        this.api.getProjects().then(projects => {
            if (projects.length) {
                this.projects = projects;
                this.getProjectCounts();
            } else {
                this.router.navigate('/');
            }
        });
    }

    activate() {
        this.currentCategory = this.categories.all;
    }

    getProjectCounts() {
        if (this.projects.length) {
            for (let i = 0; i < this.projects.length; i++) {
                let item = this.projects[i];

                if (item && item.category) {
                    let navItem = this.categories[item.category];
                    console.log(item);

                    if (navItem) {
                        navItem.count += 1;
                    }
                }
            }

            this.categories.all.count = this.projects.length;
            console.log(this.categories);
        }
    }

    getRandomBackgroundColour(name): string {
        const hashString = (str) => {
            let hash = 0;

            for (let i = 0; i < str.length; i++) {
                let charCode = str.charCodeAt(i);
                hash += charCode;
            }

            return hash;
        };

        let hash = hashString(name);
        let index = hash % this.bgClasses.length;
        return this.bgClasses[index];
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
