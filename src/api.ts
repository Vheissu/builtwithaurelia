import {autoinject} from 'aurelia-framework'; 
import {HttpClient} from 'aurelia-fetch-client';

import { ApplicationService } from './services/application';
import { UserService } from './services/user';

import {slugify} from './common';

import {SubmissionInterface} from './interfaces';

declare let firebase;

@autoinject
export class Api {
    constructor(
        private http: HttpClient, 
        private appService: ApplicationService, 
        private userService: UserService) {

    }

    getProjectsFromFirebase() {
        this.appService.loading = true;

        return new Promise((resolve, reject) => {
            firebase.database().ref('submissions').once('value').then(snapshot => {
                this.appService.loading = false;
                resolve(snapshot.val());
            }, () => {
                this.appService.loading = false;
            });
        });
    }

    getUnmoderatedProjectsFromFirebase() {
        this.appService.loading = true;

        return new Promise((resolve, reject) => {
            firebase.database().ref('submissions')
                .orderByChild('status')
                .equalTo('moderation-queue')
                .once('value')
                .then(snapshot => {
                    this.appService.loading = false;
                    resolve(snapshot.val());
            }, () => {
                this.appService.loading = false;
            });
        });
    }

    getProject(slug): Promise<SubmissionInterface> {
        this.appService.loading = true;

        return new Promise((resolve, reject) => {
            firebase.database().ref(`submissions/${slug}`).once('value').then(snapshot => {
                this.appService.loading = false;
                resolve(snapshot.val() as SubmissionInterface);  
            }, () => {
                this.appService.loading = false;
                reject();
            });
        });
    }

    getCurrentUserSubmissions(): Promise<SubmissionInterface[]> {
        this.appService.loading = true;
        
        return new Promise((resolve, reject) => {        
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    firebase.database().ref(`submissions`)
                        .orderByChild('_uid')
                        .equalTo(user.uid)
                        .once('value').then(snapshot => {
                            let submissions = snapshot.val();
                            let userSubmissions: SubmissionInterface[] = [];

                            if (submissions) {
                                for (let key in submissions) {
                                    if (submissions.hasOwnProperty(key)) {
                                        let submission = submissions[key];
                                        submission.objectKey = key;

                                        if (submission._uid === user.uid) {
                                            userSubmissions.push(submission);
                                        }
                                    }
                                }
                            }

                            this.appService.loading = false;

                            resolve(userSubmissions as SubmissionInterface[]);
                        });
                } 
            });
        });
    }

    getSubmission(slug: string): Promise<SubmissionInterface> {
        return new Promise((resolve, reject) => {
            firebase.database().ref(`submissions/${slug}`).once('value').then(snapshot => {
                resolve(snapshot.val() as SubmissionInterface);
            });
        });
    }

    castVote(name: string, action: 'add' | 'remove') {
        let slug = slugify(name);
        let uid = firebase.auth().currentUser.uid;

        if (action === 'add') {
            return firebase.database().ref(`submissions/${slug}/votes/${uid}`).set(true);
        } else {
            return firebase.database().ref(`submissions/${slug}/votes/${uid}`).set(null);
        }
    }

    addProject(project: SubmissionInterface) {
        return new Promise((resolve, reject) => {
            if (!project.added) {
                project.added = firebase.database.ServerValue.TIMESTAMP;
            }

            firebase.database().ref(`submissions/${slugify(project.name)}`)
                .update(project)
                .then(resolve(true));
        });
    }

    postSubmission(submission: SubmissionInterface) {
        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    submission._uid = user.uid;
                    submission.added = firebase.database.ServerValue.TIMESTAMP;

                    firebase.database().ref(`submissions/${slugify(submission.name)}`).set(submission).then(() => { 
                        resolve(true); 
                    });
                } else {
                    reject(false);
                }
            });
        });
    }

    approveSubmission(key: string) {
        return firebase.database().ref('submissions').child(key).update({status: 'published'});
    }

    rejectSubmission(key) {
        return firebase.database().ref('submissions').child(key).update({status: 'rejected'});
    }

    deleteSubmission(key) {
        let data = {};
        data[`/submissions/${key}`] = null;

        return firebase.database().ref().set(data);
    }
}
