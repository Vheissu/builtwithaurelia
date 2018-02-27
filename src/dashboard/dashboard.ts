import {RouterConfiguration, Router} from 'aurelia-router';

export class Dashboard {
    private router: Router;

    configureRouter(config: RouterConfiguration, router: Router) {
        config.map([
            { route: '', name: 'dashboard', moduleId: './home', title: 'Dashboard', nav: true },
            { route: 'submissions', name: 'submissions', moduleId: './submissions', title: 'Your Submissions', nav: true }
        ]);
        
        this.router = router;
    }
}
