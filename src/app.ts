import {Aurelia, autoinject} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';

import {ApplicationService} from './services/application';
import {UserService} from './services/user';

@autoinject
export class App {
    ea: EventAggregator;
    appService: ApplicationService;
    userService: UserService;
    router: Router;

    private showHat: boolean = false;
    private showHatLogin: boolean = false;
    private showHatRegister: boolean = false;

    private model = {
        email: '',
        password: ''
    };

    constructor(appService: ApplicationService, userService: UserService, ea: EventAggregator) {
        this.appService = appService;
        this.userService = userService;
        this.ea = ea;
    }

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
                route: 'about',
                moduleId: './about', 
                name: 'about',    
                nav: true, 
                title: 'About'
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

    login($event: Event) {
        this.showHat = true;
        this.showHatRegister = false;
        this.showHatLogin = true;
    }

    logout($event: Event) {
        alert('Goodbye');
    }

    register($event: Event) {
        this.showHat = true;
        this.showHatLogin = false;
        this.showHatRegister = true;
    }
}
