import {Aurelia} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Built With Aurelia';

    config.map([
        { 
          route: 'page/:page', 
          moduleId: './home',
          name: 'home',        
          nav: false, 
          title: 'Home'
        },
        {
          route: '', 
          moduleId: './home',
          name: 'home_nopagination',        
          nav: true, 
          title: 'Home'
        },
        { 
          route: 'view/:slug',
          moduleId: './view', 
          name: 'view',          
          nav: false, 
          title: 'View'
        },
        { 
          route: 'submission',
          moduleId: './submission', 
          name: 'submission',    
          nav: true, 
          title: 'Submission'
        }
    ]);

    this.router = router;
  }
}
