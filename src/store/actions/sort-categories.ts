export function sortCategories(state, category) {
    let newState = { ...state };

    // If we are not wanting to show everything
    if (category.value !== '') {
        newState.projects = state.backupProjects.filter(project => {
            return project.category === category.value;
        });
    } else {
        newState = { ...newState, ...{ projects: state.backupProjects } };
    }

    return { ...state, ...newState };
}
