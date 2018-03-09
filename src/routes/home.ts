import { PLATFORM } from 'aurelia-pal';
import { autoinject, computedFrom } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { Store } from 'aurelia-store';

import {
    loadProjects,
    getCategories,
    setCategory,
    backupProjects,
    resetProjects,
    sortCategories,
    changeSortMode,
    sortProjects,
    castVote
} from '../store/actions';

import { State } from '../store/state';

import { Api } from '../services/api';
import { ApplicationService } from '../services/application';
import { UserService } from '../services/user';
import { getColourFromHashedString, slugify } from '../common';

import firebase from '../common/firebase';

@autoinject()
export class Home {
    private state: State;

    constructor(
        private api: Api,
        private appService: ApplicationService,
        private userService: UserService,
        private ea: EventAggregator,
        private router: Router,
        private store: Store<State>) {
        this.store.state.subscribe(
            (state: State) => this.state = state
        );
    }

    @computedFrom('state.categories')
    get categories() {
        return this.state.categories;
    }

    @computedFrom('state.projects')
    get projects() {
        return this.state.projects;
    }

    @computedFrom('state.currentCategory')
    get currentCategory() {
        return this.state.currentCategory;
    }

    @computedFrom('state.currentSortMode')
    get currentSortMode() {
        return this.state.currentSortMode;
    }

    async activate(params) {
        if (!this.state.categories.length) {
            await this.store.dispatch(getCategories);
        }

        await this.store.dispatch(loadProjects);

        const { category } = params;

        console.log(this.categories[category]);

        if (category && this.categories[category]) {
            this.filterCategory(this.categories[category]);
        }
    }

    submission($event: Event) {
        this.ea.publish('submission');
    }

    getRandomBackgroundColour(name): string {
        return getColourFromHashedString(name);
    }

    sortBy(type) {
        this.store.dispatch(changeSortMode, type);

        if (type === 'popular') {
            this.sortByPopular();
        } else if (type === 'new') {
            this.sortByNewlyAdded();
        }
    }

    sortByPopular() {
        this.store.dispatch(sortProjects, 'popular');
    }

    sortByNewlyAdded() {
        this.store.dispatch(sortProjects, 'new');
    }

    filterCategory(category) {
        this.store.dispatch(setCategory, category);

        if (!this.state.backupProjects.length) {
            // Backup the existing projects
            this.store.dispatch(backupProjects);
        }

        this.store.dispatch(sortCategories, category);
    }

    vote(evt, name) {
        if (this.userService.isLoggedIn) {
            this.store.dispatch(castVote, name);
        } else {
            this.ea.publish('show.login-form');
        }
    }
}
