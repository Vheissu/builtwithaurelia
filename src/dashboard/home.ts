import { SubmissionInterface } from '../interfaces';

import {autoinject} from 'aurelia-framework';

import {Api} from '../api';

@autoinject
export class Home {
    private submissionsQueue: SubmissionInterface[] = [];

    constructor(private api: Api) {

    }

    activate() {
        this.api.getCurrentUserSubmissions().then(submissions => {
            this.submissionsQueue = submissions.filter(item => item.status === 'moderation-queue');
        });
    }
}