import {RouterConfiguration, Router} from 'aurelia-router';

export class Admin {
    private router: Router;

    configureRouter(config: RouterConfiguration, router: Router) {
        config.map([
            { 
                route: '', 
                moduleId: './admin-home',
                name: 'admin-home',        
                nav: true, 
                title: 'Home'
            },
            { 
                route: 'moderate-submissions', 
                moduleId: './moderate-submissions',
                name: 'moderate-submissions',        
                nav: true, 
                title: 'Moderate Submissions'
            },
        ]);

        this.router = router;
    }
}