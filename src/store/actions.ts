import { slugify } from './../common';
import firebase from '../common/firebase';

export { loadProjects } from './actions/load-projects';
export { getCategories } from './actions/get-categories';
export { sortCategories } from './actions/sort-categories';
export { loadProject } from './actions/load-project';

import { Container } from 'aurelia-dependency-injection';
import { Api } from '../services/api';

const api = Container.instance.get(Api);

export async function setSelectedProject(state, projectId) {
    return {...state, ...{ projectId }};
}

export async function setUser(state, user) {
    return {...state, ...{ user }};
}

export function setCategory(state, currentCategory) {
    return {...state, ...{ currentCategory }};
}

export function sortProjects(state, type) {
    const newState = { ...state };

    if (type === 'popular') {
        newState.projects.sort((a, b) => {
            return parseInt(b.votes, 10) - parseInt(a.votes, 10) || a.added - b.added;
        });
    } else if (type === 'new') {
        newState.projects.sort((a, b) => {
            return b.added - a.added;
        });
    }

    return newState;
}

export function backupProjects(state) {
    return {...state, ...{ backupProjects: state.projects }};
}

export function changeSortMode(state, currentSortMode) {
    return { ...state, ...{ currentSortMode }};
}

export function resetProjects(state) {
    return { ...state, ...{ projects: state.backupProjects } };
}

export async function castVote(state, name) {
    const newState = { ...state };

    let voteAction: 'add' | 'remove' = 'add';

    newState.projects = newState.projects.map(project => {
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

    await api.castVote(name, voteAction);

    return newState;
}
