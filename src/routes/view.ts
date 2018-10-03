import 'assets/styles/view.scss';

import { PLATFORM } from 'aurelia-pal';
import { autoinject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import { Store } from 'aurelia-store';

import { State, initialState as clientInitialState } from '../store/state';
import { loadProject, loadProjects, getCategories } from '../store/actions';
import { Api } from '../services/api';

let initialState: State;

if (PLATFORM.global.__PRELOADED_STATE__) {
    initialState = Object.assign({}, PLATFORM.global.__PRELOADED_STATE__, clientInitialState);
}

@autoinject()
export class View {
    private state: State = initialState;

    private slug: string;
    private project;
    private projectAdded;

    constructor(private api: Api, private store: Store<State>) {
        this.store.state.subscribe(
            (state: State) => this.state = state
        );
    }

    async canActivate(params, routeConfig) {
        await this.store.dispatch(getCategories);
        await this.store.dispatch(loadProjects);

        const project: any = this.state.projects.reduce((project, currentItem) => {
            if (currentItem.slug === params.slug) {
                project = currentItem;
            }

            return project;
        }, {});

        if (!project.slug) {
            return new Redirect('');
        }

        routeConfig.navModel.setTitle(project.name);

        this.project = project;
        this.projectAdded = new Date(project.added).toDateString();
    }
}

export class ProcessTwitterHandleValueConverter {
    toView(value) {
        const handle = value.replace('@', '').toLowerCase();
        const twitterUrl = `https://twitter.com/${handle}`;

        return value ? twitterUrl : value;
    }
}
