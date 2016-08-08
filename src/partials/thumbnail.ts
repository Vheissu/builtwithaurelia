import {autoinject, bindable, customElement} from 'aurelia-framework';

@autoinject
@customElement('thumbnail')
export class Thumbnail {
    @bindable project;

    handleClick(url, name) {
        if ((<any>window).clicky) {
            (<any>window).clicky.log(url, name);
        }

        return true;
    }

}
