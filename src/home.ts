import {autoinject, computedFrom} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';

import {Api} from './api';
import {ApplicationService} from './services/application';
import {UserService} from './services/user';
import {getColourFromHashedString, slugify} from './common';

declare var firebase;

@autoinject
export class Home {
    private api: Api;
    private appService: ApplicationService;
    private userService: UserService;
    private ea: EventAggregator;
    private router: Router;

    private currentCategory = null;

    private categories = {
        all: {name: 'All', value: '', count: 0},
        mobile: {name: 'Mobile', value: 'mobile', count: 0},
        plugin: {name: 'Plugins', value: 'plugin', count: 0},
        theme: {name: 'Themes', value: 'theme', count: 0},
        website: {name: 'Websites', value: 'website', count: 0}
    };

    private projects = [];
    private backupProjects = [];

    private currentPage: number = 1;
    private totalNumberOfPages: number = -1;

    constructor(api: Api, appService, ApplicationService, userService: UserService, ea: EventAggregator, router: Router) {
        this.api = api;
        this.appService = appService;
        this.userService = userService;
        this.ea = ea;
        this.router = router;
    }

    canActivate(params) {
        let projectsPromise = new Promise((resolve, reject) => {
            this.api.getProjectsFromFirebase().then(projects => {
                for (let key in projects) {
                    let project = projects[key];

                    if (typeof project.votes !== 'undefined') {
                        if (firebase.auth().currentUser) {
                            if (firebase.auth().currentUser.uid in project.votes) {
                                project.currentUserHasVotedFor = true;
                            }
                        }

                        project.votes = Object.keys(project.votes).length;
                    } else {
                        project.votes = 0;
                    }
                    
                    this.projects.push(project);
                }

                resolve(projects);
            });
        });

        return Promise.all([projectsPromise]);
    }

    activate() {
        // Sort the projects by their vote counts in descending order
        this.projects.sort((a, b) => {
            return parseInt(b.votes, 10) - parseInt(a.votes, 10);
        });

        this.getProjectCounts();
        
        this.currentCategory = this.categories.all;
    }

    submission($event: Event) {
        this.ea.publish('submission');
    }

    getProjectCounts() {
        if (this.projects.length) {
            for (let i = 0; i < this.projects.length; i++) {
                let item = this.projects[i];

                if (item && item.category) {
                    let navItem = this.categories[item.category];

                    if (navItem) {
                        navItem.count += 1;
                    }
                }
            }

            this.categories.all.count = this.projects.length;
        }
    }

    getRandomBackgroundColour(name): string {
        return getColourFromHashedString(name);
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

    vote(evt, name) {
        if (this.userService.isLoggedIn) {
            var voteAction = 'add';

            this.projects.map(project => {
                if (slugify(project.name) === slugify(name)) {
                    if (project.currentUserHasVotedFor) {
                        project.votes--;
                        project.currentUserHasVotedFor = false;
                        voteAction = 'remove';
                    } else {
                        project.votes++;
                        project.currentUserHasVotedFor = true;
                    }
                }

                return project;
            });

            this.api.castVote(name, voteAction);
        } else {
            this.ea.publish('show.login-form');
        }
    }
}
