import {autoinject, bindable, customElement} from 'aurelia-framework';

import {UserService} from '../services/user';
import {ApplicationService} from '../services/application';
import {Api} from '../api';

@autoinject
@customElement('thumbnail')
export class Thumbnail {
    @bindable project;
    @bindable voteCallback;

    private api: Api;
    private appService: ApplicationService;
    private userService: UserService;

    constructor(api: Api, appService: ApplicationService, userService: UserService) {
        this.api = api;
        this.appService = appService;
        this.userService = userService;
    }

    getVoteCount(slug) {
        return this.api.getVoteCountsBySlug(slug).then(count => {
            return count || 0;
        });
    }

    handleClick(url, name) {
        if ((<any>window).clicky) {
            (<any>window).clicky.log(url, name);
        }

        return true;
    }

    callVoteCallback(evt, slug) {
        if (this.voteCallback) {
            this.voteCallback({
                evt: evt,
                slug: slug
            });
        }
    }

}
