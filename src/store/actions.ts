import firebase from '../common/firebase';

export { loadProjects } from './actions/load-projects';
export { getCategories } from './actions/get-categories';
export { sortCategories } from './actions/sort-categories';
export { loadProject } from './actions/load-project';

export async function setSelectedProject(state, projectId) {
    return {...state, ...{ projectId }};
}

export async function setUser(state, user) {
    return {...state, ...{ user }};
}

export function setCategory(state, category) {
    return {...state, ...{ currentCategory: category }};
}

export function backupProjects(state) {
    return {...state, ...{ backupProjects: state.projects }};
}

export function resetProjects(state) {
    return { ...state, ...{ projects: state.backupProjects } };
}
