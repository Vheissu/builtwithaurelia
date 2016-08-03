import {autoinject} from 'aurelia-framework'; 
import {HttpClient} from 'aurelia-fetch-client';

@autoinject
export class Api {
    http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    getProjectImage(slug) {
        return this.http.fetch(`https://raw.githubusercontent.com/Vheissu/builtwithaurelia-projects/master/images/${slug}`)
            .then(response => response.text())
            .then(image => {
                return image;
            });
    }

    getProjects() {
        return this.http.fetch('https://raw.githubusercontent.com/Vheissu/builtwithaurelia-projects/master/projects.json')
            .then(response => response.json())
            .then(projects => {
                return projects;
            });
    }

    getProject(slug) {
        let returnProject = null;

        return this.getProjects().then(projects => {
            projects.forEach(project => {
                if (project.slug === slug) {
                    returnProject = project;
                }
            });

            return returnProject;
        });
    }
}
