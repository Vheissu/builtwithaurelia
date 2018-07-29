import { categories as cats } from '../../common';
import { Api } from '../../services/api';
import firebase from '../../common/firebase';

import { Container } from 'aurelia-dependency-injection';

const API: Api = Container.instance.get(Api);

export async function loadProjects(state) {
    const newState = {...state};
    const fetchedProjects = await API.getProjectsFromFirebase();
    const projects = [];
    const categories = [...cats];

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

    projects.sort((a, b) => parseInt(b.votes, 10) - parseInt(a.votes, 10) || a.added - b.added);

    if (projects.length) {
        categories.map(category => {
            const {name, value: slug} = category;
            
            projects.forEach(project => {
                if (project.category === slug) {
                    category.count += 1;
                }
            });

            return category;
        });

        categories[0].count = projects.length;
    }

    newState.projects = projects;
    newState.categories = categories;

    return newState;
}
