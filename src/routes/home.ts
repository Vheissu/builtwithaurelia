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

    private hashString(str: string) {
        let hash = 0;

        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            hash += charCode;
        }

        return hash;
    }

    private getColourFromHashedString(str: string) {
        const colours = [
            'bg--purple',
            'bg--grapefruit',
            'bg--medium-blue',
            'bg--pink',
            'bg--brave-orange',
            'bg--green',
            'bg--pie'
        ];

        if (str) {
            const hash = this.hashString(str);
            const index = hash % colours.length;

            return colours[index];
        }

        return null;
    }
}