import { Api } from './../services/api';
import { IRouteableComponent } from '@aurelia/router';

export class Home implements IRouteableComponent {
    private submissions: unknown[] = [];

    constructor(private api: Api) {

    }

    public async enter(): Promise<void> {
        this.submissions = await this.api.loadSubmissions();

        console.log(this.submissions);
    }
}