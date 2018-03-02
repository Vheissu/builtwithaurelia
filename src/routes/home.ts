import { Store } from 'aurelia-store';
import { autoinject, computedFrom } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';

import {
    loadProjects,
    getCategories,
    setCategory,
    backupProjects,
    resetProjects,
    sortCategories
} from '../store/actions';

import { initialState, State } from '../store/state';

import { Api } from '../services/api';
import { ApplicationService } from '../services/application';
import { UserService } from '../services/user';
import { getColourFromHashedString, slugify } from '../common';

import firebase from '../common/firebase';

@autoinject()
export class Home {
    private state: any;

    constructor(
        private api: Api,
        private appService: ApplicationService,
        private userService: UserService,
        private ea: EventAggregator,
        private router: Router,
        private store: Store<State>) {
        this.store.state.subscribe((state) => {
            this.state = state;
        });
    }

    created() {
        this.store.dispatch(getCategories);
        this.store.dispatch(loadProjects);
    }

    submission($event: Event) {
        this.ea.publish('submission');
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
        // Set currently active category
        this.store.dispatch(setCategory, category);

        if (!this.state.backupProjects.length) {
            // Backup the existing projects
            this.store.dispatch(backupProjects);
        }

        this.store.dispatch(sortCategories, category);
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
