import { ApplicationRoutes } from './routes.config';
import { Aurelia, computedFrom, observable, autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration, Redirect } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { PLATFORM, DOM } from 'aurelia-pal';
import { Store, connectTo } from 'aurelia-store';

import { SubmissionInterface } from './common/interfaces';

import { Api } from './services/api';
import { ApplicationService } from './services/application';
import { UserService } from './services/user';
import { State } from './store/state';

import {
    LOAD_PROJECTS,
    GET_CATEGORIES,
    SET_CATEGORY,
    BACKUP_PROJECTS,
    SORT_CATEGORIES,
    SET_USER,
    LOAD_PROJECT,
    SORT_PROJECTS,
    CHANGE_SORT_MODE,
    CAST_VOTE
} from './store/constants';


import {
    categories,
    scrollTop,
    isEmpty,
    notEmpty,
    stringInObject,
    isUrl,
    requiredField,
    equals
} from './common';

import firebase from './common/firebase';

import {
    loadProjects,
    getCategories,
    setCategory,
    backupProjects,
    resetProjects,
    sortCategories,
    setUser,
    loadProject,
    changeSortMode,
    sortProjects,
    castVote
} from './store/actions';

import { ProjectModel } from './common/models/project';

@connectTo()
@autoinject()
export class App {
    private router: Router;
    public categories;

    @observable showHat: boolean = false;
    private showHatLogin: boolean = false;
    private showHatRegister: boolean = false;
    private showHatSubmission: boolean = false;

    private model = ProjectModel;

    private disableButtons: boolean = false;

    private formMessage: string = '';
    private validationErrors: any = {};

    public state: State;

    constructor(
        private api: Api,
        private appService: ApplicationService,
        private userService: UserService,
        private ea: EventAggregator,
        private store: Store<State>) {
        // When the Firebase auth state changes, tell the store
        firebase.auth().onAuthStateChanged(user => {
            this.store.dispatch(setUser, user);
        });

        // Register store actions
        this.setupStore();

        this.categories = categories;
    }

    setupStore() {
        this.store.registerAction(LOAD_PROJECTS, loadProjects);
        this.store.registerAction(GET_CATEGORIES, getCategories);
        this.store.registerAction(SET_CATEGORY, setCategory);
        this.store.registerAction(BACKUP_PROJECTS, backupProjects);
        this.store.registerAction(SORT_CATEGORIES, sortCategories);
        this.store.registerAction(SET_USER, setUser);
        this.store.registerAction(LOAD_PROJECT, loadProject);
        this.store.registerAction(SORT_PROJECTS, sortProjects);
        this.store.registerAction(CHANGE_SORT_MODE, changeSortMode);
        this.store.registerAction(CAST_VOTE, castVote);
    }

    @computedFrom('model.email', 'model.password')
    get loginFormIsValid() {
        return (notEmpty(this.model.email) && notEmpty(this.model.password));
    }

    @computedFrom('model.email', 'model.password', 'model.password2')
    get registerFormIsValid() {
        return (notEmpty(this.model.email) && notEmpty(this.model.password) && notEmpty(this.model.password2) && this.passwordsMatch);
    }

    @computedFrom('model.name', 'model.category', 'model.url', 'model.repoUrl', 'model.description')
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

        config.map(ApplicationRoutes);
        config.addPipelineStep('authorize', AuthorizeStep);

        config.mapUnknownRoutes(PLATFORM.moduleName('./routes/not-found', 'not-found'));

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
        PLATFORM.global.location.reload();
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

    socialLogin(providerType: 'google' | 'github') {
        let provider = providerType === 'google' ? new firebase.auth.GoogleAuthProvider() : new firebase.auth.GithubAuthProvider();
        firebase.auth().signInWithRedirect(provider);
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

                    PLATFORM.global.location.reload();
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

                    PLATFORM.global.location.reload();
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

            let submissionObject: SubmissionInterface = {
                name: '',
                category: '',
                description: '',
                url: '',
                repoUrl: '',
                status: 'published'
            };

            submissionObject.name = this.model.name;
            submissionObject.category = this.model.category;
            submissionObject.description = this.model.description;

            if (notEmpty(this.model.url)) {
                submissionObject.url = this.model.url;
            }

            if (notEmpty(this.model.repoUrl)) {
                submissionObject.repoUrl = this.model.repoUrl;
            }

            this.api.postSubmission(submissionObject)
                .then(() => {
                    PLATFORM.global.alert('Your submission has been received, thank you');
                    this.disableButtons = false;
                    this.showHat = false;
                    this.showHatSubmission = false;
                });
        }
    }

    showHatChanged(bool: boolean) {
        if (bool) {
            scrollTop();

            if (PLATFORM.global.body) {
                PLATFORM.global.body.style.overflow = 'hidden';
            }
        } else {
            if (PLATFORM.global.body) {
                PLATFORM.global.body.style.overflow = '';
            }
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
