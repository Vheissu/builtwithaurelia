import { autoinject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';

import { Api } from '../api';

@autoinject
export class View {
  private slug: string;
  private project;
  private projectAdded;

  constructor(private api: Api) {

  }

  canActivate(params) {
    return new Promise((resolve, reject) => {
      if (params && params.slug) {
        this.slug = params.slug;

        this.api.getProject(params.slug)
          .then((project: any) => {
            this.project = project;

            this.projectAdded = new Date(project.added).toDateString();

            resolve(true);
          });
      }
    });
  }
}
