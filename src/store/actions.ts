import { slugify } from './../common';

export { loadProjects } from './actions/load-projects';
export { getCategories } from './actions/get-categories';
export { sortCategories } from './actions/sort-categories';
export { loadProject } from './actions/load-project';

import { Container } from 'aurelia-dependency-injection';
import { Api } from '../services/api';

const api = Container.instance.get(Api);

export async function setSelectedProject(state, projectId) {
    const newState = { ...state };

    newState.projectId = projectId;

    return newState;
}

export async function setUser(state, user) {
    const newState = { ...state };

    newState.user = user;

    return newState;
}

export function setCategory(state, currentCategory) {
    const newState = { ...state };

    newState.currentCategory = currentCategory;

    return newState;
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
    const newState = { ...state };

    newState.backupProjects = [...newState.projects];

    return newState;
}

export function changeSortMode(state, currentSortMode) {
    const newState = { ...state };

    newState.currentSortMode = currentSortMode;

    return newState;
}

export function resetProjects(state) {
    const newState = { ...state };

    newState.projects = newState.backupProjects;

    return newState;
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
