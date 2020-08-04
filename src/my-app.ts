import { Auth } from './common/auth';
import { IRouter } from '@aurelia/router';
import { IViewModel } from 'aurelia';

export class MyApp implements IViewModel {
    constructor(@IRouter private router: IRouter, private auth: Auth) {

    }

    public async beforeBind(): Promise<void> {
        // TODO: We'll handle authentication checks here later
        this.router.addHook((instructions) => {
            if (this.auth.isSignedIn) {
                return true;
            }
    
            // User is not logged in, so redirect them back to login page
            return [this.router.createViewportInstruction('home', instructions[0].viewport)];
        }, { exclude: ['login', 'logout', 'home'] });
    }

    public afterAttach() {
        document.querySelector('[data-toggle="offcanvas"]').addEventListener('click', function () {
            document.querySelector('.offcanvas-collapse').classList.toggle('open')
        });
    }
}
