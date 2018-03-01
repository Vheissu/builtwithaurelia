import { autoinject } from 'aurelia-dependency-injection';
import { TaskQueue } from 'aurelia-task-queue';
import { computedFrom } from 'aurelia-framework';
import { Api } from '../../api';

import {SubmissionInterface} from '../../interfaces';
import {categories, scrollTop, isEmpty, notEmpty, stringInObject, isUrl, requiredField, equals} from '../../common';

declare var firebase;

@autoinject
export class Submissions {

    private submissions: SubmissionInterface[] = [];
    private submission: SubmissionInterface = null;
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

    @computedFrom('submission.name', 'submission.category', 'submission.url', 'submission.repoUrl', 'submission.description', 'submission.twitterHandle')
    get submissionFormIsValid() {
        var isValid = true;

        if (isEmpty(this.submission.name) || isEmpty(this.submission.category) || isEmpty(this.submission.description)) {
            isValid = false;
        }

        if (notEmpty(this.submission.url) && !isUrl(this.submission.url)) {
            isValid = false;
        }

        if (notEmpty(this.submission.repoUrl) && !isUrl(this.submission.repoUrl)) {
            isValid = false;
        }

        if (notEmpty(this.submission.twitterHandle) && this.submission.twitterHandle.charAt(0) === '@') {
            this.submission.twitterHandle.substring(1);
        }

        if (isEmpty(this.submission.url) && isEmpty(this.submission.repoUrl)) {
            isValid = false;
        }

        return isValid;
    }

}
