import {computedFrom, observable} from 'aurelia-framework';

export class Submission {
  canActivate(params) {
    if (params && params.slug) {
      this.slug = params.slug;
    }
  }
}
