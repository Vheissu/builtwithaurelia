import {autoinject} from 'aurelia-framework'; 
import {HttpClient} from 'aurelia-fetch-client';
import {ApplicationService} from './services/application';

declare var firebase;

@autoinject
export class Api {
    private http: HttpClient;
    private appService: ApplicationService;

    constructor(http: HttpClient, appService: ApplicationService) {
        this.http = http;
        this.appService = appService;
    }

    getProjects() {
        this.appService.loading = true;

        return this.http.fetch('https://raw.githubusercontent.com/Vheissu/builtwithaurelia-projects/master/projects.json')
            .then(response => response.json())
            .then(projects => {
                this.appService.loading = false;
                return projects;
            });
    }

    getProject(slug) {
        this.appService.loading = true;
        let returnProject = null;

        return this.getProjects().then(projects => {
            projects.forEach(project => {
                if (project.slug === slug) {
                    returnProject = project;
                }
            });

            this.appService.loading = false;

            return returnProject;
        });
    }

    getProjectByName(name) {
        this.appService.loading = true;
        let returnProject = null;

        return this.getProjects().then(projects => {
            projects.forEach(project => {
                if (project.name === name) {
                    returnProject = project;
                }
            });

            this.appService.loading = false;

            return returnProject;
        });
    }

    getVoteCountsBySlug(slug) {
        return new Promise((resolve, reject) => {
            firebase.database().ref(`submissions/${slug}/votes`).once('value').then(snapshot => {
                resolve(snapshot.numChildren());
            });
        });
    }

    castVote(slug) {
        return firebase.database().ref(`submissions/${slug}/votes/${firebase.auth().currentUser.uid}`).push(true);
    }
}
