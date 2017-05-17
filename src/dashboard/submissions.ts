import { autoinject } from 'aurelia-dependency-injection';
import { TaskQueue } from 'aurelia-task-queue';
import { Api } from '../api';

import {SubmissionInterface} from '../interfaces';

declare var firebase;

@autoinject
export class Submissions {

    private submissions: any[] = [];
    private submission: any = null;
    private editMode: boolean = false;

    constructor(private api: Api) {

    }

    determineActivationStrategy() {
        return 'replace';
    }

    canActivate() {
        return this.api.getCurrentUserSubmissions()
            .then((submissions: SubmissionInterface[]) => {
                this.submissions = submissions;
                return true;
        });
    }

    async activate(params) {
        if (params.key !== undefined) {
            this.editMode = true;

            await this.api.getSubmission(params.key)
                .then((submission: SubmissionInterface) => this.submission = submission);
            console.log(this.submission);
        }
    }

    cancelEdit() {
        this.editMode = false;
    }

    saveSubmission() {

    }

}
