import { Auth } from './../common/auth';
import { IRouteableComponent } from '@aurelia/router';
import { customElement } from 'aurelia';

@customElement({name: 'logout', template: ''})
export class Logout implements IRouteableComponent {
    constructor(private auth: Auth) {

    }

    public async canEnter(): Promise<boolean> {
        this.auth.signOut();

        return false;
    }
}