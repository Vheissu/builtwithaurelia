import { TaskQueue } from 'aurelia-task-queue';
import { autoinject, computedFrom } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { dispatchify, Store, connectTo } from 'aurelia-store';

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

@connectTo()
@autoinject()
export class Home {
    private state: State;

    constructor(
        private api: Api,
        private appService: ApplicationService,
        private userService: UserService,
        private ea: EventAggregator,
        private router: Router,
        private store: Store<State>,
        private taskQueue: TaskQueue) {
    }

    async canActivate(params) {
        await dispatchify(getCategories)();
        await dispatchify(loadProjects)();

        // this.taskQueue.queueMicroTask(() => {
        //     console.log(this.state);
        // });
    }

    activate(params) {
        const { category } = params;

        setTimeout(() => {
            if (category) {
                const cat = this.state.categories.find(el => el.value === category);
                if (cat) {
                    this.filterCategory(cat);
                }
            }
        }, 120);
    }

    submission($event: Event) {
        this.ea.publish('submission');
    }

    getRandomBackgroundColour(name): string {
        return getColourFromHashedString(name);
    }

    sortBy(type) {
        dispatchify(changeSortMode)(type);

        if (type === 'popular') {
            this.sortByPopular();
        } else if (type === 'new') {
            this.sortByNewlyAdded();
        }
    }

    sortByPopular() {
        dispatchify(sortProjects)('popular');
    }

    sortByNewlyAdded() {
        dispatchify(sortProjects)('new');
    }

    filterCategory(category) {
        dispatchify(setCategory)(category);

        if (!this.state.backupProjects.length) {
            // Backup the existing projects
            dispatchify(backupProjects)();
        }

        dispatchify(sortCategories)(category);
    }

    vote(evt, name) {
        if (this.userService.isLoggedIn) {
            dispatchify(castVote)(name);
        } else {
            this.ea.publish('show.login-form');
        }
    }
}
