import {autoinject} from 'aurelia-framework'; 
import {HttpClient} from 'aurelia-fetch-client';
import {ApplicationService} from './services/application';

@autoinject
export class Api {
    private http: HttpClient;
    private appService: ApplicationService;

    constructor(http: HttpClient, appService: ApplicationService) {
        this.http = http;
        this.appService = appService;
    }

    getProjectImage(slug) {
        this.appService.loading = true;

        return this.http.fetch(`https://raw.githubusercontent.com/Vheissu/builtwithaurelia-projects/master/images/${slug}`)
            .then(response => response.text())
            .then(image => {
                this.appService.loading = false;
                return image;
            });
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
}
