import { Aurelia, autoinject, computedFrom, observable } from 'aurelia-framework';
import { Router, RouterConfiguration, Redirect } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { PLATFORM } from 'aurelia-pal';

import { SubmissionInterface } from './interfaces';

import { Api } from './api';
import { ApplicationService } from './services/application';
import { UserService } from './services/user';

import { categories, scrollTop, isEmpty, notEmpty, stringInObject, isUrl, requiredField, equals } from './common';

import firebase from './firebase';

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

    constructor(api: Api, appService: ApplicationService, userService: UserService, ea: EventAggregator) {
        this.api = api;
        this.appService = appService;
        this.userService = userService;
        this.ea = ea;

        this.categories = categories;
    }

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
        return ((notEmpty(this.model.password) && notEmpty(this.model.password2)) && (equals(this.model.password.trim(), this.model.password2.trim())));
    }

    attached() {
        this.ea.subscribe('show.login-form', () => {
            this.login();
        });

        this.ea.subscribe('submission', () => {
            this.submission();
        });
    }

    configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'Built With Aurelia';
        config.options.pushState = true;
        config.options.root = '/';

        config.map([
            { 
                route: '', 
                moduleId: PLATFORM.moduleName('./home'),
                name: 'home',        
                nav: false, 
                title: 'Home'
            },
            { 
                route: 'about',
                moduleId: PLATFORM.moduleName('./about'), 
                name: 'about',    
                nav: true, 
                title: 'About'
            },
            {
                route: 'dashboard',
                moduleId: PLATFORM.moduleName('./dashboard/dashboard'),
                name: 'dashboard',
                nav: true,
                auth: true,
                title: 'Dashboard'
            },
            {
                route: 'view/:slug',
                moduleId: PLATFORM.moduleName('./view'),
                name: 'view',
                nav: false,
                title: 'View'
            },
            {
                route: 'admin',
                moduleId: PLATFORM.moduleName('./admin/admin'),
                name: 'admin',
                nav: true,
                auth: true,
                title: 'Admin',
                settings: {
                    admin: true
                }
            },
        ]);

        config.addPipelineStep('authorize', AuthorizeStep);

        config.mapUnknownRoutes(PLATFORM.moduleName('not-found'));

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
                        this.disableButtons = false;
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
                    this.disableButtons = false;
                });
        }
    }

    handleSubmission($event?) {
        if (this.submissionFormIsValid) {
            this.formMessage = '';
            this.disableButtons = true;

            let submissionObject: SubmissionInterface;

            submissionObject.name = this.model.name;
            submissionObject.category = this.model.category;
            submissionObject.description = this.model.description;

            if (notEmpty(this.model.url)) {
                submissionObject.url = this.model.url;
            }

            if (notEmpty(this.model.repoUrl)) {
                submissionObject.repoUrl = this.model.repoUrl;
            }

            if (notEmpty(this.model.twitterHandle)) {
                submissionObject.twitterHandle = this.model.twitterHandle;
            }
            
            // New submissions go into the moderation queue
            submissionObject.status = 'moderation-queue';

            this.api.postSubmission(submissionObject)
                .then(() => {
                    window.alert('Your submission has been received, thank you');
                    this.disableButtons = false;
                    this.showHat = false;
                    this.showHatSubmission = false;
                })
                .catch(() => {
                    this.disableButtons = false;
                });
        }
    }

    showHatChanged(bool: boolean) {
        if (bool) {
            scrollTop();
        }
    }
}

class AuthorizeStep {
    run(navigationInstruction, next) {
        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged(user => {
                let currentRoute = navigationInstruction.config;
                let loginRequired = currentRoute.auth && currentRoute.auth === true;

                if (!user && loginRequired) {
                    return resolve(next.cancel(new Redirect('')));
                }

                if (currentRoute.settings && currentRoute.settings.admin) {
                    if (user.uid !== 'TPdM9feOrbgNHVGHebBT7TBZ8Xj1') {
                        return resolve(next.cancel(new Redirect('')));
                    }
                }

                return resolve(next());
            });
        });
    }
}

