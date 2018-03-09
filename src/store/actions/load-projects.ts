import { categories } from './../../common';
import { Api } from './../../services/api';
import firebase from '../../common/firebase';
import { Container } from 'aurelia-dependency-injection';
import { Store } from 'aurelia-store';

const API: Api = Container.instance.get(Api);

export async function loadProjects(state) {
    const fetchedProjects = await API.getProjectsFromFirebase();
    const projects = [];
    const categories = {...state.categories};

    for (let k in fetchedProjects) {
        const project = fetchedProjects[ k ];

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

        project.slug = k;

        projects.push(project);
    }

    projects.sort((a, b) => {
        return parseInt(b.votes, 10) - parseInt(a.votes, 10) || a.added - b.added;
    });

    if (projects.length) {
        for (let i = 0; i < projects.length; i++) {
            let item = projects[ i ];

            if (item && item.category) {
                let navItem = categories[ item.category ];

                if (navItem) {
                    navItem.count += 1;
                }
            }
        }

        categories.all.count = projects.length;
    }

    Object.keys(categories).map((k, i) => {
        if (!categories[k].count) {
            delete categories[k];
        }
    });

    return { ...state, ...{ projects, categories } };
}
