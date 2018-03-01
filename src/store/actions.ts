import store from './store';

import { ADD_SUBMISSION } from './constants';
import * as Mutations from './mutations';

function addSubmission(submission) {
    store.dispatch(Mutations.addSubmission, submission);
}

function loadSubmissions() {
    store.dispatch(Mutations.loadSubmissions);
}

export {
    addSubmission,
    loadSubmissions
};
