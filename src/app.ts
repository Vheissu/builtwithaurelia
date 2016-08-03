import {Aurelia} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Built With Aurelia';

    config.map([
        { 
          route: ['', 'page/:page'], 
          name: 'home',        
          nav: true, 
          title: 'Home',
          viewPorts: {
              default: { moduleId: './home' },
              sidebar: { moduleId: './home-sidebar' }
          } 
        },
        { 
          route: 'view/:slug', 
          name: 'view',          
          nav: false, 
          title: 'View',
          viewPorts: {
              default: { moduleId: './view' },
              sidebar: { moduleId: './home-sidebar' }
          }  
        },
        { 
          route: 'submission', 
          name: 'submission',    
          nav: true, 
          title: 'Submission',
          viewPorts: {
              default: { moduleId: './submission' },
              sidebar: { moduleId: './home-sidebar' }
          }   
        }
    ]);

    this.router = router;
  }
}
