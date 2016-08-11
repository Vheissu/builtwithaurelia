import {autoinject} from 'aurelia-framework'; 
import {HttpClient} from 'aurelia-fetch-client';
import {ApplicationService} from './services/application';

import {slugify} from './common';

declare var firebase;

@autoinject
export class Api {
    private http: HttpClient;
    private appService: ApplicationService;

    constructor(http: HttpClient, appService: ApplicationService) {
        this.http = http;
        this.appService = appService;
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
}
