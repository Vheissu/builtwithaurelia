import {Aurelia} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Built With Aurelia';

    config.map([
        { 
          route: ['', 'home'], 
          name: 'home',      
          moduleId: './home',      
          nav: true, 
          title: 'Home' 
        },
        { 
          route: 'view/:slug', 
          name: 'view',      
          moduleId: './view',      
          nav: false, 
          title: 'View' 
        }
    ]);

    this.router = router;
  }
}
