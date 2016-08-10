import {autoinject, computedFrom} from 'aurelia-framework';
import {Router} from 'aurelia-router';

import {Api} from './api';
import {ApplicationService} from './services/application';
import {UserService} from './services/user';
import {getColourFromHashedString} from './common';

declare var firebase;

@autoinject
export class Home {
    private api: Api;
    private appService: ApplicationService;
    private userService: UserService;
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

    constructor(api: Api, appService, ApplicationService, userService: UserService, router: Router) {
        this.api = api;
        this.appService = appService;
        this.userService = userService;
        this.router = router;
    }

    canActivate(params) {
        let projectsPromise = new Promise((resolve, reject) => {
            this.api.getProjects().then(projects => {
                if (projects.length) {
                    this.projects = projects;
                    this.getProjectCounts();

                    resolve(projects);
                }
            })
        });

        let votedSubmissionsPromise = new Promise((resolve, reject) => {
            this.api.getVotedSubmissions().then(submissions => {
                for (let submission in submissions) {
                    if (submission) {
                        this.projects.map(project => {
                            if (project.slug == submission) {
                                if (this.userService.getLoggedInUser()) {
                                    if (this.userService.getLoggedInUser().uid in submissions[submission].votes) {
                                        project.currentUserHasVotedFor = true;
                                    }
                                }
                                
                                // Count the vote nodes to get the vote count
                                project.votes = Object.keys(submissions[submission].votes).length;
                            }

                            return project;
                        });
                    }
                }
                resolve(true);
            });
        });

        return Promise.all([projectsPromise, votedSubmissionsPromise]);
    }

    activate() {
        // Make sure all projects have a vote count
        this.projects.map(project => {
            if (typeof project.votes === 'undefined') {
                project.votes = 0;
            }
            return project;
        });

        // Sort the projects by their vote counts in descending order
        this.projects.sort((a, b) => {
            return parseInt(b.votes, 10) - parseInt(a.votes, 10);
        });
        
        this.currentCategory = this.categories.all;
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

    vote(evt, slug) {
        this.projects.map(project => {
            if (project.slug === slug) {
                project.votes++;
                project.currentUserHasVotedFor = true;
            }
            return project;
        });

        this.api.castVote(slug);
    }
}
