import {Aurelia, autoinject, computedFrom, observable} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';

import {Api} from './api';
import {ApplicationService} from './services/application';
import {UserService} from './services/user';

import {categories, scrollTop, isEmpty, notEmpty, stringInObject, isUrl, requiredField, equals} from './common';

@autoinject
export class App {
    ea: EventAggregator;
    api: Api;
    appService: ApplicationService;
    userService: UserService;
    router: Router;

    public categories;

    @observable showHat: boolean = false;
    private showHatLogin: boolean = false;
    private showHatRegister: boolean = false;
    private showHatSubmission: boolean = false;

    private model = {
        email: '',
        password: '',
        password2: '',
        name: '',
        category: 'website',
        url: '',
        repoUrl: '',
        description: '',
        twitterHandle: ''
    };

    private disableButtons: boolean = false;

    private formMessage: string = '';
    private validationErrors: any = {};

    @computedFrom('model.email', 'model.password')
    get loginFormIsValid() {
        return (notEmpty(this.model.email) && notEmpty(this.model.password));
    }

    @computedFrom('model.email', 'model.password', 'model.password2')
    get registerFormIsValid() {
        return (notEmpty(this.model.email) && notEmpty(this.model.password) && notEmpty(this.model.password2) && this.passwordsMatch);
    }

    @computedFrom('model.name', 'model.category', 'model.url', 'model.repoUrl', 'model.description', 'model.twitterHandle')
    get submissionFormIsValid() {
        var isValid = true;

        if (isEmpty(this.model.name) || isEmpty(this.model.category) || isEmpty(this.model.description)) {
            isValid = false;
        }

        if (notEmpty(this.model.url) && !isUrl(this.model.url)) {
            isValid = false;
        }

        if (notEmpty(this.model.repoUrl) && !isUrl(this.model.repoUrl)) {
            isValid = false;
        }

        if (notEmpty(this.model.twitterHandle) && this.model.twitterHandle.charAt(0) === '@') {
            this.model.twitterHandle.substring(1);
        }

        if (isEmpty(this.model.url) && isEmpty(this.model.repoUrl)) {
            isValid = false;
        }

        return isValid;
    }

    @computedFrom('model.password', 'model.password2')
    get passwordsMatch() {
        return ( (notEmpty(this.model.password) && notEmpty(this.model.password2)) && (equals(this.model.password.trim(), this.model.password2.trim())));
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
        this.formMessage = '';
        this.showHat = false;
        this.showHatLogin = false;
        this.showHatRegister = false;
        this.showHatSubmission = false;
    }

    login($event?: Event) {
        this.formMessage = '';
        this.model.email = '';
        this.model.password = '';

        this.showHat = true;
        this.showHatRegister = false;
        this.showHatLogin = true;
    }

    logout($event?: Event) {
        this.formMessage = '';
        this.userService.logout();
        window.location.reload();
    }

    register($event?: Event) {
        this.formMessage = '';
        this.model.email = '';
        this.model.password = '';
        this.model.password2 = '';

        this.showHat = true;
        this.showHatLogin = false;
        this.showHatRegister = true;
    }

    submission($event?: Event) {
        this.model.name = '';
        this.formMessage = '';

        this.showHat = true;

        if (this.userService.isLoggedIn) {
            this.showHatLogin = false;
            this.showHatRegister = false;
            this.showHatSubmission = true;
        } else {
            this.showHatLogin = true;
            this.formMessage = 'You need to be logged in to make a new submission.';
        }
    }

    handleLogin($event?) {
        if (this.loginFormIsValid) {
            this.formMessage = '';
            this.disableButtons = true;
             
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
            this.disableButtons = true;

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
            this.disableButtons = true;

            let submissionObject: any = {
                name: this.model.name,
                category: this.model.category,
                description: this.model.description
            };

            if (notEmpty(this.model.url)) {
                submissionObject.url = this.model.url;
            }

            if (notEmpty(this.model.repoUrl)) {
                submissionObject.repoUrl = this.model.repoUrl;
            }

            if (notEmpty(this.model.twitterHandle)) {
                submissionObject.twitterHandle = this.model.twitterHandle;
            }

            this.api.postSubmission(submissionObject)
                .then(() => {
                    window.alert('Your submission has been received, thank you');
                    this.disableButtons = false;
                    this.showHat = false;
                    this.showHatSubmission = false;
                });
        }
    }

    showHatChanged(bool: boolean) {
        if (bool) {
            scrollTop();
        }
    }
}
