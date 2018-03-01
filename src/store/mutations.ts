import store from './store';

function addSubmission(state, text) {
    const newSubmission = {

    };

    const newState = {
        ...state,
        ...{
            submissions: [ ...state.submissions, newSubmission ]
        }
    };

    return newState;
}

async function loadSubmissions(state, getSubmissions) {
    const submissions = await getSubmissions();

    return {...state, ...{ submissions }};
}

store.registerAction('addSubmission', addSubmission);
store.registerAction('loadSubmissions', loadSubmissions);

export {
    addSubmission,
    loadSubmissions
};
