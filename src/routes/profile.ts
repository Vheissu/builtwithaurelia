import { IRouteableComponent } from '@aurelia/router';

export class Profile implements IRouteableComponent {
    static parameters = ['id'];

    private user;

    public async enter(params: { id: string }): Promise<void> {

    }
}