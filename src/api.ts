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
                let returned = {projects: null, totalPages: 0};

                let offset = (page - 1) * maxPerPage;
                let totalPages = Math.ceil(projects.length / maxPerPage);

                returned.totalPages = totalPages;

                if (maxPerPage === -1) {
                    returned.projects = projects;
                } else {
                    returned.projects = projects.slice(offset, offset + maxPerPage);
                }

                return returned;
            });
    }

    getProject(slug) {
        let returnProject = null;

        return this.getProjects(-1, -1).then(projects => {
            projects.projects.forEach(project => {
                if (project.slug === slug) {
                    returnProject = project;
                }
            });

            return returnProject;
        });
    }
}
