import {Aurelia, autoinject, computedFrom} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';

import {Api} from './api';
import {ApplicationService} from './services/application';
import {UserService} from './services/user';

import {categories} from './common';

@autoinject
export class App {
    ea: EventAggregator;
    api: Api;
    appService: ApplicationService;
    userService: UserService;
    router: Router;

    private categories;

    private showHat: boolean = false;
    private showHatLogin: boolean = false;
    private showHatRegister: boolean = false;
    private showHatSubmission: boolean = false;

    private model = {
        email: '',
        password: '',
        password2: ''
    };

    private submissionModel = {
        name: '',
        category: '',
        url: '',
        repoUrl: '',
        description: ''
    };

    private formMessage: string = '';

    @computedFrom('model.email', 'model.password')
    get loginFormIsValid() {
        return (this.model.email.trim() !== '' && this.model.password.trim() !== '');
    }

    @computedFrom('model.email', 'model.password', 'model.password2')
    get registerFormIsValid() {
        return (this.model.email.trim() !== '' && this.model.password.trim() !== '' && this.model.password2.trim() !== '' && this.passwordsMatch);
    }

    @computedFrom('submissionModel.name', 'submissionModel.category', 'submissionModel.url', 'submissionModel.repoUrl', 'submissionModel.description')
    get submissionFormIsValid() {
        var isValid = true;

        for (let key in this.submissionModel) {
            let field = this.submissionModel[key];

            if (key !== 'url' || key !== 'repoUrl') {
                if (field.trim() === '') {
                    isValid = false;
                }
            }
        }

        if (this.submissionModel.url.trim() === '' && this.submissionModel.repoUrl.trim() === '') {
            isValid = false;
        }

        return isValid;
    }

    @computedFrom('model.password', 'model.password2')
    get passwordsMatch() {
        return (this.model.password.trim() === this.model.password2.trim());
    }

    constructor(api: Api, appService: ApplicationService, userService: UserService, ea: EventAggregator) {
        this.api = api;
        this.appService = appService;
        this.userService = userService;
        this.ea = ea;

        this.categories = categories;
    }

    attached() {
        this.ea.subscribe('show.login-form', () => {
            this.login();
        });
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

    closeHat() {
        this.showHat = false;
        this.showHatLogin = false;
        this.showHatRegister = false;
        this.showHatSubmission = false;
    }

    login($event?: Event) {
        this.model.email = '';
        this.model.password = '';

        this.showHat = true;
        this.showHatRegister = false;
        this.showHatLogin = true;
    }

    logout($event?: Event) {
        this.userService.logout();
        window.location.reload();
    }

    register($event?: Event) {
        this.model.email = '';
        this.model.password = '';
        this.model.password2 = '';

        this.showHat = true;
        this.showHatLogin = false;
        this.showHatRegister = true;
    }

    submission($event?: Event) {
        this.submissionModel.name = '';
        this.submissionModel.category = '';

        this.showHat = true;
        this.showHatLogin = false;
        this.showHatRegister = false;
        this.showHatSubmission = true;
    }

    handleLogin($event?) {
        if (this.loginFormIsValid) {
            this.formMessage = '';
             
            this.userService.login(this.model.email, this.model.password)
                .then(() => {
                    this.showHat = false;
                    this.showHatRegister = false;
                    this.showHatLogin = false;

                    window.location.reload();
                })
                .catch(e => {
                    if (e.code === 'auth/user-not-found') {
                        this.formMessage = 'Ow, there was a problem :(<br>Please make sure you have entered a valid email address and password, then try again.';
                    }
                })
        }
    }

    handleRegister($event?) {
        if (this.registerFormIsValid) {
            this.formMessage = '';

            this.userService.register(this.model.email, this.model.password)
                .then(() => {
                    this.showHat = false;
                    this.showHatRegister = false;
                    this.showHatLogin = true;

                    window.location.reload();
                })
                .catch(e => {
                    this.formMessage = 'Sorry :(<br>there was a problem registering. Please make sure you entered in all fields correctly or refreshing the page.';
                });
        }
    }

    handleSubmission($event?) {
        if (this.submissionFormIsValid) {
            this.formMessage = '';

            this.api.postSubmission(this.submissionModel)
                .then(() => {
                    this.showHat = false;
                    this.showHatSubmission = false;
                })
        }
    }
}
