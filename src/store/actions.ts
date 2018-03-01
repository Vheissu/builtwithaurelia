import firebase from '../firebase';

export async function saveProject(state, project) {
    return;
}

export async function setSelectedProject(state, projectId) {
    return {...state, ...{ projectId }};
}

export async function setUser(state, user) {
    return {...state, ...{ user }};
}

export async function loadProjects(state, getProjects) {
    let fetchedProjects = await getProjects();
    let projects = [];

    const categories = Object.assign({}, state.categories);

    for (let k in fetchedProjects) {
        let project = fetchedProjects[k];

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

        projects.push(project);
    }

    projects.sort((a, b) => {
        return parseInt(b.votes, 10) - parseInt(a.votes, 10) || a.added - b.added;
    });

    if (projects.length) {
        for (let i = 0; i < projects.length; i++) {
            let item = projects[i];

            if (item && item.category) {
                let navItem = categories[item.category];

                if (navItem) {
                    navItem.count += 1;
                }
            }
        }

        categories.all.count = projects.length;
    }

    return {...state, ...{ projects, categories }};
}

export function getCategories(state) {
    const categories = {
        all: { name: 'All', value: '', count: 0 },
        mobile: { name: 'Mobile', value: 'mobile', count: 0 },
        plugin: { name: 'Plugins', value: 'plugin', count: 0 },
        theme: { name: 'Themes', value: 'theme', count: 0 },
        website: { name: 'Websites', value: 'website', count: 0 }
    };

    const currentCategory = categories.all;

    return { ...state, ...{ categories, currentCategory } };
}

export function setCategory(state, category) {
    return {...state, ...{ currentCategory: category }};
}

export function backupProjects(state) {
    return {...state, ...{ backupProjects: state.projects }};
}

export function sortCategories(state, category) {
    let newState = {...state};

    // If we are not wanting to show everything
    if (category.value !== '') {
        newState.projects = state.backupProjects.filter(project => {
            return project.category === category.value;
        });
    } else {
        newState = {...newState, ...{ projects: state.backupProjects }};
    }

    return {...state, ...newState};
}

export function resetProjects(state) {
    return { ...state, ...{ projects: state.backupProjects } };
}
