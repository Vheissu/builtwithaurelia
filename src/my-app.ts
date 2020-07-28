import { Auth } from './common/auth';
import { IRouter } from '@aurelia/router';
import { IViewModel } from 'aurelia';

export class MyApp implements IViewModel {
    constructor(@IRouter private router: IRouter, private auth: Auth) {

    }

    public async beforeBind(): Promise<void> {
        // TODO: We'll handle authentication checks here later
        this.router.addHook((instructions) => {
            return instructions;
        }, { exclude: ['login', 'logout', 'home'] });
    }
}
