import {autoinject} from 'aurelia-framework'; 
import {HttpClient} from 'aurelia-fetch-client';

import { ApplicationService } from './services/application';
import { UserService } from './services/user';

import {slugify} from './common';

declare var firebase;

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

    getCurrentUserSubmissions() {
      return new Promise((resolve, reject) => {        
        if (this.userService.isLoggedIn) {
          let currentUser = this.userService.getLoggedInUser();

          firebase.database().ref(`submissions`).once('value').then(snapshot => {
            let submissions = snapshot.val();
            let userSubmissions = [];

            if (submissions && currentUser) {
              for (let key in submissions) {
                if (submissions.hasOwnProperty(key)) {
                  let submission = submissions[key];
                  submission.objectKey = key;
                  
                  if (submission._uid === currentUser.uid) {
                    userSubmissions.push(submission);
                  }
                }
              }
            }

            resolve(userSubmissions);
          }); 
        }
      });
    }

    castVote(name, action) {
        let slug = slugify(name);
        
        if (action === 'add') {
            return firebase.database().ref(`submissions/${slug}/votes/${firebase.auth().currentUser.uid}`).set(true);
        } else {
            return firebase.database().ref(`submissions/${slug}/votes/${firebase.auth().currentUser.uid}`).set(null);
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
