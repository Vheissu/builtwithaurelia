import { autoinject } from 'aurelia-dependency-injection';
import { TaskQueue } from 'aurelia-task-queue';
import { Api } from '../api';

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
        return this.api.getCurrentUserSubmissions().then((submissions: any[]) => {
            this.submissions = submissions;
            return true;
        });
    }

    async activate(params) {
        if (params.key !== undefined) {
            this.editMode = true;

            await this.api.getSubmission(params.key).then(submission => this.submission = submission);
        }
    }

    cancelEdit() {
        this.editMode = false;
    }

}
