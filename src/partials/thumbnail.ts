import {autoinject, bindable, customElement} from 'aurelia-framework';

import {UserService} from '../services/user';

@autoinject
@customElement('thumbnail')
export class Thumbnail {
    @bindable project;
    @bindable voteCallback;

    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    handleClick(url, name) {
        if ((<any>window).clicky) {
            (<any>window).clicky.log(url, name);
        }

        return true;
    }

    callVoteCallback(evt, name) {
        if (this.voteCallback) {
            this.voteCallback({
                evt: evt,
                name: name
            });
        }
    }

}
