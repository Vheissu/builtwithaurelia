import {RouterConfiguration, Router} from 'aurelia-router';

export class Admin {
    private router: Router;

    configureRouter(config: RouterConfiguration, router: Router) {
        config.map([
            { 
                route: '', 
                moduleId: './admin-home',
                name: 'admin-home',        
                nav: false, 
                title: 'Admin'
            },
            { 
                route: 'moderate-submissions', 
                moduleId: './moderate-submissions',
                name: 'moderate-submissions',        
                nav: false, 
                title: 'Moderate Submissions'
            },
        ]);

        this.router = router;
    }
}