import {SubmissionInterface} from '../../common/interfaces';

import {autoinject} from 'aurelia-framework';
import {Api} from '../../api';
import {ApplicationService} from '../../services/application';
import {UserService} from '../../services/user';

declare let firebase: any;

@autoinject
export class ModerateSubmissions {
    private moderateSubmissions: SubmissionInterface[] = [];

    constructor(
        private api: Api,
        private appService: ApplicationService,
        private userService: UserService) {

    }

    activate() {
        return new Promise((resolve, reject) => {
            this.api.getUnmoderatedProjectsFromFirebase().then(projects => {
                for (let key in projects) {
                    let project: SubmissionInterface = projects[key];

                    project.key = key;

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

                    this.moderateSubmissions.push(project);
                }

                resolve(true);
            });
        });
    }

    approveSubmission(key, index: number) {
        this.api.approveSubmission(key).then(() => {
            this.moderateSubmissions.splice(index, 1);
        });
    }

    rejectSubmission(key, index: number) {
        this.api.rejectSubmission(key).then(() => {
            this.moderateSubmissions.splice(index, 1);
        });
    }

    deleteSubmission(key, index: number) {
        this.api.deleteSubmission(key).then(() => {
            this.moderateSubmissions.splice(index, 1);
        });
    }

}
