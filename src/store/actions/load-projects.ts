import firebase from '../../common/firebase';

export async function loadProjects(state, getProjects) {
    let fetchedProjects = await getProjects();
    let projects = [];

    const categories = Object.assign({}, state.categories);

    for (let k in fetchedProjects) {
        let project = fetchedProjects[ k ];

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

    return { ...state, ...{ projects, categories } };
}
