import {autoinject, bindable, customElement} from 'aurelia-framework';

@autoinject
@customElement('thumbnail')
export class Thumbnail {
    @bindable project;
    @bindable voteCallback;

    getVoteCount() {
        return 0;
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
