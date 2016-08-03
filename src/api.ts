import {autoinject} from 'aurelia-framework'; 
import {HttpClient} from 'aurelia-fetch-client';

@autoinject
export class Api {
    http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    getProjects() {
        return this.http.fetch('https://raw.githubusercontent.com/Vheissu/builtwithaurelia-projects/master/projects.json')
            .then(response => response.json())
            .then(projects => {
                return projects;
            });
    }
}
