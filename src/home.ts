import { Store } from 'aurelia-store';
import { computedFrom } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { loadProjects, getCategories } from './store/actions';
import initialState from './store/state';

import { Api } from './api';
import { ApplicationService } from './services/application';
import { UserService } from './services/user';
import { getColourFromHashedString, slugify } from './common';

import firebase from './firebase';

export class Home {
    private api: Api;
    private appService: ApplicationService;
    private userService: UserService;
    private ea: EventAggregator;
    private router: Router;
    private store;

    private state: any;

    static inject = [ Api, ApplicationService, UserService, EventAggregator, Router, Store ];

    constructor(api, appService, userService, ea, router, store) {
        this.api = api;
        this.appService = appService;
        this.userService = userService;
        this.ea = ea;
        this.router = router;

        this.store.state.subscribe((state) => {
            this.state = state;
        });
    }

    created() {
        this.store.dispatch(loadProjects, this.api.getProjectsFromFirebase);
        this.store.dispatch(getCategories);
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

                    this.state.projects.push(project);
                }

                resolve(projects);
            });
        });

        return Promise.all([projectsPromise]);
    }

    activate() {
        // Sort the projects by their vote counts in descending order
        this.state.projects.sort((a, b) => {
            return parseInt(b.votes, 10) - parseInt(a.votes, 10) || a.added - b.added;
        });

        this.getProjectCounts();

        this.state.currentCategory = this.state.categories.all;
    }

    submission($event: Event) {
        this.ea.publish('submission');
    }

    getProjectCounts() {
        if (this.state.projects.length) {
            for (let i = 0; i < this.state.projects.length; i++) {
                let item = this.state.projects[i];

                if (item && item.category) {
                    let navItem = this.state.categories[item.category];

                    if (navItem) {
                        navItem.count += 1;
                    }
                }
            }

            this.state.categories.all.count = this.state.projects.length;
        }
    }

    getRandomBackgroundColour(name): string {
        return getColourFromHashedString(name);
    }

    sortBy(type) {
        this.state.currentSortMode = type;

        if (type === 'popular') {
            this.sortByPopular();
        } else if (type === 'new') {
            this.sortByNewlyAdded();
        }
    }

    sortByPopular() {
        this.state.projects.sort((a, b) => {
            return parseInt(b.votes, 10) - parseInt(a.votes, 10) || a.added - b.added;
        });
    }

    sortByNewlyAdded() {
        this.state.projects.sort((a, b) => {
            return b.added - a.added;
        });
    }

    filterCategory(category) {
        this.state.currentCategory = category;

        if (!this.state.backupProjects.length) {
            // Backup existing projects
            this.state.backupProjects = this.state.projects.slice(0);
        }

        // If we are not wanting to show everything
        if (category.value !== '') {
            this.state.projects = this.state.backupProjects.filter(project => {
                return project.category === category.value;
            });
        } else {
            this.state.projects = this.state.backupProjects;
        }
    }

    vote(evt, name) {
        if (this.userService.isLoggedIn) {
            var voteAction: 'add' | 'remove' = 'add';

            this.state.projects.map(project => {
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
