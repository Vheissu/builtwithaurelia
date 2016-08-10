import {autoinject, bindable, customElement} from 'aurelia-framework';

@autoinject
@customElement('thumbnail')
export class Thumbnail {
    @bindable project;
    @bindable voteCallback;

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
