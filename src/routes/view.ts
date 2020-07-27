import { IRouteableComponent } from '@aurelia/router';

export class View implements IRouteableComponent {
    static parameters = ['slug'];

    private submission;

    public async enter(parameters: { slug: string }): Promise<void> {

    }
}