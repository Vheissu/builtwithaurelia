import { PLATFORM } from 'aurelia-pal';
import {RouterConfiguration, Router} from 'aurelia-router';

export class Admin {
    private router: Router;

    configureRouter(config: RouterConfiguration, router: Router) {
        config.map([
            {
                route: '',
                moduleId: PLATFORM.moduleName('./admin-home'),
                name: 'admin-home',
                nav: true,
                title: 'Home'
            },
            {
                route: 'moderate-submissions',
                moduleId: PLATFORM.moduleName('./moderate-submissions'),
                name: 'moderate-submissions',
                nav: true,
                title: 'Moderate Submissions'
            },
        ]);

        this.router = router;
    }
}
