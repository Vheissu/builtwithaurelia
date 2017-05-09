import {autoinject} from 'aurelia-framework'; 
import {HttpClient} from 'aurelia-fetch-client';

import { ApplicationService } from './services/application';
import { UserService } from './services/user';

import {slugify} from './common';

declare let firebase;

@autoinject
export class Api {
    constructor(private http: HttpClient, private appService: ApplicationService, private userService: UserService) {

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

    getProject(slug) {
        this.appService.loading = true;

        return new Promise((resolve, reject) => {
            firebase.database().ref(`submissions/${slug}`).once('value').then(snapshot => {
                this.appService.loading = false;
                resolve(snapshot.val());  
            }, () => {
                this.appService.loading = false;
                reject();
            });
        });
    }

    getCurrentUserSubmissions() {
        this.appService.loading = true;
        
        return new Promise((resolve, reject) => {        
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    firebase.database().ref(`submissions`)
                        .orderByChild('_uid')
                        .equalTo(user.uid)
                        .once('value').then(snapshot => {
                            let submissions = snapshot.val();
                            let userSubmissions = [];

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

                            resolve(userSubmissions);
                        });
                } 
            });
        });
    }

    getSubmission(slug) {
        return new Promise((resolve, reject) => {
            firebase.database().ref(`submissions/${slug}`).once('value').then(snapshot => {
                resolve(snapshot.val());
            });
        });
    }

    castVote(name, action) {
        let slug = slugify(name);
        let uid = firebase.auth().currentUser.uid;

        if (action === 'add') {
            return firebase.database().ref(`submissions/${slug}/votes/${uid}`).set(true);
        } else {
            return firebase.database().ref(`submissions/${slug}/votes/${uid}`).set(null);
        }
    }

    addProject(project) {
        if (!project.added) {
            project.added = firebase.database.ServerValue.TIMESTAMP;
        }

        firebase.database().ref(`submissions/${slugify(project.name)}`).update(project);
    }

    postSubmission(submission) {
        return new Promise((resolve, reject) => {
            if (submission && firebase.auth().currentUser) {
                submission._uid = firebase.auth().currentUser.uid;
                submission.added = firebase.database.ServerValue.TIMESTAMP;

                firebase.database().ref(`submissions/${slugify(submission.name)}`).set(submission).then(() => { 
                    resolve(true); 
                });
            }
        });
    }
}
