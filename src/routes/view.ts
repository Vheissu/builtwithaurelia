import '../styles/view.scss';

import { autoinject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import { Store, connectTo } from 'aurelia-store';

import { State } from '../store/state';
import { loadProject, loadProjects, getCategories } from '../store/actions';
import { Api } from '../services/api';

@connectTo()
@autoinject
export class View {
    private state: State;

    private slug: string;
    private project;
    private projectAdded;

    constructor(private api: Api, private store: Store<State>) {

    }

    async canActivate(params) {
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
