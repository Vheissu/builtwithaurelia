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

    getProjects(maxPerPage, page) {
        return this.http.fetch('https://raw.githubusercontent.com/Vheissu/builtwithaurelia-projects/master/projects.json')
            .then(response => response.json())
            .then(projects => {
                let offset = (page * maxPerPage) - maxPerPage;

                console.log(offset);
                return maxPerPage === -1 ? projects : projects.slice(offset, offset + maxPerPage);
            });
    }

    getProject(slug) {
        let returnProject = null;

        return this.getProjects(-1, -1).then(projects => {
            projects.forEach(project => {
                if (project.slug === slug) {
                    returnProject = project;
                }
            });

            return returnProject;
        });
    }
}
