import { autoinject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import { Store } from 'aurelia-store';

import { State } from '../store/state';
import { loadProject, saveProject, loadProjects, getCategories } from '../store/actions';
import { Api } from '../services/api';

@autoinject
export class View {
    private state: State;

    private slug: string;
    private project;
    private projectAdded;

    constructor(private api: Api, private store: Store<State>) {
        this.store.state.subscribe((state: State) => this.state = state);
    }

    async canActivate(params) {
        await this.store.dispatch(getCategories);
        await this.store.dispatch(loadProjects);

        return new Promise((resolve, reject) => {
            const project: any = this.state.projects.reduce((project, currentItem) => {
                if (currentItem.slug === params.slug) {
                    project = currentItem;
                }

                return project;
            }, {});

            if (!project) {
                reject(false);
            }

            this.project = project;
            this.projectAdded = new Date(project.added).toDateString();

            resolve(true);
        });
    }
}
