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

    paginate(page, maxPerPage, items) {
        let offset = (page - 1) * maxPerPage;
        let totalPages = Math.ceil(items.length / maxPerPage);

        return {
            items: (maxPerPage === -1) ? items : items.slice(offset, offset + maxPerPage),
            pages: totalPages
        };
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
