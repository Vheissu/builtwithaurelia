import {RouterConfiguration, Router} from 'aurelia-router';

export class Admin {
    private router: Router;

    configureRouter(config: RouterConfiguration, router: Router) {
        config.map([
            { 
                route: '', 
                moduleId: './admin',
                name: 'admin',        
                nav: false, 
                title: 'Admin'
            }
        ]);

        this.router = router;
    }
}