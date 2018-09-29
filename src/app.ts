import { ApplicationRoutes } from './routes.config';
import { computedFrom, observable, autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration, Redirect } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { PLATFORM } from 'aurelia-pal';
import { Store, connectTo } from 'aurelia-store';
import { ValidationControllerFactory, ValidationRules, ValidationController, validateTrigger, Validator } from 'aurelia-validation';

import { SubmissionInterface } from './common/interfaces';

import { Api } from './services/api';
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
    scrollTop
} from './common';

import firebase from './common/firebase';

import {
    loadProjects,
    getCategories,
    setCategory,
    backupProjects,
    sortCategories,
    setUser,
    loadProject,
    changeSortMode,
    sortProjects,
    castVote
} from './store/actions';

import { ProjectModel, ProjectModelInterface } from './common/models/project';

@connectTo()
@autoinject()
export class App {
    private router: Router;
    public categories;

    @observable showHat: boolean = false;
    private showHatLogin: boolean = false;
    private showHatRegister: boolean = false;
    private showHatSubmission: boolean = false;

    private submissionModel: ProjectModelInterface;

    private disableButtons: boolean = false;

    private formMessage: string = '';
    private validationErrors: any = {};

    public state: State;
    public controller: ValidationController;

    constructor(
        private api: Api,
        private userService: UserService,
        private ea: EventAggregator,
        private store: Store<State>,
        private controllerFactory: ValidationControllerFactory,
        private validator: Validator) {
        // When the Firebase auth state changes, tell the store
        firebase.auth().onAuthStateChanged(user => {
            this.store.dispatch(setUser, user);
        });

        // Register store actions
        this.setupStore();

        this.categories = categories;

        this.controller = controllerFactory.createForCurrentScope();
        this.controller.validateTrigger = validateTrigger.blur;
        this.controller.subscribe(event => this.validateForm());

        ValidationRules
            .ensure('name').required()
            .ensure('category').required()
            .ensure('description').required()
            .ensure('url').required().when((submission: any) => (submission.repoUrl.trim() === ''))
            .on(this.submissionModel);
    }

    validateForm() {
        this.validator.validateObject(this.submissionModel)
        .then(results => this.disableButtons = results.every(result => result.valid));
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

        this.showHat = true;
        this.showHatRegister = false;
        this.showHatLogin = true;
    }

    logout($event?: Event) {
        this.formMessage = '';
        this.userService.logout();
        PLATFORM.global.location.reload();
    }

    submission($event?: Event) {
        this.submissionModel = new ProjectModel();
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

    async handleSubmission() {
        const result = await this.controller.validate();

        if (result.valid) {
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

            submissionObject.name = this.submissionModel.name;
            submissionObject.category = this.submissionModel.category;
            submissionObject.description = this.submissionModel.description;

            try {
                await this.api.postSubmission(submissionObject);

                PLATFORM.global.alert('Your submission has been received, thank you');
                this.disableButtons = false;
                this.showHat = false;
                this.showHatSubmission = false;
            } catch(e) {
                console.error(e);
            }
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
        return new Promise((resolve) => {
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
