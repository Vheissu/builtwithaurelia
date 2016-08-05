import {autoinject, computedFrom} from 'aurelia-framework';
import {Router} from 'aurelia-router';

import {Api} from './api';

const maxProjectsPerPage = 10;

@autoinject
export class Home {
    private api: Api;
    private router: Router;

    private currentCategory = null;

    private categories = [
        {name: 'All', value: ''},
        {name: 'Mobile', value: 'mobile'},
        {name: 'Plugins', value: 'plugin'},
        {name: 'Themes', value: 'theme'},
        {name: 'Websites', value: 'website'}
    ];

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

    canActivate(params) {
        this.currentPage = params.page || 1;

        this.api.getProjects().then(projects => {
            if (projects.length) {
                this.projects = projects;
            } else {
                this.router.navigate('/');
            }
        });
    }

    constructor(api: Api, router: Router) {
        this.api = api;
        this.router = router;
    }

    activate() {
        this.currentCategory = this.categories[0];
    }

    @computedFrom('bgClasses')
    get background() {
        return this.getRandomBackgroundColour();
    }

    getRandomBackgroundColour(): string {
        const getBackgroundString = () => {
            return this.bgClasses[Math.floor(Math.random() * this.bgClasses.length)];
        };

        // Pick a random class from the array
        let random = getBackgroundString();

        // Random string is not the same as the last generated string
        if (random !== this.lastBackground) {
            this.lastBackground = random;
            return random;
        } else {
            // TODO: use recursion to make this neater, was saving time
            // this will not always gurantee non-duplicates
            let random = getBackgroundString();

            this.lastBackground = random;
            return random;
        }
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
