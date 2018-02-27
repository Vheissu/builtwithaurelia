define('about',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var About = (function () {
        function About() {
        }
        return About;
    }());
    exports.About = About;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFib3V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUFBO1FBQUE7UUFFQSxDQUFDO1FBQUQsWUFBQztJQUFELENBRkEsQUFFQyxJQUFBO0lBRlksc0JBQUsiLCJmaWxlIjoiYWJvdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQWJvdXQge1xyXG4gICAgXHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiJzcmMifQ==

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('api',["require", "exports", "aurelia-framework", "aurelia-fetch-client", "./services/application", "./services/user", "./common"], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1, application_1, user_1, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Api = (function () {
        function Api(http, appService, userService) {
            this.http = http;
            this.appService = appService;
            this.userService = userService;
        }
        Api.prototype.getProjectsFromFirebase = function () {
            var _this = this;
            this.appService.loading = true;
            return new Promise(function (resolve, reject) {
                firebase.database().ref('submissions').once('value').then(function (snapshot) {
                    _this.appService.loading = false;
                    resolve(snapshot.val());
                }, function () {
                    _this.appService.loading = false;
                });
            });
        };
        Api.prototype.getProject = function (slug) {
            var _this = this;
            this.appService.loading = true;
            return new Promise(function (resolve, reject) {
                firebase.database().ref("submissions/" + slug).once('value').then(function (snapshot) {
                    _this.appService.loading = false;
                    resolve(snapshot.val());
                }, function () {
                    _this.appService.loading = false;
                    reject();
                });
            });
        };
        Api.prototype.getCurrentUserSubmissions = function () {
            var _this = this;
            this.appService.loading = true;
            return new Promise(function (resolve, reject) {
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        firebase.database().ref("submissions")
                            .orderByChild('_uid')
                            .equalTo(user.uid)
                            .once('value').then(function (snapshot) {
                            var submissions = snapshot.val();
                            var userSubmissions = [];
                            if (submissions) {
                                for (var key in submissions) {
                                    if (submissions.hasOwnProperty(key)) {
                                        var submission = submissions[key];
                                        submission.objectKey = key;
                                        if (submission._uid === user.uid) {
                                            userSubmissions.push(submission);
                                        }
                                    }
                                }
                            }
                            _this.appService.loading = false;
                            resolve(userSubmissions);
                        });
                    }
                });
            });
        };
        Api.prototype.getSubmission = function (slug) {
            return new Promise(function (resolve, reject) {
                firebase.database().ref("submissions/" + slug).once('value').then(function (snapshot) {
                    resolve(snapshot.val());
                });
            });
        };
        Api.prototype.castVote = function (name, action) {
            var slug = common_1.slugify(name);
            var uid = firebase.auth().currentUser.uid;
            if (action === 'add') {
                return firebase.database().ref("submissions/" + slug + "/votes/" + uid).set(true);
            }
            else {
                return firebase.database().ref("submissions/" + slug + "/votes/" + uid).set(null);
            }
        };
        Api.prototype.addProject = function (project) {
            if (!project.added) {
                project.added = firebase.database.ServerValue.TIMESTAMP;
            }
            firebase.database().ref("submissions/" + common_1.slugify(project.name)).update(project);
        };
        Api.prototype.postSubmission = function (submission) {
            return new Promise(function (resolve, reject) {
                if (submission && firebase.auth().currentUser) {
                    submission._uid = firebase.auth().currentUser.uid;
                    submission.added = firebase.database.ServerValue.TIMESTAMP;
                    firebase.database().ref("submissions/" + common_1.slugify(submission.name)).set(submission).then(function () {
                        resolve(true);
                    });
                }
            });
        };
        return Api;
    }());
    Api = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, application_1.ApplicationService, user_1.UserService])
    ], Api);
    exports.Api = Api;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,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SSxDQUFDO3dCQUNwRixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2xCLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFDTCxVQUFDO0lBQUQsQ0ExR0EsQUEwR0MsSUFBQTtJQTFHWSxHQUFHO1FBRGYsOEJBQVU7eUNBRW1CLGlDQUFVLEVBQXNCLGdDQUFrQixFQUF1QixrQkFBVztPQURyRyxHQUFHLENBMEdmO0lBMUdZLGtCQUFHIiwiZmlsZSI6ImFwaS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXV0b2luamVjdH0gZnJvbSAnYXVyZWxpYS1mcmFtZXdvcmsnOyBcbmltcG9ydCB7SHR0cENsaWVudH0gZnJvbSAnYXVyZWxpYS1mZXRjaC1jbGllbnQnO1xuXG5pbXBvcnQgeyBBcHBsaWNhdGlvblNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2FwcGxpY2F0aW9uJztcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy91c2VyJztcblxuaW1wb3J0IHtzbHVnaWZ5fSBmcm9tICcuL2NvbW1vbic7XG5cbmRlY2xhcmUgbGV0IGZpcmViYXNlO1xuXG5AYXV0b2luamVjdFxuZXhwb3J0IGNsYXNzIEFwaSB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBwcml2YXRlIGFwcFNlcnZpY2U6IEFwcGxpY2F0aW9uU2VydmljZSwgcHJpdmF0ZSB1c2VyU2VydmljZTogVXNlclNlcnZpY2UpIHtcblxuICAgIH1cblxuICAgIGdldFByb2plY3RzRnJvbUZpcmViYXNlKCkge1xuICAgICAgICB0aGlzLmFwcFNlcnZpY2UubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKCdzdWJtaXNzaW9ucycpLm9uY2UoJ3ZhbHVlJykudGhlbihzbmFwc2hvdCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBTZXJ2aWNlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHNuYXBzaG90LnZhbCgpKTtcbiAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcFNlcnZpY2UubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldFByb2plY3Qoc2x1Zykge1xuICAgICAgICB0aGlzLmFwcFNlcnZpY2UubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGBzdWJtaXNzaW9ucy8ke3NsdWd9YCkub25jZSgndmFsdWUnKS50aGVuKHNuYXBzaG90ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcFNlcnZpY2UubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoc25hcHNob3QudmFsKCkpOyAgXG4gICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBTZXJ2aWNlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZWplY3QoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRDdXJyZW50VXNlclN1Ym1pc3Npb25zKCkge1xuICAgICAgICB0aGlzLmFwcFNlcnZpY2UubG9hZGluZyA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4geyAgICAgICAgXG4gICAgICAgICAgICBmaXJlYmFzZS5hdXRoKCkub25BdXRoU3RhdGVDaGFuZ2VkKHVzZXIgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGBzdWJtaXNzaW9uc2ApXG4gICAgICAgICAgICAgICAgICAgICAgICAub3JkZXJCeUNoaWxkKCdfdWlkJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lcXVhbFRvKHVzZXIudWlkKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uY2UoJ3ZhbHVlJykudGhlbihzbmFwc2hvdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN1Ym1pc3Npb25zID0gc25hcHNob3QudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXJTdWJtaXNzaW9ucyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Ym1pc3Npb25zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBzdWJtaXNzaW9ucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Ym1pc3Npb25zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3VibWlzc2lvbiA9IHN1Ym1pc3Npb25zW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VibWlzc2lvbi5vYmplY3RLZXkgPSBrZXk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3VibWlzc2lvbi5fdWlkID09PSB1c2VyLnVpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyU3VibWlzc2lvbnMucHVzaChzdWJtaXNzaW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcFNlcnZpY2UubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh1c2VyU3VibWlzc2lvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRTdWJtaXNzaW9uKHNsdWcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGBzdWJtaXNzaW9ucy8ke3NsdWd9YCkub25jZSgndmFsdWUnKS50aGVuKHNuYXBzaG90ID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHNuYXBzaG90LnZhbCgpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjYXN0Vm90ZShuYW1lLCBhY3Rpb24pIHtcbiAgICAgICAgbGV0IHNsdWcgPSBzbHVnaWZ5KG5hbWUpO1xuICAgICAgICBsZXQgdWlkID0gZmlyZWJhc2UuYXV0aCgpLmN1cnJlbnRVc2VyLnVpZDtcblxuICAgICAgICBpZiAoYWN0aW9uID09PSAnYWRkJykge1xuICAgICAgICAgICAgcmV0dXJuIGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGBzdWJtaXNzaW9ucy8ke3NsdWd9L3ZvdGVzLyR7dWlkfWApLnNldCh0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmaXJlYmFzZS5kYXRhYmFzZSgpLnJlZihgc3VibWlzc2lvbnMvJHtzbHVnfS92b3Rlcy8ke3VpZH1gKS5zZXQobnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRQcm9qZWN0KHByb2plY3QpIHtcbiAgICAgICAgaWYgKCFwcm9qZWN0LmFkZGVkKSB7XG4gICAgICAgICAgICBwcm9qZWN0LmFkZGVkID0gZmlyZWJhc2UuZGF0YWJhc2UuU2VydmVyVmFsdWUuVElNRVNUQU1QO1xuICAgICAgICB9XG5cbiAgICAgICAgZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoYHN1Ym1pc3Npb25zLyR7c2x1Z2lmeShwcm9qZWN0Lm5hbWUpfWApLnVwZGF0ZShwcm9qZWN0KTtcbiAgICB9XG5cbiAgICBwb3N0U3VibWlzc2lvbihzdWJtaXNzaW9uKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAoc3VibWlzc2lvbiAmJiBmaXJlYmFzZS5hdXRoKCkuY3VycmVudFVzZXIpIHtcbiAgICAgICAgICAgICAgICBzdWJtaXNzaW9uLl91aWQgPSBmaXJlYmFzZS5hdXRoKCkuY3VycmVudFVzZXIudWlkO1xuICAgICAgICAgICAgICAgIHN1Ym1pc3Npb24uYWRkZWQgPSBmaXJlYmFzZS5kYXRhYmFzZS5TZXJ2ZXJWYWx1ZS5USU1FU1RBTVA7XG5cbiAgICAgICAgICAgICAgICBmaXJlYmFzZS5kYXRhYmFzZSgpLnJlZihgc3VibWlzc2lvbnMvJHtzbHVnaWZ5KHN1Ym1pc3Npb24ubmFtZSl9YCkuc2V0KHN1Ym1pc3Npb24pLnRoZW4oKCkgPT4geyBcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTsgXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290Ijoic3JjIn0=

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "./api", "./services/application", "./services/user", "./common"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, api_1, application_1, user_1, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App(api, appService, userService, ea) {
            this.showHat = false;
            this.showHatLogin = false;
            this.showHatRegister = false;
            this.showHatSubmission = false;
            this.model = {
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
            this.disableButtons = false;
            this.formMessage = '';
            this.validationErrors = {};
            this.api = api;
            this.appService = appService;
            this.userService = userService;
            this.ea = ea;
            this.categories = common_1.categories;
        }
        Object.defineProperty(App.prototype, "loginFormIsValid", {
            get: function () {
                return (common_1.notEmpty(this.model.email) && common_1.notEmpty(this.model.password));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "registerFormIsValid", {
            get: function () {
                return (common_1.notEmpty(this.model.email) && common_1.notEmpty(this.model.password) && common_1.notEmpty(this.model.password2) && this.passwordsMatch);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "submissionFormIsValid", {
            get: function () {
                var isValid = true;
                if (common_1.isEmpty(this.model.name) || common_1.isEmpty(this.model.category) || common_1.isEmpty(this.model.description)) {
                    isValid = false;
                }
                if (common_1.notEmpty(this.model.url) && !common_1.isUrl(this.model.url)) {
                    isValid = false;
                }
                if (common_1.notEmpty(this.model.repoUrl) && !common_1.isUrl(this.model.repoUrl)) {
                    isValid = false;
                }
                if (common_1.notEmpty(this.model.twitterHandle) && this.model.twitterHandle.charAt(0) === '@') {
                    this.model.twitterHandle.substring(1);
                }
                if (common_1.isEmpty(this.model.url) && common_1.isEmpty(this.model.repoUrl)) {
                    isValid = false;
                }
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "passwordsMatch", {
            get: function () {
                return ((common_1.notEmpty(this.model.password) && common_1.notEmpty(this.model.password2)) && (common_1.equals(this.model.password.trim(), this.model.password2.trim())));
            },
            enumerable: true,
            configurable: true
        });
        App.prototype.attached = function () {
            var _this = this;
            this.ea.subscribe('show.login-form', function () {
                _this.login();
            });
            this.ea.subscribe('submission', function () {
                _this.submission();
            });
        };
        App.prototype.configureRouter = function (config, router) {
            config.title = 'Built With Aurelia';
            config.map([
                {
                    route: '',
                    moduleId: './home',
                    name: 'home',
                    nav: false,
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
                    route: 'dashboard',
                    moduleId: './dashboard/dashboard',
                    name: 'dashboard',
                    nav: true,
                    auth: true,
                    title: 'Dashboard'
                },
                {
                    route: 'submissions/:key?',
                    moduleId: './submissions',
                    name: 'submissions',
                    nav: false,
                    title: 'My Submissions'
                },
                {
                    route: 'view/:slug',
                    moduleId: './view',
                    name: 'view',
                    nav: false,
                    title: 'View'
                }
            ]);
            config.addPipelineStep('authorize', AuthorizeStep);
            this.router = router;
        };
        App.prototype.closeHat = function () {
            this.formMessage = '';
            this.showHat = false;
            this.showHatLogin = false;
            this.showHatRegister = false;
            this.showHatSubmission = false;
        };
        App.prototype.login = function ($event) {
            this.formMessage = '';
            this.model.email = '';
            this.model.password = '';
            this.showHat = true;
            this.showHatRegister = false;
            this.showHatLogin = true;
        };
        App.prototype.logout = function ($event) {
            this.formMessage = '';
            this.userService.logout();
            window.location.reload();
        };
        App.prototype.register = function ($event) {
            this.formMessage = '';
            this.model.email = '';
            this.model.password = '';
            this.model.password2 = '';
            this.showHat = true;
            this.showHatLogin = false;
            this.showHatRegister = true;
        };
        App.prototype.submission = function ($event) {
            this.model.name = '';
            this.formMessage = '';
            this.showHat = true;
            if (this.userService.isLoggedIn) {
                this.showHatLogin = false;
                this.showHatRegister = false;
                this.showHatSubmission = true;
            }
            else {
                this.showHatLogin = true;
                this.formMessage = 'You need to be logged in to make a new submission.';
            }
        };
        App.prototype.handleLogin = function ($event) {
            var _this = this;
            if (this.loginFormIsValid) {
                this.formMessage = '';
                this.disableButtons = true;
                this.userService.login(this.model.email, this.model.password)
                    .then(function () {
                    _this.showHat = false;
                    _this.showHatRegister = false;
                    _this.showHatLogin = false;
                    window.location.reload();
                })
                    .catch(function (e) {
                    if (e.code === 'auth/user-not-found') {
                        _this.formMessage = 'Ow, there was a problem :(<br>Please make sure you have entered a valid email address and password, then try again.';
                    }
                });
            }
        };
        App.prototype.handleRegister = function ($event) {
            var _this = this;
            if (this.registerFormIsValid) {
                this.formMessage = '';
                this.disableButtons = true;
                this.userService.register(this.model.email, this.model.password)
                    .then(function () {
                    _this.showHat = false;
                    _this.showHatRegister = false;
                    _this.showHatLogin = true;
                    window.location.reload();
                })
                    .catch(function (e) {
                    _this.formMessage = 'Sorry :(<br>there was a problem registering. Please make sure you entered in all fields correctly or refreshing the page.';
                });
            }
        };
        App.prototype.handleSubmission = function ($event) {
            var _this = this;
            if (this.submissionFormIsValid) {
                this.formMessage = '';
                this.disableButtons = true;
                var submissionObject = {
                    name: this.model.name,
                    category: this.model.category,
                    description: this.model.description
                };
                if (common_1.notEmpty(this.model.url)) {
                    submissionObject.url = this.model.url;
                }
                if (common_1.notEmpty(this.model.repoUrl)) {
                    submissionObject.repoUrl = this.model.repoUrl;
                }
                if (common_1.notEmpty(this.model.twitterHandle)) {
                    submissionObject.twitterHandle = this.model.twitterHandle;
                }
                this.api.postSubmission(submissionObject)
                    .then(function () {
                    window.alert('Your submission has been received, thank you');
                    _this.disableButtons = false;
                    _this.showHat = false;
                    _this.showHatSubmission = false;
                });
            }
        };
        App.prototype.showHatChanged = function (bool) {
            if (bool) {
                common_1.scrollTop();
            }
        };
        return App;
    }());
    __decorate([
        aurelia_framework_1.observable,
        __metadata("design:type", Boolean)
    ], App.prototype, "showHat", void 0);
    __decorate([
        aurelia_framework_1.computedFrom('model.email', 'model.password'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], App.prototype, "loginFormIsValid", null);
    __decorate([
        aurelia_framework_1.computedFrom('model.email', 'model.password', 'model.password2'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], App.prototype, "registerFormIsValid", null);
    __decorate([
        aurelia_framework_1.computedFrom('model.name', 'model.category', 'model.url', 'model.repoUrl', 'model.description', 'model.twitterHandle'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], App.prototype, "submissionFormIsValid", null);
    __decorate([
        aurelia_framework_1.computedFrom('model.password', 'model.password2'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], App.prototype, "passwordsMatch", null);
    App = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [api_1.Api, application_1.ApplicationService, user_1.UserService, aurelia_event_aggregator_1.EventAggregator])
    ], App);
    exports.App = App;
    var AuthorizeStep = (function () {
        function AuthorizeStep() {
        }
        AuthorizeStep.prototype.run = function (navigationInstruction, next) {
            return new Promise(function (resolve, reject) {
                firebase.auth().onAuthStateChanged(function (user) {
                    var currentRoute = navigationInstruction.config;
                    var loginRequired = currentRoute.auth && currentRoute.auth === true;
                    if (!user && loginRequired) {
                        return resolve(next.cancel(new aurelia_router_1.Redirect('')));
                    }
                    return resolve(next());
                });
            });
        };
        return AuthorizeStep;
    }());
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,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TUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUMzQixDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUNMLG9CQUFDO0lBQUQsQ0FmQSxBQWVDLElBQUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBdXJlbGlhLCBhdXRvaW5qZWN0LCBjb21wdXRlZEZyb20sIG9ic2VydmFibGV9IGZyb20gJ2F1cmVsaWEtZnJhbWV3b3JrJztcbmltcG9ydCB7Um91dGVyLCBSb3V0ZXJDb25maWd1cmF0aW9uLCBSZWRpcmVjdH0gZnJvbSAnYXVyZWxpYS1yb3V0ZXInO1xuaW1wb3J0IHtFdmVudEFnZ3JlZ2F0b3J9IGZyb20gJ2F1cmVsaWEtZXZlbnQtYWdncmVnYXRvcic7XG5cbmltcG9ydCB7QXBpfSBmcm9tICcuL2FwaSc7XG5pbXBvcnQge0FwcGxpY2F0aW9uU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlcy9hcHBsaWNhdGlvbic7XG5pbXBvcnQge1VzZXJTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2VzL3VzZXInO1xuXG5pbXBvcnQge2NhdGVnb3JpZXMsIHNjcm9sbFRvcCwgaXNFbXB0eSwgbm90RW1wdHksIHN0cmluZ0luT2JqZWN0LCBpc1VybCwgcmVxdWlyZWRGaWVsZCwgZXF1YWxzfSBmcm9tICcuL2NvbW1vbic7XG5cbmRlY2xhcmUgbGV0IGZpcmViYXNlOiBhbnk7XG5cbkBhdXRvaW5qZWN0XG5leHBvcnQgY2xhc3MgQXBwIHtcbiAgICBlYTogRXZlbnRBZ2dyZWdhdG9yO1xuICAgIGFwaTogQXBpO1xuICAgIGFwcFNlcnZpY2U6IEFwcGxpY2F0aW9uU2VydmljZTtcbiAgICB1c2VyU2VydmljZTogVXNlclNlcnZpY2U7XG4gICAgcm91dGVyOiBSb3V0ZXI7XG5cbiAgICBwdWJsaWMgY2F0ZWdvcmllcztcblxuICAgIEBvYnNlcnZhYmxlIHNob3dIYXQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIHNob3dIYXRMb2dpbjogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgc2hvd0hhdFJlZ2lzdGVyOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBzaG93SGF0U3VibWlzc2lvbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHJpdmF0ZSBtb2RlbCA9IHtcbiAgICAgICAgZW1haWw6ICcnLFxuICAgICAgICBwYXNzd29yZDogJycsXG4gICAgICAgIHBhc3N3b3JkMjogJycsXG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICBjYXRlZ29yeTogJ3dlYnNpdGUnLFxuICAgICAgICB1cmw6ICcnLFxuICAgICAgICByZXBvVXJsOiAnJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICB0d2l0dGVySGFuZGxlOiAnJ1xuICAgIH07XG5cbiAgICBwcml2YXRlIGRpc2FibGVCdXR0b25zOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwcml2YXRlIGZvcm1NZXNzYWdlOiBzdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIHZhbGlkYXRpb25FcnJvcnM6IGFueSA9IHt9O1xuXG4gICAgQGNvbXB1dGVkRnJvbSgnbW9kZWwuZW1haWwnLCAnbW9kZWwucGFzc3dvcmQnKVxuICAgIGdldCBsb2dpbkZvcm1Jc1ZhbGlkKCkge1xuICAgICAgICByZXR1cm4gKG5vdEVtcHR5KHRoaXMubW9kZWwuZW1haWwpICYmIG5vdEVtcHR5KHRoaXMubW9kZWwucGFzc3dvcmQpKTtcbiAgICB9XG5cbiAgICBAY29tcHV0ZWRGcm9tKCdtb2RlbC5lbWFpbCcsICdtb2RlbC5wYXNzd29yZCcsICdtb2RlbC5wYXNzd29yZDInKVxuICAgIGdldCByZWdpc3RlckZvcm1Jc1ZhbGlkKCkge1xuICAgICAgICByZXR1cm4gKG5vdEVtcHR5KHRoaXMubW9kZWwuZW1haWwpICYmIG5vdEVtcHR5KHRoaXMubW9kZWwucGFzc3dvcmQpICYmIG5vdEVtcHR5KHRoaXMubW9kZWwucGFzc3dvcmQyKSAmJiB0aGlzLnBhc3N3b3Jkc01hdGNoKTtcbiAgICB9XG5cbiAgICBAY29tcHV0ZWRGcm9tKCdtb2RlbC5uYW1lJywgJ21vZGVsLmNhdGVnb3J5JywgJ21vZGVsLnVybCcsICdtb2RlbC5yZXBvVXJsJywgJ21vZGVsLmRlc2NyaXB0aW9uJywgJ21vZGVsLnR3aXR0ZXJIYW5kbGUnKVxuICAgIGdldCBzdWJtaXNzaW9uRm9ybUlzVmFsaWQoKSB7XG4gICAgICAgIHZhciBpc1ZhbGlkID0gdHJ1ZTtcblxuICAgICAgICBpZiAoaXNFbXB0eSh0aGlzLm1vZGVsLm5hbWUpIHx8IGlzRW1wdHkodGhpcy5tb2RlbC5jYXRlZ29yeSkgfHwgaXNFbXB0eSh0aGlzLm1vZGVsLmRlc2NyaXB0aW9uKSkge1xuICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5vdEVtcHR5KHRoaXMubW9kZWwudXJsKSAmJiAhaXNVcmwodGhpcy5tb2RlbC51cmwpKSB7XG4gICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobm90RW1wdHkodGhpcy5tb2RlbC5yZXBvVXJsKSAmJiAhaXNVcmwodGhpcy5tb2RlbC5yZXBvVXJsKSkge1xuICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5vdEVtcHR5KHRoaXMubW9kZWwudHdpdHRlckhhbmRsZSkgJiYgdGhpcy5tb2RlbC50d2l0dGVySGFuZGxlLmNoYXJBdCgwKSA9PT0gJ0AnKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnR3aXR0ZXJIYW5kbGUuc3Vic3RyaW5nKDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRW1wdHkodGhpcy5tb2RlbC51cmwpICYmIGlzRW1wdHkodGhpcy5tb2RlbC5yZXBvVXJsKSkge1xuICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgfVxuXG4gICAgQGNvbXB1dGVkRnJvbSgnbW9kZWwucGFzc3dvcmQnLCAnbW9kZWwucGFzc3dvcmQyJylcbiAgICBnZXQgcGFzc3dvcmRzTWF0Y2goKSB7XG4gICAgICAgIHJldHVybiAoIChub3RFbXB0eSh0aGlzLm1vZGVsLnBhc3N3b3JkKSAmJiBub3RFbXB0eSh0aGlzLm1vZGVsLnBhc3N3b3JkMikpICYmIChlcXVhbHModGhpcy5tb2RlbC5wYXNzd29yZC50cmltKCksIHRoaXMubW9kZWwucGFzc3dvcmQyLnRyaW0oKSkpKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihhcGk6IEFwaSwgYXBwU2VydmljZTogQXBwbGljYXRpb25TZXJ2aWNlLCB1c2VyU2VydmljZTogVXNlclNlcnZpY2UsIGVhOiBFdmVudEFnZ3JlZ2F0b3IpIHtcbiAgICAgICAgdGhpcy5hcGkgPSBhcGk7XG4gICAgICAgIHRoaXMuYXBwU2VydmljZSA9IGFwcFNlcnZpY2U7XG4gICAgICAgIHRoaXMudXNlclNlcnZpY2UgPSB1c2VyU2VydmljZTtcbiAgICAgICAgdGhpcy5lYSA9IGVhO1xuXG4gICAgICAgIHRoaXMuY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG4gICAgfVxuXG4gICAgYXR0YWNoZWQoKSB7XG4gICAgICAgIHRoaXMuZWEuc3Vic2NyaWJlKCdzaG93LmxvZ2luLWZvcm0nLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvZ2luKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZWEuc3Vic2NyaWJlKCdzdWJtaXNzaW9uJywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdWJtaXNzaW9uKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbmZpZ3VyZVJvdXRlcihjb25maWc6IFJvdXRlckNvbmZpZ3VyYXRpb24sIHJvdXRlcjogUm91dGVyKSB7XG4gICAgICAgIGNvbmZpZy50aXRsZSA9ICdCdWlsdCBXaXRoIEF1cmVsaWEnO1xuXG4gICAgICAgIGNvbmZpZy5tYXAoW1xuICAgICAgICAgICAgeyBcbiAgICAgICAgICAgICAgICByb3V0ZTogJycsIFxuICAgICAgICAgICAgICAgIG1vZHVsZUlkOiAnLi9ob21lJyxcbiAgICAgICAgICAgICAgICBuYW1lOiAnaG9tZScsICAgICAgICBcbiAgICAgICAgICAgICAgICBuYXY6IGZhbHNlLCBcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0hvbWUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyBcbiAgICAgICAgICAgICAgICByb3V0ZTogJ2Fib3V0JyxcbiAgICAgICAgICAgICAgICBtb2R1bGVJZDogJy4vYWJvdXQnLCBcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWJvdXQnLCAgICBcbiAgICAgICAgICAgICAgICBuYXY6IHRydWUsIFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnQWJvdXQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJvdXRlOiAnZGFzaGJvYXJkJyxcbiAgICAgICAgICAgICAgICBtb2R1bGVJZDogJy4vZGFzaGJvYXJkL2Rhc2hib2FyZCcsXG4gICAgICAgICAgICAgICAgbmFtZTogJ2Rhc2hib2FyZCcsXG4gICAgICAgICAgICAgICAgbmF2OiB0cnVlLFxuICAgICAgICAgICAgICAgIGF1dGg6IHRydWUsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdEYXNoYm9hcmQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICByb3V0ZTogJ3N1Ym1pc3Npb25zLzprZXk/JyxcbiAgICAgICAgICAgICAgbW9kdWxlSWQ6ICcuL3N1Ym1pc3Npb25zJyxcbiAgICAgICAgICAgICAgbmFtZTogJ3N1Ym1pc3Npb25zJyxcbiAgICAgICAgICAgICAgbmF2OiBmYWxzZSxcbiAgICAgICAgICAgICAgdGl0bGU6ICdNeSBTdWJtaXNzaW9ucydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJvdXRlOiAndmlldy86c2x1ZycsXG4gICAgICAgICAgICAgIG1vZHVsZUlkOiAnLi92aWV3JyxcbiAgICAgICAgICAgICAgbmFtZTogJ3ZpZXcnLFxuICAgICAgICAgICAgICBuYXY6IGZhbHNlLFxuICAgICAgICAgICAgICB0aXRsZTogJ1ZpZXcnXG4gICAgICAgICAgICB9XG4gICAgICAgIF0pO1xuXG4gICAgICAgIGNvbmZpZy5hZGRQaXBlbGluZVN0ZXAoJ2F1dGhvcml6ZScsIEF1dGhvcml6ZVN0ZXApO1xuXG4gICAgICAgIHRoaXMucm91dGVyID0gcm91dGVyO1xuICAgIH1cblxuICAgIGNsb3NlSGF0KCkge1xuICAgICAgICB0aGlzLmZvcm1NZXNzYWdlID0gJyc7XG4gICAgICAgIHRoaXMuc2hvd0hhdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNob3dIYXRMb2dpbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNob3dIYXRSZWdpc3RlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNob3dIYXRTdWJtaXNzaW9uID0gZmFsc2U7XG4gICAgfVxuXG4gICAgbG9naW4oJGV2ZW50PzogRXZlbnQpIHtcbiAgICAgICAgdGhpcy5mb3JtTWVzc2FnZSA9ICcnO1xuICAgICAgICB0aGlzLm1vZGVsLmVtYWlsID0gJyc7XG4gICAgICAgIHRoaXMubW9kZWwucGFzc3dvcmQgPSAnJztcblxuICAgICAgICB0aGlzLnNob3dIYXQgPSB0cnVlO1xuICAgICAgICB0aGlzLnNob3dIYXRSZWdpc3RlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNob3dIYXRMb2dpbiA9IHRydWU7XG4gICAgfVxuXG4gICAgbG9nb3V0KCRldmVudD86IEV2ZW50KSB7XG4gICAgICAgIHRoaXMuZm9ybU1lc3NhZ2UgPSAnJztcbiAgICAgICAgdGhpcy51c2VyU2VydmljZS5sb2dvdXQoKTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyKCRldmVudD86IEV2ZW50KSB7XG4gICAgICAgIHRoaXMuZm9ybU1lc3NhZ2UgPSAnJztcbiAgICAgICAgdGhpcy5tb2RlbC5lbWFpbCA9ICcnO1xuICAgICAgICB0aGlzLm1vZGVsLnBhc3N3b3JkID0gJyc7XG4gICAgICAgIHRoaXMubW9kZWwucGFzc3dvcmQyID0gJyc7XG5cbiAgICAgICAgdGhpcy5zaG93SGF0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zaG93SGF0TG9naW4gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zaG93SGF0UmVnaXN0ZXIgPSB0cnVlO1xuICAgIH1cblxuICAgIHN1Ym1pc3Npb24oJGV2ZW50PzogRXZlbnQpIHtcbiAgICAgICAgdGhpcy5tb2RlbC5uYW1lID0gJyc7XG4gICAgICAgIHRoaXMuZm9ybU1lc3NhZ2UgPSAnJztcblxuICAgICAgICB0aGlzLnNob3dIYXQgPSB0cnVlO1xuXG4gICAgICAgIGlmICh0aGlzLnVzZXJTZXJ2aWNlLmlzTG9nZ2VkSW4pIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0hhdExvZ2luID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnNob3dIYXRSZWdpc3RlciA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zaG93SGF0U3VibWlzc2lvbiA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNob3dIYXRMb2dpbiA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmZvcm1NZXNzYWdlID0gJ1lvdSBuZWVkIHRvIGJlIGxvZ2dlZCBpbiB0byBtYWtlIGEgbmV3IHN1Ym1pc3Npb24uJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZUxvZ2luKCRldmVudD8pIHtcbiAgICAgICAgaWYgKHRoaXMubG9naW5Gb3JtSXNWYWxpZCkge1xuICAgICAgICAgICAgdGhpcy5mb3JtTWVzc2FnZSA9ICcnO1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlQnV0dG9ucyA9IHRydWU7XG4gICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnVzZXJTZXJ2aWNlLmxvZ2luKHRoaXMubW9kZWwuZW1haWwsIHRoaXMubW9kZWwucGFzc3dvcmQpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dIYXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93SGF0UmVnaXN0ZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93SGF0TG9naW4gPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmNvZGUgPT09ICdhdXRoL3VzZXItbm90LWZvdW5kJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JtTWVzc2FnZSA9ICdPdywgdGhlcmUgd2FzIGEgcHJvYmxlbSA6KDxicj5QbGVhc2UgbWFrZSBzdXJlIHlvdSBoYXZlIGVudGVyZWQgYSB2YWxpZCBlbWFpbCBhZGRyZXNzIGFuZCBwYXNzd29yZCwgdGhlbiB0cnkgYWdhaW4uJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVSZWdpc3RlcigkZXZlbnQ/KSB7XG4gICAgICAgIGlmICh0aGlzLnJlZ2lzdGVyRm9ybUlzVmFsaWQpIHtcbiAgICAgICAgICAgIHRoaXMuZm9ybU1lc3NhZ2UgPSAnJztcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZUJ1dHRvbnMgPSB0cnVlO1xuXG4gICAgICAgICAgICB0aGlzLnVzZXJTZXJ2aWNlLnJlZ2lzdGVyKHRoaXMubW9kZWwuZW1haWwsIHRoaXMubW9kZWwucGFzc3dvcmQpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dIYXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93SGF0UmVnaXN0ZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93SGF0TG9naW4gPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JtTWVzc2FnZSA9ICdTb3JyeSA6KDxicj50aGVyZSB3YXMgYSBwcm9ibGVtIHJlZ2lzdGVyaW5nLiBQbGVhc2UgbWFrZSBzdXJlIHlvdSBlbnRlcmVkIGluIGFsbCBmaWVsZHMgY29ycmVjdGx5IG9yIHJlZnJlc2hpbmcgdGhlIHBhZ2UuJztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZVN1Ym1pc3Npb24oJGV2ZW50Pykge1xuICAgICAgICBpZiAodGhpcy5zdWJtaXNzaW9uRm9ybUlzVmFsaWQpIHtcbiAgICAgICAgICAgIHRoaXMuZm9ybU1lc3NhZ2UgPSAnJztcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZUJ1dHRvbnMgPSB0cnVlO1xuXG4gICAgICAgICAgICBsZXQgc3VibWlzc2lvbk9iamVjdDogYW55ID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubW9kZWwubmFtZSxcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogdGhpcy5tb2RlbC5jYXRlZ29yeSxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdGhpcy5tb2RlbC5kZXNjcmlwdGlvblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKG5vdEVtcHR5KHRoaXMubW9kZWwudXJsKSkge1xuICAgICAgICAgICAgICAgIHN1Ym1pc3Npb25PYmplY3QudXJsID0gdGhpcy5tb2RlbC51cmw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChub3RFbXB0eSh0aGlzLm1vZGVsLnJlcG9VcmwpKSB7XG4gICAgICAgICAgICAgICAgc3VibWlzc2lvbk9iamVjdC5yZXBvVXJsID0gdGhpcy5tb2RlbC5yZXBvVXJsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobm90RW1wdHkodGhpcy5tb2RlbC50d2l0dGVySGFuZGxlKSkge1xuICAgICAgICAgICAgICAgIHN1Ym1pc3Npb25PYmplY3QudHdpdHRlckhhbmRsZSA9IHRoaXMubW9kZWwudHdpdHRlckhhbmRsZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5hcGkucG9zdFN1Ym1pc3Npb24oc3VibWlzc2lvbk9iamVjdClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5hbGVydCgnWW91ciBzdWJtaXNzaW9uIGhhcyBiZWVuIHJlY2VpdmVkLCB0aGFuayB5b3UnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlQnV0dG9ucyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dIYXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93SGF0U3VibWlzc2lvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvd0hhdENoYW5nZWQoYm9vbDogYm9vbGVhbikge1xuICAgICAgICBpZiAoYm9vbCkge1xuICAgICAgICAgICAgc2Nyb2xsVG9wKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNsYXNzIEF1dGhvcml6ZVN0ZXAge1xuICAgIHJ1bihuYXZpZ2F0aW9uSW5zdHJ1Y3Rpb24sIG5leHQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGZpcmViYXNlLmF1dGgoKS5vbkF1dGhTdGF0ZUNoYW5nZWQodXNlciA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRSb3V0ZSA9IG5hdmlnYXRpb25JbnN0cnVjdGlvbi5jb25maWc7XG4gICAgICAgICAgICAgICAgbGV0IGxvZ2luUmVxdWlyZWQgPSBjdXJyZW50Um91dGUuYXV0aCAmJiBjdXJyZW50Um91dGUuYXV0aCA9PT0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmICghdXNlciAmJiBsb2dpblJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKG5leHQuY2FuY2VsKG5ldyBSZWRpcmVjdCgnJykpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShuZXh0KCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290Ijoic3JjIn0=

define('common',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.colours = [
        'bg--purple',
        'bg--grapefruit',
        'bg--medium-blue',
        'bg--bright-blue',
        'bg--gentle-pink',
        'bg--teal',
        'bg--light-cyan',
        'bg--brave-orange',
        'bg--yellow-its-me',
        'bg--green',
        'bg--pie',
        'bg--middle-blue'
    ];
    exports.getColourFromHashedString = function (str) {
        if (str) {
            var hash = exports.hashString(str);
            var index = hash % exports.colours.length;
            return exports.colours[index];
        }
        return null;
    };
    exports.hashString = function (str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var charCode = str.charCodeAt(i);
            hash += charCode;
        }
        return hash;
    };
    exports.paginate = function (page, maxPerPage, items) {
        var offset = (page - 1) * maxPerPage;
        var totalPages = Math.ceil(items.length / maxPerPage);
        return {
            items: (maxPerPage === -1) ? items : items.slice(offset, offset + maxPerPage),
            pages: totalPages
        };
    };
    exports.slugify = function (str) {
        return str.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };
    exports.categories = [
        { name: 'Website', value: 'website', selected: true },
        { name: 'Plugin', value: 'plugin' },
        { name: 'Mobile Application', value: 'mobile' },
        { name: 'Theme', value: 'theme' }
    ];
    exports.scrollTop = function () {
        window.scrollTo(0, 0);
    };
    exports.isEmpty = function (str) {
        return typeof str === 'string' && str.trim() === '';
    };
    exports.notEmpty = function (str) {
        return typeof str === 'string' && str.trim() !== '';
    };
    exports.stringInObject = function (str, obj) {
        return typeof str === 'string' && obj && str in obj || false;
    };
    exports.isUrl = function (str) {
        return typeof str === 'string' && (str.indexOf('http:') >= 0 || str.indexOf('https:') >= 0) || false;
    };
    exports.requiredField = function (field, map) {
        return field && map && map.indexOf(field) >= 0 || false;
    };
    exports.equals = function (a, b) {
        return a === b;
    };
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFBYSxRQUFBLE9BQU8sR0FBRztRQUNuQixZQUFZO1FBQ1osZ0JBQWdCO1FBQ2hCLGlCQUFpQjtRQUNqQixpQkFBaUI7UUFDakIsaUJBQWlCO1FBQ2pCLFVBQVU7UUFDVixnQkFBZ0I7UUFDaEIsa0JBQWtCO1FBQ2xCLG1CQUFtQjtRQUNuQixXQUFXO1FBQ1gsU0FBUztRQUNULGlCQUFpQjtLQUNwQixDQUFDO0lBR1csUUFBQSx5QkFBeUIsR0FBRyxVQUFBLEdBQUc7UUFDeEMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNOLElBQUksSUFBSSxHQUFHLGtCQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLGVBQU8sQ0FBQyxNQUFNLENBQUM7WUFFbEMsTUFBTSxDQUFDLGVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQixDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDLENBQUM7SUFFVyxRQUFBLFVBQVUsR0FBRyxVQUFBLEdBQUc7UUFDekIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBRWIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbEMsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFJLElBQUksUUFBUSxDQUFDO1FBQ3JCLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUMsQ0FBQztJQUVXLFFBQUEsUUFBUSxHQUFHLFVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLO1FBQ3hDLElBQUksTUFBTSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUNyQyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLENBQUM7UUFFdEQsTUFBTSxDQUFDO1lBQ0gsS0FBSyxFQUFFLENBQUMsVUFBVSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE1BQU0sR0FBRyxVQUFVLENBQUM7WUFDN0UsS0FBSyxFQUFFLFVBQVU7U0FDcEIsQ0FBQztJQUNWLENBQUMsQ0FBQztJQUVXLFFBQUEsT0FBTyxHQUFHLFVBQUEsR0FBRztRQUN0QixNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRTthQUNuQixPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQzthQUN4QixPQUFPLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQzthQUN4QixPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLENBQUMsQ0FBQTtJQUVVLFFBQUEsVUFBVSxHQUFHO1FBQ3BCLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7UUFDbkQsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUM7UUFDakMsRUFBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBQztRQUM3QyxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBQztLQUNsQyxDQUFDO0lBRVcsUUFBQSxTQUFTLEdBQUc7UUFDckIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDMUIsQ0FBQyxDQUFDO0lBRVcsUUFBQSxPQUFPLEdBQUcsVUFBQSxHQUFHO1FBQ3RCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztJQUN4RCxDQUFDLENBQUM7SUFFVyxRQUFBLFFBQVEsR0FBRyxVQUFBLEdBQUc7UUFDdkIsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO0lBQ3hELENBQUMsQ0FBQztJQUVXLFFBQUEsY0FBYyxHQUFHLFVBQUMsR0FBRyxFQUFFLEdBQUc7UUFDbkMsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUM7SUFDakUsQ0FBQyxDQUFDO0lBRVcsUUFBQSxLQUFLLEdBQUcsVUFBQSxHQUFHO1FBQ3BCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQztJQUN6RyxDQUFDLENBQUM7SUFFVyxRQUFBLGFBQWEsR0FBRyxVQUFDLEtBQUssRUFBRSxHQUFHO1FBQ3BDLE1BQU0sQ0FBQyxLQUFLLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQztJQUM1RCxDQUFDLENBQUM7SUFFVyxRQUFBLE1BQU0sR0FBRyxVQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25CLENBQUMsQ0FBQyIsImZpbGUiOiJjb21tb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgY29sb3VycyA9IFtcclxuICAgICdiZy0tcHVycGxlJyxcclxuICAgICdiZy0tZ3JhcGVmcnVpdCcsXHJcbiAgICAnYmctLW1lZGl1bS1ibHVlJyxcclxuICAgICdiZy0tYnJpZ2h0LWJsdWUnLFxyXG4gICAgJ2JnLS1nZW50bGUtcGluaycsXHJcbiAgICAnYmctLXRlYWwnLFxyXG4gICAgJ2JnLS1saWdodC1jeWFuJyxcclxuICAgICdiZy0tYnJhdmUtb3JhbmdlJyxcclxuICAgICdiZy0teWVsbG93LWl0cy1tZScsXHJcbiAgICAnYmctLWdyZWVuJyxcclxuICAgICdiZy0tcGllJyxcclxuICAgICdiZy0tbWlkZGxlLWJsdWUnICAgIFxyXG5dO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRDb2xvdXJGcm9tSGFzaGVkU3RyaW5nID0gc3RyID0+IHtcclxuICAgIGlmIChzdHIpIHtcclxuICAgICAgICBsZXQgaGFzaCA9IGhhc2hTdHJpbmcoc3RyKTtcclxuICAgICAgICBsZXQgaW5kZXggPSBoYXNoICUgY29sb3Vycy5sZW5ndGg7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGNvbG91cnNbaW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGhhc2hTdHJpbmcgPSBzdHIgPT4ge1xyXG4gICAgbGV0IGhhc2ggPSAwO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGNoYXJDb2RlID0gc3RyLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgaGFzaCArPSBjaGFyQ29kZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaGFzaDtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBwYWdpbmF0ZSA9IChwYWdlLCBtYXhQZXJQYWdlLCBpdGVtcykgPT4ge1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSAocGFnZSAtIDEpICogbWF4UGVyUGFnZTtcclxuICAgICAgICBsZXQgdG90YWxQYWdlcyA9IE1hdGguY2VpbChpdGVtcy5sZW5ndGggLyBtYXhQZXJQYWdlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgaXRlbXM6IChtYXhQZXJQYWdlID09PSAtMSkgPyBpdGVtcyA6IGl0ZW1zLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgbWF4UGVyUGFnZSksXHJcbiAgICAgICAgICAgIHBhZ2VzOiB0b3RhbFBhZ2VzXHJcbiAgICAgICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBzbHVnaWZ5ID0gc3RyID0+IHtcclxuICAgIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKVxyXG4gICAgICAgIC5yZXBsYWNlKC9bXlxcd1xccy1dL2csICcnKVxyXG4gICAgICAgIC5yZXBsYWNlKC9bXFxzXy1dKy9nLCAnLScpXHJcbiAgICAgICAgLnJlcGxhY2UoL14tK3wtKyQvZywgJycpOyBcclxufVxyXG5cclxuZXhwb3J0IGxldCBjYXRlZ29yaWVzID0gW1xyXG4gICAge25hbWU6ICdXZWJzaXRlJywgdmFsdWU6ICd3ZWJzaXRlJywgc2VsZWN0ZWQ6IHRydWV9LFxyXG4gICAge25hbWU6ICdQbHVnaW4nLCB2YWx1ZTogJ3BsdWdpbid9LFxyXG4gICAge25hbWU6ICdNb2JpbGUgQXBwbGljYXRpb24nLCB2YWx1ZTogJ21vYmlsZSd9LFxyXG4gICAge25hbWU6ICdUaGVtZScsIHZhbHVlOiAndGhlbWUnfVxyXG5dO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNjcm9sbFRvcCA9ICgpID0+IHtcclxuICAgIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBpc0VtcHR5ID0gc3RyID0+IHtcclxuICAgIHJldHVybiB0eXBlb2Ygc3RyID09PSAnc3RyaW5nJyAmJiBzdHIudHJpbSgpID09PSAnJztcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBub3RFbXB0eSA9IHN0ciA9PiB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHN0ciA9PT0gJ3N0cmluZycgJiYgc3RyLnRyaW0oKSAhPT0gJyc7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3Qgc3RyaW5nSW5PYmplY3QgPSAoc3RyLCBvYmopID0+IHtcclxuICAgIHJldHVybiB0eXBlb2Ygc3RyID09PSAnc3RyaW5nJyAmJiBvYmogJiYgc3RyIGluIG9iaiB8fCBmYWxzZTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBpc1VybCA9IHN0ciA9PiB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHN0ciA9PT0gJ3N0cmluZycgJiYgKHN0ci5pbmRleE9mKCdodHRwOicpID49IDAgfHwgc3RyLmluZGV4T2YoJ2h0dHBzOicpID49IDApIHx8IGZhbHNlO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlcXVpcmVkRmllbGQgPSAoZmllbGQsIG1hcCkgPT4ge1xyXG4gICAgcmV0dXJuIGZpZWxkICYmIG1hcCAmJiBtYXAuaW5kZXhPZihmaWVsZCkgPj0gMCB8fCBmYWxzZTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBlcXVhbHMgPSAoYSwgYikgPT4ge1xyXG4gICAgcmV0dXJuIGEgPT09IGI7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290Ijoic3JjIn0=

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudmlyb25tZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUFBLGtCQUFlO1FBQ2IsS0FBSyxFQUFFLElBQUk7UUFDWCxPQUFPLEVBQUUsSUFBSTtLQUNkLENBQUMiLCJmaWxlIjoiZW52aXJvbm1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XHJcbiAgZGVidWc6IHRydWUsXHJcbiAgdGVzdGluZzogdHJ1ZVxyXG59O1xyXG4iXSwic291cmNlUm9vdCI6InNyYyJ9

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('home',["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "aurelia-router", "./api", "./services/user", "./common"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, aurelia_router_1, api_1, user_1, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Home = (function () {
        function Home(api, appService, ApplicationService, userService, ea, router) {
            this.currentCategory = null;
            this.categories = {
                all: { name: 'All', value: '', count: 0 },
                mobile: { name: 'Mobile', value: 'mobile', count: 0 },
                plugin: { name: 'Plugins', value: 'plugin', count: 0 },
                theme: { name: 'Themes', value: 'theme', count: 0 },
                website: { name: 'Websites', value: 'website', count: 0 }
            };
            this.projects = [];
            this.backupProjects = [];
            this.currentPage = 1;
            this.totalNumberOfPages = -1;
            this.currentSortMode = 'popular';
            this.api = api;
            this.appService = appService;
            this.userService = userService;
            this.ea = ea;
            this.router = router;
        }
        Home.prototype.canActivate = function (params) {
            var _this = this;
            var projectsPromise = new Promise(function (resolve, reject) {
                _this.api.getProjectsFromFirebase().then(function (projects) {
                    for (var key in projects) {
                        var project = projects[key];
                        if (typeof project.votes !== 'undefined') {
                            if (firebase.auth().currentUser) {
                                if (firebase.auth().currentUser.uid in project.votes) {
                                    project.currentUserHasVotedFor = true;
                                }
                            }
                            project.votes = Object.keys(project.votes).length;
                        }
                        else {
                            project.votes = 0;
                        }
                        _this.projects.push(project);
                    }
                    resolve(projects);
                });
            });
            return Promise.all([projectsPromise]);
        };
        Home.prototype.activate = function () {
            this.projects.sort(function (a, b) {
                return parseInt(b.votes, 10) - parseInt(a.votes, 10) || a.added - b.added;
            });
            this.getProjectCounts();
            this.currentCategory = this.categories.all;
        };
        Home.prototype.submission = function ($event) {
            this.ea.publish('submission');
        };
        Home.prototype.getProjectCounts = function () {
            if (this.projects.length) {
                for (var i = 0; i < this.projects.length; i++) {
                    var item = this.projects[i];
                    if (item && item.category) {
                        var navItem = this.categories[item.category];
                        if (navItem) {
                            navItem.count += 1;
                        }
                    }
                }
                this.categories.all.count = this.projects.length;
            }
        };
        Home.prototype.getRandomBackgroundColour = function (name) {
            return common_1.getColourFromHashedString(name);
        };
        Home.prototype.sortBy = function (type) {
            this.currentSortMode = type;
            if (type === 'popular') {
                this.sortByPopular();
            }
            else if (type === 'new') {
                this.sortByNewlyAdded();
            }
        };
        Home.prototype.sortByPopular = function () {
            this.projects.sort(function (a, b) {
                return parseInt(b.votes, 10) - parseInt(a.votes, 10) || a.added - b.added;
            });
        };
        Home.prototype.sortByNewlyAdded = function () {
            this.projects.sort(function (a, b) {
                return b.added - a.added;
            });
        };
        Home.prototype.filterCategory = function (category) {
            this.currentCategory = category;
            if (!this.backupProjects.length) {
                this.backupProjects = this.projects.slice(0);
            }
            if (category.value !== '') {
                this.projects = this.backupProjects.filter(function (project) {
                    return project.category === category.value;
                });
            }
            else {
                this.projects = this.backupProjects;
            }
        };
        Home.prototype.vote = function (evt, name) {
            if (this.userService.isLoggedIn) {
                var voteAction = 'add';
                this.projects.map(function (project) {
                    if (common_1.slugify(project.name) === common_1.slugify(name)) {
                        if (project.currentUserHasVotedFor) {
                            project.votes--;
                            project.currentUserHasVotedFor = false;
                            voteAction = 'remove';
                        }
                        else {
                            project.votes++;
                            project.currentUserHasVotedFor = true;
                        }
                    }
                    return project;
                });
                this.api.castVote(name, voteAction);
            }
            else {
                this.ea.publish('show.login-form');
            }
        };
        return Home;
    }());
    Home = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [api_1.Api, Object, Object, user_1.UserService, aurelia_event_aggregator_1.EventAggregator, aurelia_router_1.Router])
    ], Home);
    exports.Home = Home;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,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RUFBRSxDQUFDOzRCQUNoQixPQUFPLENBQUMsc0JBQXNCLEdBQUcsS0FBSyxDQUFDOzRCQUN2QyxVQUFVLEdBQUcsUUFBUSxDQUFDO3dCQUMxQixDQUFDO3dCQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNKLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQzs0QkFDaEIsT0FBTyxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQzt3QkFDMUMsQ0FBQztvQkFDTCxDQUFDO29CQUVELE1BQU0sQ0FBQyxPQUFPLENBQUM7Z0JBQ25CLENBQUMsQ0FBQyxDQUFDO2dCQUVILElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN4QyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUN2QyxDQUFDO1FBQ0wsQ0FBQztRQUNMLFdBQUM7SUFBRCxDQWxLQSxBQWtLQyxJQUFBO0lBbEtZLElBQUk7UUFEaEIsOEJBQVU7eUNBMEJVLFNBQUcsa0JBQStDLGtCQUFXLEVBQU0sMENBQWUsRUFBVSx1QkFBTTtPQXpCMUcsSUFBSSxDQWtLaEI7SUFsS1ksb0JBQUkiLCJmaWxlIjoiaG9tZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXV0b2luamVjdCwgY29tcHV0ZWRGcm9tfSBmcm9tICdhdXJlbGlhLWZyYW1ld29yayc7XHJcbmltcG9ydCB7RXZlbnRBZ2dyZWdhdG9yfSBmcm9tICdhdXJlbGlhLWV2ZW50LWFnZ3JlZ2F0b3InO1xyXG5pbXBvcnQge1JvdXRlcn0gZnJvbSAnYXVyZWxpYS1yb3V0ZXInO1xyXG5cclxuaW1wb3J0IHtBcGl9IGZyb20gJy4vYXBpJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvblNlcnZpY2V9IGZyb20gJy4vc2VydmljZXMvYXBwbGljYXRpb24nO1xyXG5pbXBvcnQge1VzZXJTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2VzL3VzZXInO1xyXG5pbXBvcnQge2dldENvbG91ckZyb21IYXNoZWRTdHJpbmcsIHNsdWdpZnl9IGZyb20gJy4vY29tbW9uJztcclxuXHJcbmRlY2xhcmUgdmFyIGZpcmViYXNlO1xyXG5cclxuQGF1dG9pbmplY3RcclxuZXhwb3J0IGNsYXNzIEhvbWUge1xyXG4gICAgcHJpdmF0ZSBhcGk6IEFwaTtcclxuICAgIHByaXZhdGUgYXBwU2VydmljZTogQXBwbGljYXRpb25TZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSB1c2VyU2VydmljZTogVXNlclNlcnZpY2U7XHJcbiAgICBwcml2YXRlIGVhOiBFdmVudEFnZ3JlZ2F0b3I7XHJcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyO1xyXG5cclxuICAgIHByaXZhdGUgY3VycmVudENhdGVnb3J5ID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIGNhdGVnb3JpZXMgPSB7XHJcbiAgICAgICAgYWxsOiB7bmFtZTogJ0FsbCcsIHZhbHVlOiAnJywgY291bnQ6IDB9LFxyXG4gICAgICAgIG1vYmlsZToge25hbWU6ICdNb2JpbGUnLCB2YWx1ZTogJ21vYmlsZScsIGNvdW50OiAwfSxcclxuICAgICAgICBwbHVnaW46IHtuYW1lOiAnUGx1Z2lucycsIHZhbHVlOiAncGx1Z2luJywgY291bnQ6IDB9LFxyXG4gICAgICAgIHRoZW1lOiB7bmFtZTogJ1RoZW1lcycsIHZhbHVlOiAndGhlbWUnLCBjb3VudDogMH0sXHJcbiAgICAgICAgd2Vic2l0ZToge25hbWU6ICdXZWJzaXRlcycsIHZhbHVlOiAnd2Vic2l0ZScsIGNvdW50OiAwfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHByb2plY3RzID0gW107XHJcbiAgICBwcml2YXRlIGJhY2t1cFByb2plY3RzID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBjdXJyZW50UGFnZTogbnVtYmVyID0gMTtcclxuICAgIHByaXZhdGUgdG90YWxOdW1iZXJPZlBhZ2VzOiBudW1iZXIgPSAtMTtcclxuXHJcbiAgICBwcml2YXRlIGN1cnJlbnRTb3J0TW9kZTogc3RyaW5nID0gJ3BvcHVsYXInO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFwaTogQXBpLCBhcHBTZXJ2aWNlLCBBcHBsaWNhdGlvblNlcnZpY2UsIHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZSwgZWE6IEV2ZW50QWdncmVnYXRvciwgcm91dGVyOiBSb3V0ZXIpIHtcclxuICAgICAgICB0aGlzLmFwaSA9IGFwaTtcclxuICAgICAgICB0aGlzLmFwcFNlcnZpY2UgPSBhcHBTZXJ2aWNlO1xyXG4gICAgICAgIHRoaXMudXNlclNlcnZpY2UgPSB1c2VyU2VydmljZTtcclxuICAgICAgICB0aGlzLmVhID0gZWE7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXIgPSByb3V0ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgY2FuQWN0aXZhdGUocGFyYW1zKSB7XHJcbiAgICAgICAgbGV0IHByb2plY3RzUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hcGkuZ2V0UHJvamVjdHNGcm9tRmlyZWJhc2UoKS50aGVuKHByb2plY3RzID0+IHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBwcm9qZWN0cykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9qZWN0ID0gcHJvamVjdHNba2V5XTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9qZWN0LnZvdGVzICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmlyZWJhc2UuYXV0aCgpLmN1cnJlbnRVc2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmlyZWJhc2UuYXV0aCgpLmN1cnJlbnRVc2VyLnVpZCBpbiBwcm9qZWN0LnZvdGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdC5jdXJyZW50VXNlckhhc1ZvdGVkRm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdC52b3RlcyA9IE9iamVjdC5rZXlzKHByb2plY3Qudm90ZXMpLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0LnZvdGVzID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0cy5wdXNoKHByb2plY3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJlc29sdmUocHJvamVjdHMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtwcm9qZWN0c1Byb21pc2VdKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAvLyBTb3J0IHRoZSBwcm9qZWN0cyBieSB0aGVpciB2b3RlIGNvdW50cyBpbiBkZXNjZW5kaW5nIG9yZGVyXHJcbiAgICAgICAgdGhpcy5wcm9qZWN0cy5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludChiLnZvdGVzLCAxMCkgLSBwYXJzZUludChhLnZvdGVzLCAxMCkgfHwgYS5hZGRlZCAtIGIuYWRkZWQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0UHJvamVjdENvdW50cygpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY3VycmVudENhdGVnb3J5ID0gdGhpcy5jYXRlZ29yaWVzLmFsbDtcclxuICAgIH1cclxuXHJcbiAgICBzdWJtaXNzaW9uKCRldmVudDogRXZlbnQpIHtcclxuICAgICAgICB0aGlzLmVhLnB1Ymxpc2goJ3N1Ym1pc3Npb24nKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcm9qZWN0Q291bnRzKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb2plY3RzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvamVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5wcm9qZWN0c1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSAmJiBpdGVtLmNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hdkl0ZW0gPSB0aGlzLmNhdGVnb3JpZXNbaXRlbS5jYXRlZ29yeV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuYXZJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdkl0ZW0uY291bnQgKz0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2F0ZWdvcmllcy5hbGwuY291bnQgPSB0aGlzLnByb2plY3RzLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UmFuZG9tQmFja2dyb3VuZENvbG91cihuYW1lKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gZ2V0Q29sb3VyRnJvbUhhc2hlZFN0cmluZyhuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzb3J0QnkodHlwZSkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFNvcnRNb2RlID0gdHlwZTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAodHlwZSA9PT0gJ3BvcHVsYXInKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc29ydEJ5UG9wdWxhcigpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ25ldycpIHtcclxuICAgICAgICAgICAgdGhpcy5zb3J0QnlOZXdseUFkZGVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNvcnRCeVBvcHVsYXIoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0cy5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludChiLnZvdGVzLCAxMCkgLSBwYXJzZUludChhLnZvdGVzLCAxMCkgfHwgYS5hZGRlZCAtIGIuYWRkZWQ7XHJcbiAgICAgICAgfSk7ICAgXHJcbiAgICB9XHJcblxyXG4gICAgc29ydEJ5TmV3bHlBZGRlZCgpIHtcclxuICAgICAgICB0aGlzLnByb2plY3RzLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGIuYWRkZWQgLSBhLmFkZGVkO1xyXG4gICAgICAgIH0pOyAgXHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyQ2F0ZWdvcnkoY2F0ZWdvcnkpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRDYXRlZ29yeSA9IGNhdGVnb3J5O1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuYmFja3VwUHJvamVjdHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIC8vIEJhY2t1cCBleGlzdGluZyBwcm9qZWN0c1xyXG4gICAgICAgICAgICB0aGlzLmJhY2t1cFByb2plY3RzID0gdGhpcy5wcm9qZWN0cy5zbGljZSgwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIHdlIGFyZSBub3Qgd2FudGluZyB0byBzaG93IGV2ZXJ5dGhpbmdcclxuICAgICAgICBpZiAoY2F0ZWdvcnkudmFsdWUgIT09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvamVjdHMgPSB0aGlzLmJhY2t1cFByb2plY3RzLmZpbHRlcihwcm9qZWN0ID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9qZWN0LmNhdGVnb3J5ID09PSBjYXRlZ29yeS52YWx1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0cyA9IHRoaXMuYmFja3VwUHJvamVjdHM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZvdGUoZXZ0LCBuYW1lKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudXNlclNlcnZpY2UuaXNMb2dnZWRJbikge1xyXG4gICAgICAgICAgICB2YXIgdm90ZUFjdGlvbiA9ICdhZGQnO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0cy5tYXAocHJvamVjdCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2x1Z2lmeShwcm9qZWN0Lm5hbWUpID09PSBzbHVnaWZ5KG5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2plY3QuY3VycmVudFVzZXJIYXNWb3RlZEZvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0LnZvdGVzLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3QuY3VycmVudFVzZXJIYXNWb3RlZEZvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2b3RlQWN0aW9uID0gJ3JlbW92ZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdC52b3RlcysrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0LmN1cnJlbnRVc2VySGFzVm90ZWRGb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvamVjdDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFwaS5jYXN0Vm90ZShuYW1lLCB2b3RlQWN0aW9uKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmVhLnB1Ymxpc2goJ3Nob3cubG9naW4tZm9ybScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6InNyYyJ9

define('main',["require", "exports", "./environment"], function (require, exports, environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBR0EsbUJBQTBCLE9BQWdCO1FBQ3hDLE9BQU8sQ0FBQyxHQUFHO2FBQ1IscUJBQXFCLEVBQUU7YUFDdkIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXhCLEVBQUUsQ0FBQyxDQUFDLHFCQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDbkMsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLHFCQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFFRCxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQU0sT0FBQSxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQWpCLENBQWlCLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBZEQsOEJBY0MiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QXVyZWxpYX0gZnJvbSAnYXVyZWxpYS1mcmFtZXdvcmsnXHJcbmltcG9ydCBlbnZpcm9ubWVudCBmcm9tICcuL2Vudmlyb25tZW50JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb25maWd1cmUoYXVyZWxpYTogQXVyZWxpYSkge1xyXG4gIGF1cmVsaWEudXNlXHJcbiAgICAuc3RhbmRhcmRDb25maWd1cmF0aW9uKClcclxuICAgIC5mZWF0dXJlKCdyZXNvdXJjZXMnKTtcclxuXHJcbiAgaWYgKGVudmlyb25tZW50LmRlYnVnKSB7XHJcbiAgICBhdXJlbGlhLnVzZS5kZXZlbG9wbWVudExvZ2dpbmcoKTtcclxuICB9XHJcblxyXG4gIGlmIChlbnZpcm9ubWVudC50ZXN0aW5nKSB7XHJcbiAgICBhdXJlbGlhLnVzZS5wbHVnaW4oJ2F1cmVsaWEtdGVzdGluZycpO1xyXG4gIH1cclxuXHJcbiAgYXVyZWxpYS5zdGFydCgpLnRoZW4oKCkgPT4gYXVyZWxpYS5zZXRSb290KCkpO1xyXG59XHJcbiJdLCJzb3VyY2VSb290Ijoic3JjIn0=

define('profile',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Profile = (function () {
        function Profile() {
        }
        Profile.prototype.canActivate = function (params) {
        };
        return Profile;
    }());
    exports.Profile = Profile;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBQUE7UUFBQTtRQU1BLENBQUM7UUFIQyw2QkFBVyxHQUFYLFVBQVksTUFBTTtRQUVsQixDQUFDO1FBQ0gsY0FBQztJQUFELENBTkEsQUFNQyxJQUFBO0lBTlksMEJBQU8iLCJmaWxlIjoicHJvZmlsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBQcm9maWxlIHtcclxuICBwcml2YXRlIHVzZXI6IGFueTtcclxuXHJcbiAgY2FuQWN0aXZhdGUocGFyYW1zKSB7XHJcblxyXG4gIH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6InNyYyJ9

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('view',["require", "exports", "aurelia-framework", "./api"], function (require, exports, aurelia_framework_1, api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var View = (function () {
        function View(api) {
            this.api = api;
        }
        View.prototype.canActivate = function (params) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (params && params.slug) {
                    _this.slug = params.slug;
                    _this.api.getProject(params.slug)
                        .then(function (project) {
                        _this.project = project;
                        _this.projectAdded = new Date(project.added).toDateString();
                        resolve(true);
                    });
                }
            });
        };
        return View;
    }());
    View = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [api_1.Api])
    ], View);
    exports.View = View;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBTUEsSUFBYSxJQUFJO1FBS2YsY0FBb0IsR0FBUTtZQUFSLFFBQUcsR0FBSCxHQUFHLENBQUs7UUFFNUIsQ0FBQztRQUVELDBCQUFXLEdBQVgsVUFBWSxNQUFNO1lBQWxCLGlCQWVDO1lBZEMsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07Z0JBQ2pDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDMUIsS0FBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO29CQUV4QixLQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO3lCQUM3QixJQUFJLENBQUMsVUFBQyxPQUFZO3dCQUNqQixLQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzt3QkFFdkIsS0FBSSxDQUFDLFlBQVksR0FBRyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBRTNELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDaEIsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUNILFdBQUM7SUFBRCxDQXpCQSxBQXlCQyxJQUFBO0lBekJZLElBQUk7UUFEaEIsOEJBQVU7eUNBTWdCLFNBQUc7T0FMakIsSUFBSSxDQXlCaEI7SUF6Qlksb0JBQUkiLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1dG9pbmplY3QgfSBmcm9tICdhdXJlbGlhLWZyYW1ld29yayc7XHJcbmltcG9ydCB7IFJlZGlyZWN0IH0gZnJvbSAnYXVyZWxpYS1yb3V0ZXInO1xyXG5cclxuaW1wb3J0IHsgQXBpIH0gZnJvbSAnLi9hcGknO1xyXG5cclxuQGF1dG9pbmplY3RcclxuZXhwb3J0IGNsYXNzIFZpZXcge1xyXG4gIHByaXZhdGUgc2x1Zzogc3RyaW5nO1xyXG4gIHByaXZhdGUgcHJvamVjdDtcclxuICBwcml2YXRlIHByb2plY3RBZGRlZDtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcGk6IEFwaSkge1xyXG5cclxuICB9XHJcblxyXG4gIGNhbkFjdGl2YXRlKHBhcmFtcykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgaWYgKHBhcmFtcyAmJiBwYXJhbXMuc2x1Zykge1xyXG4gICAgICAgIHRoaXMuc2x1ZyA9IHBhcmFtcy5zbHVnO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYXBpLmdldFByb2plY3QocGFyYW1zLnNsdWcpXHJcbiAgICAgICAgICAudGhlbigocHJvamVjdDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvamVjdCA9IHByb2plY3Q7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnByb2plY3RBZGRlZCA9IG5ldyBEYXRlKHByb2plY3QuYWRkZWQpLnRvRGF0ZVN0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiJzcmMifQ==

define('dashboard/dashboard',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Dashboard = (function () {
        function Dashboard() {
        }
        Dashboard.prototype.configureRouter = function (config, router) {
            config.map([
                { route: '', name: 'dashboard', moduleId: './home', title: 'Dashboard', nav: true },
                { route: 'submissions', name: 'submissions', moduleId: './submissions', title: 'Your Submissions', nav: true }
            ]);
            this.router = router;
        };
        return Dashboard;
    }());
    exports.Dashboard = Dashboard;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhc2hib2FyZC9kYXNoYm9hcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBRUE7UUFBQTtRQVdBLENBQUM7UUFSRyxtQ0FBZSxHQUFmLFVBQWdCLE1BQTJCLEVBQUUsTUFBYztZQUN2RCxNQUFNLENBQUMsR0FBRyxDQUFDO2dCQUNQLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO2dCQUNuRixFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBRSxrQkFBa0IsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO2FBQ2pILENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3pCLENBQUM7UUFDTCxnQkFBQztJQUFELENBWEEsQUFXQyxJQUFBO0lBWFksOEJBQVMiLCJmaWxlIjoiZGFzaGJvYXJkL2Rhc2hib2FyZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Um91dGVyQ29uZmlndXJhdGlvbiwgUm91dGVyfSBmcm9tICdhdXJlbGlhLXJvdXRlcic7XG5cbmV4cG9ydCBjbGFzcyBEYXNoYm9hcmQge1xuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXI7XG5cbiAgICBjb25maWd1cmVSb3V0ZXIoY29uZmlnOiBSb3V0ZXJDb25maWd1cmF0aW9uLCByb3V0ZXI6IFJvdXRlcikge1xuICAgICAgICBjb25maWcubWFwKFtcbiAgICAgICAgICAgIHsgcm91dGU6ICcnLCBuYW1lOiAnZGFzaGJvYXJkJywgbW9kdWxlSWQ6ICcuL2hvbWUnLCB0aXRsZTogJ0Rhc2hib2FyZCcsIG5hdjogdHJ1ZSB9LFxuICAgICAgICAgICAgeyByb3V0ZTogJ3N1Ym1pc3Npb25zJywgbmFtZTogJ3N1Ym1pc3Npb25zJywgbW9kdWxlSWQ6ICcuL3N1Ym1pc3Npb25zJywgdGl0bGU6ICdZb3VyIFN1Ym1pc3Npb25zJywgbmF2OiB0cnVlIH1cbiAgICAgICAgXSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnJvdXRlciA9IHJvdXRlcjtcbiAgICB9XG59XG4iXSwic291cmNlUm9vdCI6InNyYyJ9

define('dashboard/home',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Home = (function () {
        function Home() {
        }
        return Home;
    }());
    exports.Home = Home;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhc2hib2FyZC9ob21lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUFBO1FBQUE7UUFFQSxDQUFDO1FBQUQsV0FBQztJQUFELENBRkEsQUFFQyxJQUFBO0lBRlksb0JBQUkiLCJmaWxlIjoiZGFzaGJvYXJkL2hvbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgSG9tZSB7XG4gICAgXG59Il0sInNvdXJjZVJvb3QiOiJzcmMifQ==

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('dashboard/submissions',["require", "exports", "aurelia-dependency-injection", "../api"], function (require, exports, aurelia_dependency_injection_1, api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Submissions = (function () {
        function Submissions(api) {
            this.api = api;
            this.submissions = [];
            this.submission = null;
            this.editMode = false;
        }
        Submissions.prototype.determineActivationStrategy = function () {
            return 'replace';
        };
        Submissions.prototype.canActivate = function () {
            var _this = this;
            return this.api.getCurrentUserSubmissions().then(function (submissions) {
                _this.submissions = submissions;
                return true;
            });
        };
        Submissions.prototype.activate = function (params) {
            var _this = this;
            if (params.key !== undefined) {
                this.editMode = true;
                this.api.getSubmission(params.key).then(function (submission) { return _this.submission = submission; });
            }
        };
        Submissions.prototype.cancelEdit = function () {
            this.editMode = false;
        };
        return Submissions;
    }());
    Submissions = __decorate([
        aurelia_dependency_injection_1.autoinject,
        __metadata("design:paramtypes", [api_1.Api])
    ], Submissions);
    exports.Submissions = Submissions;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhc2hib2FyZC9zdWJtaXNzaW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFPQSxJQUFhLFdBQVc7UUFNcEIscUJBQW9CLEdBQVE7WUFBUixRQUFHLEdBQUgsR0FBRyxDQUFLO1lBSnBCLGdCQUFXLEdBQVUsRUFBRSxDQUFDO1lBQ3hCLGVBQVUsR0FBUSxJQUFJLENBQUM7WUFDdkIsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUlsQyxDQUFDO1FBRUQsaURBQTJCLEdBQTNCO1lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNyQixDQUFDO1FBRUQsaUNBQVcsR0FBWDtZQUFBLGlCQUtDO1lBSkcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxXQUFrQjtnQkFDaEUsS0FBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsOEJBQVEsR0FBUixVQUFTLE1BQU07WUFBZixpQkFNQztZQUxHLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBRXJCLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxVQUFVLElBQUksT0FBQSxLQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsRUFBNUIsQ0FBNEIsQ0FBQyxDQUFDO1lBQ3hGLENBQUM7UUFDTCxDQUFDO1FBRUQsZ0NBQVUsR0FBVjtZQUNJLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQzFCLENBQUM7UUFFTCxrQkFBQztJQUFELENBakNBLEFBaUNDLElBQUE7SUFqQ1ksV0FBVztRQUR2Qix5Q0FBVTt5Q0FPa0IsU0FBRztPQU5uQixXQUFXLENBaUN2QjtJQWpDWSxrQ0FBVyIsImZpbGUiOiJkYXNoYm9hcmQvc3VibWlzc2lvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdXRvaW5qZWN0IH0gZnJvbSAnYXVyZWxpYS1kZXBlbmRlbmN5LWluamVjdGlvbic7XG5pbXBvcnQgeyBUYXNrUXVldWUgfSBmcm9tICdhdXJlbGlhLXRhc2stcXVldWUnO1xuaW1wb3J0IHsgQXBpIH0gZnJvbSAnLi4vYXBpJztcblxuZGVjbGFyZSB2YXIgZmlyZWJhc2U7XG5cbkBhdXRvaW5qZWN0XG5leHBvcnQgY2xhc3MgU3VibWlzc2lvbnMge1xuXG4gICAgcHJpdmF0ZSBzdWJtaXNzaW9uczogYW55W10gPSBbXTtcbiAgICBwcml2YXRlIHN1Ym1pc3Npb246IGFueSA9IG51bGw7XG4gICAgcHJpdmF0ZSBlZGl0TW9kZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhcGk6IEFwaSkge1xuXG4gICAgfVxuXG4gICAgZGV0ZXJtaW5lQWN0aXZhdGlvblN0cmF0ZWd5KCkge1xuICAgICAgICByZXR1cm4gJ3JlcGxhY2UnO1xuICAgIH1cblxuICAgIGNhbkFjdGl2YXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hcGkuZ2V0Q3VycmVudFVzZXJTdWJtaXNzaW9ucygpLnRoZW4oKHN1Ym1pc3Npb25zOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdWJtaXNzaW9ucyA9IHN1Ym1pc3Npb25zO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFjdGl2YXRlKHBhcmFtcykge1xuICAgICAgICBpZiAocGFyYW1zLmtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmVkaXRNb2RlID0gdHJ1ZTtcblxuICAgICAgICAgICAgdGhpcy5hcGkuZ2V0U3VibWlzc2lvbihwYXJhbXMua2V5KS50aGVuKHN1Ym1pc3Npb24gPT4gdGhpcy5zdWJtaXNzaW9uID0gc3VibWlzc2lvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjYW5jZWxFZGl0KCkge1xuICAgICAgICB0aGlzLmVkaXRNb2RlID0gZmFsc2U7XG4gICAgfVxuXG59XG4iXSwic291cmNlUm9vdCI6InNyYyJ9

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('partials/thumbnail',["require", "exports", "aurelia-framework", "../services/user"], function (require, exports, aurelia_framework_1, user_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Thumbnail = (function () {
        function Thumbnail(userService) {
            this.userService = userService;
        }
        Thumbnail.prototype.handleClick = function (url, name) {
            if (window.clicky) {
                window.clicky.log(url, name);
            }
            return true;
        };
        Thumbnail.prototype.callVoteCallback = function (evt, name) {
            if (this.voteCallback) {
                this.voteCallback({
                    evt: evt,
                    name: name
                });
            }
        };
        return Thumbnail;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], Thumbnail.prototype, "project", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], Thumbnail.prototype, "voteCallback", void 0);
    Thumbnail = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.customElement('thumbnail'),
        __metadata("design:paramtypes", [user_1.UserService])
    ], Thumbnail);
    exports.Thumbnail = Thumbnail;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnRpYWxzL3RodW1ibmFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFNQSxJQUFhLFNBQVM7UUFNbEIsbUJBQVksV0FBd0I7WUFDaEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDbkMsQ0FBQztRQUVELCtCQUFXLEdBQVgsVUFBWSxHQUFHLEVBQUUsSUFBSTtZQUNqQixFQUFFLENBQUMsQ0FBTyxNQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDakIsTUFBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3hDLENBQUM7WUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRCxvQ0FBZ0IsR0FBaEIsVUFBaUIsR0FBRyxFQUFFLElBQUk7WUFDdEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxZQUFZLENBQUM7b0JBQ2QsR0FBRyxFQUFFLEdBQUc7b0JBQ1IsSUFBSSxFQUFFLElBQUk7aUJBQ2IsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztRQUNMLENBQUM7UUFFTCxnQkFBQztJQUFELENBM0JBLEFBMkJDLElBQUE7SUExQmE7UUFBVCw0QkFBUTs7OENBQVM7SUFDUjtRQUFULDRCQUFROzttREFBYztJQUZkLFNBQVM7UUFGckIsOEJBQVU7UUFDVixpQ0FBYSxDQUFDLFdBQVcsQ0FBQzt5Q0FPRSxrQkFBVztPQU4zQixTQUFTLENBMkJyQjtJQTNCWSw4QkFBUyIsImZpbGUiOiJwYXJ0aWFscy90aHVtYm5haWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2F1dG9pbmplY3QsIGJpbmRhYmxlLCBjdXN0b21FbGVtZW50fSBmcm9tICdhdXJlbGlhLWZyYW1ld29yayc7XHJcblxyXG5pbXBvcnQge1VzZXJTZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlcy91c2VyJztcclxuXHJcbkBhdXRvaW5qZWN0XHJcbkBjdXN0b21FbGVtZW50KCd0aHVtYm5haWwnKVxyXG5leHBvcnQgY2xhc3MgVGh1bWJuYWlsIHtcclxuICAgIEBiaW5kYWJsZSBwcm9qZWN0O1xyXG4gICAgQGJpbmRhYmxlIHZvdGVDYWxsYmFjaztcclxuXHJcbiAgICBwcml2YXRlIHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1c2VyU2VydmljZTogVXNlclNlcnZpY2UpIHtcclxuICAgICAgICB0aGlzLnVzZXJTZXJ2aWNlID0gdXNlclNlcnZpY2U7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlQ2xpY2sodXJsLCBuYW1lKSB7XHJcbiAgICAgICAgaWYgKCg8YW55PndpbmRvdykuY2xpY2t5KSB7XHJcbiAgICAgICAgICAgICg8YW55PndpbmRvdykuY2xpY2t5LmxvZyh1cmwsIG5hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgY2FsbFZvdGVDYWxsYmFjayhldnQsIG5hbWUpIHtcclxuICAgICAgICBpZiAodGhpcy52b3RlQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdGhpcy52b3RlQ2FsbGJhY2soe1xyXG4gICAgICAgICAgICAgICAgZXZ0OiBldnQsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiJzcmMifQ==

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config.globalResources([
            './value-converters/async-binding-behavior',
            './value-converters/object-keys',
            './value-converters/prettify'
        ]);
    }
    exports.configure = configure;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc291cmNlcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFFQSxtQkFBMEIsTUFBOEI7UUFDcEQsTUFBTSxDQUFDLGVBQWUsQ0FBQztZQUNuQiwyQ0FBMkM7WUFDM0MsZ0NBQWdDO1lBQ2hDLDZCQUE2QjtTQUNoQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBTkQsOEJBTUMiLCJmaWxlIjoicmVzb3VyY2VzL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtGcmFtZXdvcmtDb25maWd1cmF0aW9ufSBmcm9tICdhdXJlbGlhLWZyYW1ld29yayc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29uZmlndXJlKGNvbmZpZzogRnJhbWV3b3JrQ29uZmlndXJhdGlvbikge1xyXG4gICAgY29uZmlnLmdsb2JhbFJlc291cmNlcyhbXHJcbiAgICAgICAgJy4vdmFsdWUtY29udmVydGVycy9hc3luYy1iaW5kaW5nLWJlaGF2aW9yJyxcclxuICAgICAgICAnLi92YWx1ZS1jb252ZXJ0ZXJzL29iamVjdC1rZXlzJyxcclxuICAgICAgICAnLi92YWx1ZS1jb252ZXJ0ZXJzL3ByZXR0aWZ5J1xyXG4gICAgXSk7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiJzcmMifQ==

define('services/application',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ApplicationService = (function () {
        function ApplicationService() {
            this.loading = false;
        }
        return ApplicationService;
    }());
    exports.ApplicationService = ApplicationService;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL2FwcGxpY2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUFBO1FBQUE7WUFDSSxZQUFPLEdBQVksS0FBSyxDQUFDO1FBQzdCLENBQUM7UUFBRCx5QkFBQztJQUFELENBRkEsQUFFQyxJQUFBO0lBRlksZ0RBQWtCIiwiZmlsZSI6InNlcnZpY2VzL2FwcGxpY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uU2VydmljZSB7XHJcbiAgICBsb2FkaW5nOiBib29sZWFuID0gZmFsc2U7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiJzcmMifQ==

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('services/user',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UserService = (function () {
        function UserService() {
            var _this = this;
            this.userLoggedIn = false;
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    _this.userLoggedIn = true;
                }
                else {
                    _this.userLoggedIn = false;
                }
            });
        }
        UserService.prototype.login = function (email, password) {
            return firebase.auth().signInWithEmailAndPassword(email, password);
        };
        UserService.prototype.register = function (email, password) {
            return firebase.auth().createUserWithEmailAndPassword(email, password);
        };
        Object.defineProperty(UserService.prototype, "isLoggedIn", {
            get: function () {
                return this.userLoggedIn;
            },
            enumerable: true,
            configurable: true
        });
        UserService.prototype.getLoggedInUser = function () {
            return firebase.auth().currentUser;
        };
        UserService.prototype.logout = function () {
            return firebase.auth().signOut();
        };
        return UserService;
    }());
    __decorate([
        aurelia_framework_1.computedFrom('userLoggedIn'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], UserService.prototype, "isLoggedIn", null);
    UserService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [])
    ], UserService);
    exports.UserService = UserService;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL3VzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBS0EsSUFBYSxXQUFXO1FBR3BCO1lBQUEsaUJBUUM7WUFWRCxpQkFBWSxHQUFZLEtBQUssQ0FBQztZQUcxQixRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsa0JBQWtCLENBQUMsVUFBQSxJQUFJO2dCQUNuQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNQLEtBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2dCQUM3QixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLEtBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO2dCQUM5QixDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsMkJBQUssR0FBTCxVQUFNLEtBQUssRUFBRSxRQUFRO1lBQ2pCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsMEJBQTBCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZFLENBQUM7UUFFRCw4QkFBUSxHQUFSLFVBQVMsS0FBSyxFQUFFLFFBQVE7WUFDcEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyw4QkFBOEIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDM0UsQ0FBQztRQUdELHNCQUFJLG1DQUFVO2lCQUFkO2dCQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQzdCLENBQUM7OztXQUFBO1FBRUQscUNBQWUsR0FBZjtZQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDO1FBQ3ZDLENBQUM7UUFFRCw0QkFBTSxHQUFOO1lBQ0ksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNyQyxDQUFDO1FBQ0wsa0JBQUM7SUFBRCxDQWpDQSxBQWlDQyxJQUFBO0lBWEc7UUFEQyxnQ0FBWSxDQUFDLGNBQWMsQ0FBQzs7O2lEQUc1QjtJQXhCUSxXQUFXO1FBRHZCLDhCQUFVOztPQUNFLFdBQVcsQ0FpQ3ZCO0lBakNZLGtDQUFXIiwiZmlsZSI6InNlcnZpY2VzL3VzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIHZhciBmaXJlYmFzZTtcclxuXHJcbmltcG9ydCB7Y29tcHV0ZWRGcm9tLCBhdXRvaW5qZWN0fSBmcm9tICdhdXJlbGlhLWZyYW1ld29yayc7XHJcblxyXG5AYXV0b2luamVjdFxyXG5leHBvcnQgY2xhc3MgVXNlclNlcnZpY2Uge1xyXG4gICAgdXNlckxvZ2dlZEluOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgZmlyZWJhc2UuYXV0aCgpLm9uQXV0aFN0YXRlQ2hhbmdlZCh1c2VyID0+IHtcclxuICAgICAgICAgICAgaWYgKHVzZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXNlckxvZ2dlZEluID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXNlckxvZ2dlZEluID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbihlbWFpbCwgcGFzc3dvcmQpIHtcclxuICAgICAgICByZXR1cm4gZmlyZWJhc2UuYXV0aCgpLnNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkKGVtYWlsLCBwYXNzd29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVnaXN0ZXIoZW1haWwsIHBhc3N3b3JkKSB7XHJcbiAgICAgICAgcmV0dXJuIGZpcmViYXNlLmF1dGgoKS5jcmVhdGVVc2VyV2l0aEVtYWlsQW5kUGFzc3dvcmQoZW1haWwsIHBhc3N3b3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBAY29tcHV0ZWRGcm9tKCd1c2VyTG9nZ2VkSW4nKVxyXG4gICAgZ2V0IGlzTG9nZ2VkSW4oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlckxvZ2dlZEluO1xyXG4gICAgfVxyXG5cclxuICAgIGdldExvZ2dlZEluVXNlcigpIHtcclxuICAgICAgICByZXR1cm4gZmlyZWJhc2UuYXV0aCgpLmN1cnJlbnRVc2VyO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ291dCgpIHtcclxuICAgICAgICByZXR1cm4gZmlyZWJhc2UuYXV0aCgpLnNpZ25PdXQoKTtcclxuICAgIH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6InNyYyJ9

define('resources/value-converters/async-binding-behavior',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AsyncBindingBehavior = (function () {
        function AsyncBindingBehavior() {
        }
        AsyncBindingBehavior.prototype.bind = function (binding, source, busymessage) {
            binding.originalupdateTarget = binding.updateTarget;
            binding.updateTarget = function (a) {
                if (typeof a.then === 'function') {
                    if (busymessage)
                        binding.originalupdateTarget(busymessage);
                    a.then(function (d) { binding.originalupdateTarget(d); });
                }
                else
                    binding.originalupdateTarget(a);
            };
        };
        AsyncBindingBehavior.prototype.unbind = function (binding) {
            binding.updateTarget = binding.originalupdateTarget;
            binding.originalupdateTarget = null;
        };
        return AsyncBindingBehavior;
    }());
    exports.AsyncBindingBehavior = AsyncBindingBehavior;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc291cmNlcy92YWx1ZS1jb252ZXJ0ZXJzL2FzeW5jLWJpbmRpbmctYmVoYXZpb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBQUE7UUFBQTtRQW1CQSxDQUFDO1FBakJDLG1DQUFJLEdBQUosVUFBSyxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVc7WUFDL0IsT0FBTyxDQUFDLG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7WUFDcEQsT0FBTyxDQUFDLFlBQVksR0FBRyxVQUFDLENBQUM7Z0JBQ3ZCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUNqQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUM7d0JBQ2QsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUM1QyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFNLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxDQUFDO2dCQUNELElBQUk7b0JBQ0YsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25DLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxxQ0FBTSxHQUFOLFVBQU8sT0FBTztZQUNaLE9BQU8sQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDO1lBQ3BELE9BQU8sQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7UUFDdEMsQ0FBQztRQUNILDJCQUFDO0lBQUQsQ0FuQkEsQUFtQkMsSUFBQTtJQW5CWSxvREFBb0IiLCJmaWxlIjoicmVzb3VyY2VzL3ZhbHVlLWNvbnZlcnRlcnMvYXN5bmMtYmluZGluZy1iZWhhdmlvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBBc3luY0JpbmRpbmdCZWhhdmlvciB7XHJcbiBcclxuICBiaW5kKGJpbmRpbmcsIHNvdXJjZSwgYnVzeW1lc3NhZ2UpIHtcclxuICAgIGJpbmRpbmcub3JpZ2luYWx1cGRhdGVUYXJnZXQgPSBiaW5kaW5nLnVwZGF0ZVRhcmdldDtcclxuICAgIGJpbmRpbmcudXBkYXRlVGFyZ2V0ID0gKGEpID0+IHsgXHJcbiAgICAgIGlmICh0eXBlb2YgYS50aGVuID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgaWYgKGJ1c3ltZXNzYWdlKSBcclxuICAgICAgICAgIGJpbmRpbmcub3JpZ2luYWx1cGRhdGVUYXJnZXQoYnVzeW1lc3NhZ2UpO1xyXG4gICAgICAgIGEudGhlbihkID0+IHsgYmluZGluZy5vcmlnaW5hbHVwZGF0ZVRhcmdldChkKTsgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZVxyXG4gICAgICAgIGJpbmRpbmcub3JpZ2luYWx1cGRhdGVUYXJnZXQoYSk7XHJcbiAgICAgfTtcclxuICB9XHJcbiBcclxuICB1bmJpbmQoYmluZGluZykge1xyXG4gICAgYmluZGluZy51cGRhdGVUYXJnZXQgPSBiaW5kaW5nLm9yaWdpbmFsdXBkYXRlVGFyZ2V0O1xyXG4gICAgYmluZGluZy5vcmlnaW5hbHVwZGF0ZVRhcmdldCA9IG51bGw7XHJcbiAgfVxyXG59XHJcbiJdLCJzb3VyY2VSb290Ijoic3JjIn0=

define('resources/value-converters/object-keys',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ObjectKeysValueConverter = (function () {
        function ObjectKeysValueConverter() {
        }
        ObjectKeysValueConverter.prototype.toView = function (obj) {
            var temp = [];
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    temp.push(obj[prop]);
                }
            }
            return temp;
        };
        return ObjectKeysValueConverter;
    }());
    exports.ObjectKeysValueConverter = ObjectKeysValueConverter;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc291cmNlcy92YWx1ZS1jb252ZXJ0ZXJzL29iamVjdC1rZXlzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUFBO1FBQUE7UUFlQSxDQUFDO1FBZEcseUNBQU0sR0FBTixVQUFPLEdBQUc7WUFFTixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7WUFJZCxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDekIsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDTCwrQkFBQztJQUFELENBZkEsQUFlQyxJQUFBO0lBZlksNERBQXdCIiwiZmlsZSI6InJlc291cmNlcy92YWx1ZS1jb252ZXJ0ZXJzL29iamVjdC1rZXlzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIE9iamVjdEtleXNWYWx1ZUNvbnZlcnRlciB7XHJcbiAgICB0b1ZpZXcob2JqKSB7XHJcbiAgICAgICAgLy8gQ3JlYXRlIGEgdGVtcG9yYXJ5IGFycmF5IHRvIHBvcHVsYXRlIHdpdGggb2JqZWN0IGtleXNcclxuICAgICAgICBsZXQgdGVtcCA9IFtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEEgYmFzaWMgZm9yLi5pbiBsb29wIHRvIGdldCBvYmplY3QgcHJvcGVydGllc1xyXG4gICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL1N0YXRlbWVudHMvZm9yLi4uaW5cclxuICAgICAgICBmb3IgKGxldCBwcm9wIGluIG9iaikge1xyXG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wLnB1c2gob2JqW3Byb3BdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGVtcDtcclxuICAgIH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6InNyYyJ9

define('resources/value-converters/prettify',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PrettifyValueConverter = (function () {
        function PrettifyValueConverter() {
        }
        PrettifyValueConverter.prototype.toView = function (obj) {
            console.log(obj);
            var response = obj;
            try {
                response = JSON.stringify(obj);
            }
            catch (e) {
                response = obj;
            }
            return response;
        };
        return PrettifyValueConverter;
    }());
    exports.PrettifyValueConverter = PrettifyValueConverter;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc291cmNlcy92YWx1ZS1jb252ZXJ0ZXJzL3ByZXR0aWZ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUFBO1FBQUE7UUFhQSxDQUFDO1FBWkcsdUNBQU0sR0FBTixVQUFPLEdBQUc7WUFDTixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQztZQUVuQixJQUFJLENBQUM7Z0JBQ0QsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkMsQ0FBQztZQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxHQUFHLEdBQUcsQ0FBQztZQUNuQixDQUFDO1lBRUQsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDO1FBQ0wsNkJBQUM7SUFBRCxDQWJBLEFBYUMsSUFBQTtJQWJZLHdEQUFzQiIsImZpbGUiOiJyZXNvdXJjZXMvdmFsdWUtY29udmVydGVycy9wcmV0dGlmeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBQcmV0dGlmeVZhbHVlQ29udmVydGVyIHtcclxuICAgIHRvVmlldyhvYmopIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhvYmopO1xyXG4gICAgICAgIHZhciByZXNwb25zZSA9IG9iajtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnN0cmluZ2lmeShvYmopO1xyXG4gICAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgICAgICByZXNwb25zZSA9IG9iajtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgIH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6InNyYyJ9

define('text!about.html', ['module'], function(module) { module.exports = "<template><div class=row><div class=\"col-xs-12 col-sm-8\"><h1>About Built With Aurelia</h1><p>Built With Aurelia is a simplistic showcase of all the great things the Aurelia community are doing. Whether it be a website, mobile application or a plugin, Built With Aurelia shows you what is possible with Aurelia.</p><p>The idea stemmed from there being no official source of who or what has been built with Aurelia. This site itself is built on Aurelia, it is using the Aurelia CLI and RequireJS, there are no 3rd party dependencies and the entire site is hosted on Github.</p></div></div></template>"; });
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=./app.css></require><require from=./partials/loader.html></require><require from=./partials/app-header.html></require><require from=./partials/app-footer.html></require><require from=./partials/modal.html></require><loader show.bind=\"router.isNavigating || appService.loading\"></loader><div class=\"hat ${showHat ? 'hat--active': ''}\"><a href=javascript:void(0); click.delegate=closeHat() class=close>X</a><div class=hat__inner if.bind=showHatLogin><h1 class=hat__title>Login</h1><p>To upvote submissions and other cool things, login here.<br>Not a member?<a href=javascript:void(0); click.delegate=register($event)>click here</a>to signup.</p><p if.bind=formMessage class=error-message innerhtml.bind=formMessage></p><form submit.delegate=handleLogin($event)><div class=form__row><input type=email name=email placeholder=Email value.bind=model.email></div><div class=form__row><input type=password name=password value.bind=model.password autocomplete=off></div><button type=submit class=button disabled.bind=\"!loginFormIsValid || disableButtons\">Login</button></form></div><div class=hat__inner if.bind=showHatRegister><h1 class=hat__title>Register</h1><p>Joining Built With Aurelia is quick and easy. Simply fill out the form below and you are on your way.<br>Already a member?<a href=javascript:void(0); click.delegate=login($event)>click here to login</a></p><p if.bind=formMessage class=error-message innerhtml.bind=formMessage></p><form submit.delegate=handleRegister($event)><div class=form__row><input type=email name=email placeholder=Email value.bind=model.email></div><div class=form__row><input type=password name=password placeholder=\"Enter a strong password\" value.bind=model.password autocomplete=off></div><div class=form__row><input type=password name=password2 placeholder=\"Re-enter your chosen password\" value.bind=model.password2 autocomplete=off></div><p if.bind=!passwordsMatch class=error-message>Please make sure both passwords match</p><button type=submit class=button disabled.two-way=\"!registerFormIsValid || disableButtons\">Register</button></form></div><div class=hat__inner if.bind=showHatSubmission><h1 class=hat__title>New Submission</h1><p>Make a new submission to the site. Just make sure you meet the criteria of it either being built using Aurelia or for Aurelia.</p><p if.bind=formMessage class=error-message innerhtml.bind=formMessage></p><form submit.delegate=handleSubmission($event)><div class=form__row><p><label>Project name<em>*</em></label>The name of this project.</p><input type=text name=name placeholder=\"Project name\" value.bind=model.name></div><div class=form__row><p><label>Project category<em>*</em></label>What kind of project are you submitting?</p><select name=category value.bind=model.category><option repeat.for=\"category of categories\" value.bind=category.value selected.bind=category.selected>${category.name}</option></select></div><div class=form__row><p><label>Where can this submission be seen?</label>If you are not providing a repository link, this field is required.</p><input type=text name=viewUrl placeholder=\"Demo/View URL\" value.bind=model.url></div><div class=form__row><p><label>Source code URL</label>If there is source code available, provide the link here to the Github/Bitbucket repository. Required if above URL field is empty.</p><input type=text name=repoUrl placeholder=\"Github/Bitbucket/Source control URL\" value.bind=model.repoUrl></div><div class=form__row><textarea name=description value.bind=model.description></textarea></div><div class=form__row><input type=text name=twitterHandle placeholder=@MyTwitterHandle value.bind=model.twitterHandle></div><button type=submit class=button disabled.bind=\"!submissionFormIsValid || disableButtons\">Submit</button></form></div></div><app-header user.bind=userService login-callback.call=login($event) logout-callback.call=logout($event) submission-callback.call=submission($event)></app-header><main id=content><div class=container><router-view id=main-content class=main-content></router-view></div></main><app-footer containerless></app-footer></template>"; });
define('text!app.css', ['module'], function(module) { module.exports = ".container-fluid,\n.container {\n  margin-right: auto;\n  margin-left: auto; }\n\n.container-fluid {\n  padding-right: 2rem;\n  padding-left: 2rem; }\n\n.row {\n  box-sizing: border-box;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 1 auto;\n  -ms-flex: 0 1 auto;\n  flex: 0 1 auto;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: row;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  -webkit-flex-wrap: wrap;\n  -ms-flex-wrap: wrap;\n  flex-wrap: wrap;\n  margin-right: -0.5rem;\n  margin-left: -0.5rem; }\n\n.row.reverse {\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: reverse;\n  -webkit-flex-direction: row-reverse;\n  -ms-flex-direction: row-reverse;\n  flex-direction: row-reverse; }\n\n.col.reverse {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: reverse;\n  -webkit-flex-direction: column-reverse;\n  -ms-flex-direction: column-reverse;\n  flex-direction: column-reverse; }\n\n.col-xs,\n.col-xs-1,\n.col-xs-2,\n.col-xs-3,\n.col-xs-4,\n.col-xs-5,\n.col-xs-6,\n.col-xs-7,\n.col-xs-8,\n.col-xs-9,\n.col-xs-10,\n.col-xs-11,\n.col-xs-12,\n.col-xs-offset-1,\n.col-xs-offset-2,\n.col-xs-offset-3,\n.col-xs-offset-4,\n.col-xs-offset-5,\n.col-xs-offset-6,\n.col-xs-offset-7,\n.col-xs-offset-8,\n.col-xs-offset-9,\n.col-xs-offset-10,\n.col-xs-offset-11,\n.col-xs-offset-12 {\n  box-sizing: border-box;\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 auto;\n  -ms-flex: 0 0 auto;\n  flex: 0 0 auto;\n  padding-right: 0.5rem;\n  padding-left: 0.5rem; }\n\n.col-xs {\n  -webkit-box-flex: 1;\n  -webkit-flex-grow: 1;\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n  -webkit-flex-basis: 0;\n  -ms-flex-preferred-size: 0;\n  flex-basis: 0;\n  max-width: 100%; }\n\n.col-xs-1 {\n  -webkit-flex-basis: 8.333%;\n  -ms-flex-preferred-size: 8.333%;\n  flex-basis: 8.333%;\n  max-width: 8.333%; }\n\n.col-xs-2 {\n  -webkit-flex-basis: 16.667%;\n  -ms-flex-preferred-size: 16.667%;\n  flex-basis: 16.667%;\n  max-width: 16.667%; }\n\n.col-xs-3 {\n  -webkit-flex-basis: 25%;\n  -ms-flex-preferred-size: 25%;\n  flex-basis: 25%;\n  max-width: 25%; }\n\n.col-xs-4 {\n  -webkit-flex-basis: 33.333%;\n  -ms-flex-preferred-size: 33.333%;\n  flex-basis: 33.333%;\n  max-width: 33.333%; }\n\n.col-xs-5 {\n  -webkit-flex-basis: 41.667%;\n  -ms-flex-preferred-size: 41.667%;\n  flex-basis: 41.667%;\n  max-width: 41.667%; }\n\n.col-xs-6 {\n  -webkit-flex-basis: 50%;\n  -ms-flex-preferred-size: 50%;\n  flex-basis: 50%;\n  max-width: 50%; }\n\n.col-xs-7 {\n  -webkit-flex-basis: 58.333%;\n  -ms-flex-preferred-size: 58.333%;\n  flex-basis: 58.333%;\n  max-width: 58.333%; }\n\n.col-xs-8 {\n  -webkit-flex-basis: 66.667%;\n  -ms-flex-preferred-size: 66.667%;\n  flex-basis: 66.667%;\n  max-width: 66.667%; }\n\n.col-xs-9 {\n  -webkit-flex-basis: 75%;\n  -ms-flex-preferred-size: 75%;\n  flex-basis: 75%;\n  max-width: 75%; }\n\n.col-xs-10 {\n  -webkit-flex-basis: 83.333%;\n  -ms-flex-preferred-size: 83.333%;\n  flex-basis: 83.333%;\n  max-width: 83.333%; }\n\n.col-xs-11 {\n  -webkit-flex-basis: 91.667%;\n  -ms-flex-preferred-size: 91.667%;\n  flex-basis: 91.667%;\n  max-width: 91.667%; }\n\n.col-xs-12 {\n  -webkit-flex-basis: 100%;\n  -ms-flex-preferred-size: 100%;\n  flex-basis: 100%;\n  max-width: 100%; }\n\n.col-xs-offset-1 {\n  margin-left: 8.333%; }\n\n.col-xs-offset-2 {\n  margin-left: 16.667%; }\n\n.col-xs-offset-3 {\n  margin-left: 25%; }\n\n.col-xs-offset-4 {\n  margin-left: 33.333%; }\n\n.col-xs-offset-5 {\n  margin-left: 41.667%; }\n\n.col-xs-offset-6 {\n  margin-left: 50%; }\n\n.col-xs-offset-7 {\n  margin-left: 58.333%; }\n\n.col-xs-offset-8 {\n  margin-left: 66.667%; }\n\n.col-xs-offset-9 {\n  margin-left: 75%; }\n\n.col-xs-offset-10 {\n  margin-left: 83.333%; }\n\n.col-xs-offset-11 {\n  margin-left: 91.667%; }\n\n.start-xs {\n  -webkit-box-pack: start;\n  -webkit-justify-content: flex-start;\n  -ms-flex-pack: start;\n  justify-content: flex-start;\n  text-align: start; }\n\n.center-xs {\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  text-align: center; }\n\n.end-xs {\n  -webkit-box-pack: end;\n  -webkit-justify-content: flex-end;\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n  text-align: end; }\n\n.top-xs {\n  -webkit-box-align: start;\n  -webkit-align-items: flex-start;\n  -ms-flex-align: start;\n  align-items: flex-start; }\n\n.middle-xs {\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center; }\n\n.bottom-xs {\n  -webkit-box-align: end;\n  -webkit-align-items: flex-end;\n  -ms-flex-align: end;\n  align-items: flex-end; }\n\n.around-xs {\n  -webkit-justify-content: space-around;\n  -ms-flex-pack: distribute;\n  justify-content: space-around; }\n\n.between-xs {\n  -webkit-box-pack: justify;\n  -webkit-justify-content: space-between;\n  -ms-flex-pack: justify;\n  justify-content: space-between; }\n\n.first-xs {\n  -webkit-box-ordinal-group: 0;\n  -webkit-order: -1;\n  -ms-flex-order: -1;\n  order: -1; }\n\n.last-xs {\n  -webkit-box-ordinal-group: 2;\n  -webkit-order: 1;\n  -ms-flex-order: 1;\n  order: 1; }\n\n@media only screen and (min-width: 48em) {\n  .container {\n    width: 49rem; }\n  .col-sm,\n  .col-sm-1,\n  .col-sm-2,\n  .col-sm-3,\n  .col-sm-4,\n  .col-sm-5,\n  .col-sm-6,\n  .col-sm-7,\n  .col-sm-8,\n  .col-sm-9,\n  .col-sm-10,\n  .col-sm-11,\n  .col-sm-12,\n  .col-sm-offset-1,\n  .col-sm-offset-2,\n  .col-sm-offset-3,\n  .col-sm-offset-4,\n  .col-sm-offset-5,\n  .col-sm-offset-6,\n  .col-sm-offset-7,\n  .col-sm-offset-8,\n  .col-sm-offset-9,\n  .col-sm-offset-10,\n  .col-sm-offset-11,\n  .col-sm-offset-12 {\n    box-sizing: border-box;\n    -webkit-box-flex: 0;\n    -webkit-flex: 0 0 auto;\n    -ms-flex: 0 0 auto;\n    flex: 0 0 auto;\n    padding-right: 0.5rem;\n    padding-left: 0.5rem; }\n  .col-sm {\n    -webkit-box-flex: 1;\n    -webkit-flex-grow: 1;\n    -ms-flex-positive: 1;\n    flex-grow: 1;\n    -webkit-flex-basis: 0;\n    -ms-flex-preferred-size: 0;\n    flex-basis: 0;\n    max-width: 100%; }\n  .col-sm-1 {\n    -webkit-flex-basis: 8.333%;\n    -ms-flex-preferred-size: 8.333%;\n    flex-basis: 8.333%;\n    max-width: 8.333%; }\n  .col-sm-2 {\n    -webkit-flex-basis: 16.667%;\n    -ms-flex-preferred-size: 16.667%;\n    flex-basis: 16.667%;\n    max-width: 16.667%; }\n  .col-sm-3 {\n    -webkit-flex-basis: 25%;\n    -ms-flex-preferred-size: 25%;\n    flex-basis: 25%;\n    max-width: 25%; }\n  .col-sm-4 {\n    -webkit-flex-basis: 33.333%;\n    -ms-flex-preferred-size: 33.333%;\n    flex-basis: 33.333%;\n    max-width: 33.333%; }\n  .col-sm-5 {\n    -webkit-flex-basis: 41.667%;\n    -ms-flex-preferred-size: 41.667%;\n    flex-basis: 41.667%;\n    max-width: 41.667%; }\n  .col-sm-6 {\n    -webkit-flex-basis: 50%;\n    -ms-flex-preferred-size: 50%;\n    flex-basis: 50%;\n    max-width: 50%; }\n  .col-sm-7 {\n    -webkit-flex-basis: 58.333%;\n    -ms-flex-preferred-size: 58.333%;\n    flex-basis: 58.333%;\n    max-width: 58.333%; }\n  .col-sm-8 {\n    -webkit-flex-basis: 66.667%;\n    -ms-flex-preferred-size: 66.667%;\n    flex-basis: 66.667%;\n    max-width: 66.667%; }\n  .col-sm-9 {\n    -webkit-flex-basis: 75%;\n    -ms-flex-preferred-size: 75%;\n    flex-basis: 75%;\n    max-width: 75%; }\n  .col-sm-10 {\n    -webkit-flex-basis: 83.333%;\n    -ms-flex-preferred-size: 83.333%;\n    flex-basis: 83.333%;\n    max-width: 83.333%; }\n  .col-sm-11 {\n    -webkit-flex-basis: 91.667%;\n    -ms-flex-preferred-size: 91.667%;\n    flex-basis: 91.667%;\n    max-width: 91.667%; }\n  .col-sm-12 {\n    -webkit-flex-basis: 100%;\n    -ms-flex-preferred-size: 100%;\n    flex-basis: 100%;\n    max-width: 100%; }\n  .col-sm-offset-1 {\n    margin-left: 8.333%; }\n  .col-sm-offset-2 {\n    margin-left: 16.667%; }\n  .col-sm-offset-3 {\n    margin-left: 25%; }\n  .col-sm-offset-4 {\n    margin-left: 33.333%; }\n  .col-sm-offset-5 {\n    margin-left: 41.667%; }\n  .col-sm-offset-6 {\n    margin-left: 50%; }\n  .col-sm-offset-7 {\n    margin-left: 58.333%; }\n  .col-sm-offset-8 {\n    margin-left: 66.667%; }\n  .col-sm-offset-9 {\n    margin-left: 75%; }\n  .col-sm-offset-10 {\n    margin-left: 83.333%; }\n  .col-sm-offset-11 {\n    margin-left: 91.667%; }\n  .start-sm {\n    -webkit-box-pack: start;\n    -webkit-justify-content: flex-start;\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n    text-align: start; }\n  .center-sm {\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n    -ms-flex-pack: center;\n    justify-content: center;\n    text-align: center; }\n  .end-sm {\n    -webkit-box-pack: end;\n    -webkit-justify-content: flex-end;\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n    text-align: end; }\n  .top-sm {\n    -webkit-box-align: start;\n    -webkit-align-items: flex-start;\n    -ms-flex-align: start;\n    align-items: flex-start; }\n  .middle-sm {\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n    -ms-flex-align: center;\n    align-items: center; }\n  .bottom-sm {\n    -webkit-box-align: end;\n    -webkit-align-items: flex-end;\n    -ms-flex-align: end;\n    align-items: flex-end; }\n  .around-sm {\n    -webkit-justify-content: space-around;\n    -ms-flex-pack: distribute;\n    justify-content: space-around; }\n  .between-sm {\n    -webkit-box-pack: justify;\n    -webkit-justify-content: space-between;\n    -ms-flex-pack: justify;\n    justify-content: space-between; }\n  .first-sm {\n    -webkit-box-ordinal-group: 0;\n    -webkit-order: -1;\n    -ms-flex-order: -1;\n    order: -1; }\n  .last-sm {\n    -webkit-box-ordinal-group: 2;\n    -webkit-order: 1;\n    -ms-flex-order: 1;\n    order: 1; } }\n\n@media only screen and (min-width: 64em) {\n  .container {\n    width: 65rem; }\n  .col-md,\n  .col-md-1,\n  .col-md-2,\n  .col-md-3,\n  .col-md-4,\n  .col-md-5,\n  .col-md-6,\n  .col-md-7,\n  .col-md-8,\n  .col-md-9,\n  .col-md-10,\n  .col-md-11,\n  .col-md-12,\n  .col-md-offset-1,\n  .col-md-offset-2,\n  .col-md-offset-3,\n  .col-md-offset-4,\n  .col-md-offset-5,\n  .col-md-offset-6,\n  .col-md-offset-7,\n  .col-md-offset-8,\n  .col-md-offset-9,\n  .col-md-offset-10,\n  .col-md-offset-11,\n  .col-md-offset-12 {\n    box-sizing: border-box;\n    -webkit-box-flex: 0;\n    -webkit-flex: 0 0 auto;\n    -ms-flex: 0 0 auto;\n    flex: 0 0 auto;\n    padding-right: 0.5rem;\n    padding-left: 0.5rem; }\n  .col-md {\n    -webkit-box-flex: 1;\n    -webkit-flex-grow: 1;\n    -ms-flex-positive: 1;\n    flex-grow: 1;\n    -webkit-flex-basis: 0;\n    -ms-flex-preferred-size: 0;\n    flex-basis: 0;\n    max-width: 100%; }\n  .col-md-1 {\n    -webkit-flex-basis: 8.333%;\n    -ms-flex-preferred-size: 8.333%;\n    flex-basis: 8.333%;\n    max-width: 8.333%; }\n  .col-md-2 {\n    -webkit-flex-basis: 16.667%;\n    -ms-flex-preferred-size: 16.667%;\n    flex-basis: 16.667%;\n    max-width: 16.667%; }\n  .col-md-3 {\n    -webkit-flex-basis: 25%;\n    -ms-flex-preferred-size: 25%;\n    flex-basis: 25%;\n    max-width: 25%; }\n  .col-md-4 {\n    -webkit-flex-basis: 33.333%;\n    -ms-flex-preferred-size: 33.333%;\n    flex-basis: 33.333%;\n    max-width: 33.333%; }\n  .col-md-5 {\n    -webkit-flex-basis: 41.667%;\n    -ms-flex-preferred-size: 41.667%;\n    flex-basis: 41.667%;\n    max-width: 41.667%; }\n  .col-md-6 {\n    -webkit-flex-basis: 50%;\n    -ms-flex-preferred-size: 50%;\n    flex-basis: 50%;\n    max-width: 50%; }\n  .col-md-7 {\n    -webkit-flex-basis: 58.333%;\n    -ms-flex-preferred-size: 58.333%;\n    flex-basis: 58.333%;\n    max-width: 58.333%; }\n  .col-md-8 {\n    -webkit-flex-basis: 66.667%;\n    -ms-flex-preferred-size: 66.667%;\n    flex-basis: 66.667%;\n    max-width: 66.667%; }\n  .col-md-9 {\n    -webkit-flex-basis: 75%;\n    -ms-flex-preferred-size: 75%;\n    flex-basis: 75%;\n    max-width: 75%; }\n  .col-md-10 {\n    -webkit-flex-basis: 83.333%;\n    -ms-flex-preferred-size: 83.333%;\n    flex-basis: 83.333%;\n    max-width: 83.333%; }\n  .col-md-11 {\n    -webkit-flex-basis: 91.667%;\n    -ms-flex-preferred-size: 91.667%;\n    flex-basis: 91.667%;\n    max-width: 91.667%; }\n  .col-md-12 {\n    -webkit-flex-basis: 100%;\n    -ms-flex-preferred-size: 100%;\n    flex-basis: 100%;\n    max-width: 100%; }\n  .col-md-offset-1 {\n    margin-left: 8.333%; }\n  .col-md-offset-2 {\n    margin-left: 16.667%; }\n  .col-md-offset-3 {\n    margin-left: 25%; }\n  .col-md-offset-4 {\n    margin-left: 33.333%; }\n  .col-md-offset-5 {\n    margin-left: 41.667%; }\n  .col-md-offset-6 {\n    margin-left: 50%; }\n  .col-md-offset-7 {\n    margin-left: 58.333%; }\n  .col-md-offset-8 {\n    margin-left: 66.667%; }\n  .col-md-offset-9 {\n    margin-left: 75%; }\n  .col-md-offset-10 {\n    margin-left: 83.333%; }\n  .col-md-offset-11 {\n    margin-left: 91.667%; }\n  .start-md {\n    -webkit-box-pack: start;\n    -webkit-justify-content: flex-start;\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n    text-align: start; }\n  .center-md {\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n    -ms-flex-pack: center;\n    justify-content: center;\n    text-align: center; }\n  .end-md {\n    -webkit-box-pack: end;\n    -webkit-justify-content: flex-end;\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n    text-align: end; }\n  .top-md {\n    -webkit-box-align: start;\n    -webkit-align-items: flex-start;\n    -ms-flex-align: start;\n    align-items: flex-start; }\n  .middle-md {\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n    -ms-flex-align: center;\n    align-items: center; }\n  .bottom-md {\n    -webkit-box-align: end;\n    -webkit-align-items: flex-end;\n    -ms-flex-align: end;\n    align-items: flex-end; }\n  .around-md {\n    -webkit-justify-content: space-around;\n    -ms-flex-pack: distribute;\n    justify-content: space-around; }\n  .between-md {\n    -webkit-box-pack: justify;\n    -webkit-justify-content: space-between;\n    -ms-flex-pack: justify;\n    justify-content: space-between; }\n  .first-md {\n    -webkit-box-ordinal-group: 0;\n    -webkit-order: -1;\n    -ms-flex-order: -1;\n    order: -1; }\n  .last-md {\n    -webkit-box-ordinal-group: 2;\n    -webkit-order: 1;\n    -ms-flex-order: 1;\n    order: 1; } }\n\n@media only screen and (min-width: 75em) {\n  .container {\n    width: 76rem; }\n  .col-lg,\n  .col-lg-1,\n  .col-lg-2,\n  .col-lg-3,\n  .col-lg-4,\n  .col-lg-5,\n  .col-lg-6,\n  .col-lg-7,\n  .col-lg-8,\n  .col-lg-9,\n  .col-lg-10,\n  .col-lg-11,\n  .col-lg-12,\n  .col-lg-offset-1,\n  .col-lg-offset-2,\n  .col-lg-offset-3,\n  .col-lg-offset-4,\n  .col-lg-offset-5,\n  .col-lg-offset-6,\n  .col-lg-offset-7,\n  .col-lg-offset-8,\n  .col-lg-offset-9,\n  .col-lg-offset-10,\n  .col-lg-offset-11,\n  .col-lg-offset-12 {\n    box-sizing: border-box;\n    -webkit-box-flex: 0;\n    -webkit-flex: 0 0 auto;\n    -ms-flex: 0 0 auto;\n    flex: 0 0 auto;\n    padding-right: 0.5rem;\n    padding-left: 0.5rem; }\n  .col-lg {\n    -webkit-box-flex: 1;\n    -webkit-flex-grow: 1;\n    -ms-flex-positive: 1;\n    flex-grow: 1;\n    -webkit-flex-basis: 0;\n    -ms-flex-preferred-size: 0;\n    flex-basis: 0;\n    max-width: 100%; }\n  .col-lg-1 {\n    -webkit-flex-basis: 8.333%;\n    -ms-flex-preferred-size: 8.333%;\n    flex-basis: 8.333%;\n    max-width: 8.333%; }\n  .col-lg-2 {\n    -webkit-flex-basis: 16.667%;\n    -ms-flex-preferred-size: 16.667%;\n    flex-basis: 16.667%;\n    max-width: 16.667%; }\n  .col-lg-3 {\n    -webkit-flex-basis: 25%;\n    -ms-flex-preferred-size: 25%;\n    flex-basis: 25%;\n    max-width: 25%; }\n  .col-lg-4 {\n    -webkit-flex-basis: 33.333%;\n    -ms-flex-preferred-size: 33.333%;\n    flex-basis: 33.333%;\n    max-width: 33.333%; }\n  .col-lg-5 {\n    -webkit-flex-basis: 41.667%;\n    -ms-flex-preferred-size: 41.667%;\n    flex-basis: 41.667%;\n    max-width: 41.667%; }\n  .col-lg-6 {\n    -webkit-flex-basis: 50%;\n    -ms-flex-preferred-size: 50%;\n    flex-basis: 50%;\n    max-width: 50%; }\n  .col-lg-7 {\n    -webkit-flex-basis: 58.333%;\n    -ms-flex-preferred-size: 58.333%;\n    flex-basis: 58.333%;\n    max-width: 58.333%; }\n  .col-lg-8 {\n    -webkit-flex-basis: 66.667%;\n    -ms-flex-preferred-size: 66.667%;\n    flex-basis: 66.667%;\n    max-width: 66.667%; }\n  .col-lg-9 {\n    -webkit-flex-basis: 75%;\n    -ms-flex-preferred-size: 75%;\n    flex-basis: 75%;\n    max-width: 75%; }\n  .col-lg-10 {\n    -webkit-flex-basis: 83.333%;\n    -ms-flex-preferred-size: 83.333%;\n    flex-basis: 83.333%;\n    max-width: 83.333%; }\n  .col-lg-11 {\n    -webkit-flex-basis: 91.667%;\n    -ms-flex-preferred-size: 91.667%;\n    flex-basis: 91.667%;\n    max-width: 91.667%; }\n  .col-lg-12 {\n    -webkit-flex-basis: 100%;\n    -ms-flex-preferred-size: 100%;\n    flex-basis: 100%;\n    max-width: 100%; }\n  .col-lg-offset-1 {\n    margin-left: 8.333%; }\n  .col-lg-offset-2 {\n    margin-left: 16.667%; }\n  .col-lg-offset-3 {\n    margin-left: 25%; }\n  .col-lg-offset-4 {\n    margin-left: 33.333%; }\n  .col-lg-offset-5 {\n    margin-left: 41.667%; }\n  .col-lg-offset-6 {\n    margin-left: 50%; }\n  .col-lg-offset-7 {\n    margin-left: 58.333%; }\n  .col-lg-offset-8 {\n    margin-left: 66.667%; }\n  .col-lg-offset-9 {\n    margin-left: 75%; }\n  .col-lg-offset-10 {\n    margin-left: 83.333%; }\n  .col-lg-offset-11 {\n    margin-left: 91.667%; }\n  .start-lg {\n    -webkit-box-pack: start;\n    -webkit-justify-content: flex-start;\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n    text-align: start; }\n  .center-lg {\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n    -ms-flex-pack: center;\n    justify-content: center;\n    text-align: center; }\n  .end-lg {\n    -webkit-box-pack: end;\n    -webkit-justify-content: flex-end;\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n    text-align: end; }\n  .top-lg {\n    -webkit-box-align: start;\n    -webkit-align-items: flex-start;\n    -ms-flex-align: start;\n    align-items: flex-start; }\n  .middle-lg {\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n    -ms-flex-align: center;\n    align-items: center; }\n  .bottom-lg {\n    -webkit-box-align: end;\n    -webkit-align-items: flex-end;\n    -ms-flex-align: end;\n    align-items: flex-end; }\n  .around-lg {\n    -webkit-justify-content: space-around;\n    -ms-flex-pack: distribute;\n    justify-content: space-around; }\n  .between-lg {\n    -webkit-box-pack: justify;\n    -webkit-justify-content: space-between;\n    -ms-flex-pack: justify;\n    justify-content: space-between; }\n  .first-lg {\n    -webkit-box-ordinal-group: 0;\n    -webkit-order: -1;\n    -ms-flex-order: -1;\n    order: -1; }\n  .last-lg {\n    -webkit-box-ordinal-group: 2;\n    -webkit-order: 1;\n    -ms-flex-order: 1;\n    order: 1; } }\n\n.blocks {\n  align-items: flex-start; }\n\n@media all and (min-width: 768px) {\n  .blocks__block {\n    margin-bottom: 15px; } }\n\n.thumbnail {\n  height: 320px; }\n  @media all and (min-width: 768px) {\n    .thumbnail {\n      border-left: 12px solid #FFF; } }\n  .thumbnail:hover > .thumbnail__pullover {\n    height: 100%; }\n  .thumbnail > a {\n    display: block;\n    height: 100%;\n    left: 0;\n    position: absolute;\n    top: 0;\n    width: 100%;\n    z-index: 100; }\n\n.thumbnail__pullover {\n  background: rgba(0, 0, 0, 0.8);\n  bottom: 0;\n  color: #FFF;\n  height: 0;\n  left: 0;\n  overflow: hidden;\n  position: absolute;\n  text-align: left;\n  transition: all 0.4s ease;\n  width: 100%;\n  z-index: 1000; }\n  .thumbnail__pullover .thumbnail__inner {\n    max-width: 80%;\n    text-align: left; }\n    .thumbnail__pullover .thumbnail__inner a:not(.button) {\n      text-decoration: underline; }\n\n@media all and (min-width: 768px) {\n  .blocks__block--large .thumbnail__pullover p {\n    font-size: 20px;\n    line-height: 26px; } }\n\n.thumbnail--large {\n  height: 320px; }\n  @media all and (min-width: 768px) {\n    .thumbnail--large {\n      height: 460px; }\n      .thumbnail--large .thumbnail__heading {\n        font-size: 46px; } }\n\n.thumbnail__inner {\n  color: #FFF;\n  left: 50%;\n  max-width: 50%;\n  position: absolute;\n  text-align: center;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  width: 100%; }\n  .thumbnail__inner p {\n    font-size: 14px;\n    line-height: 20px; }\n  .thumbnail__inner a {\n    color: #FFF; }\n\n.thumbnail__heading {\n  border-bottom: 2px solid rgba(255, 255, 255, 0.5);\n  font-size: 32px;\n  font-weight: bold;\n  margin: 0 0 12px 0;\n  padding-bottom: 8px; }\n\n.thumbnail__subheading {\n  font-size: 18px;\n  font-weight: 400;\n  margin: 0; }\n\n@media all and (min-width: 768px) {\n  #sidebar {\n    padding-top: 50px; } }\n\n.sidebar__section {\n  margin-bottom: 40px;\n  padding-left: 0.5rem;\n  padding-right: 0.5rem; }\n  @media all and (min-width: 768px) {\n    .sidebar__section {\n      padding-left: 0;\n      padding-right: 0; } }\n  .sidebar__section:last-child {\n    margin-bottom: 0; }\n\n.form-row {\n  margin-bottom: 15px; }\n\n.form-row__label {\n  display: block;\n  font-weight: bold;\n  margin-bottom: 8px; }\n\n.form-row input,\n.form-row textarea,\n.form-row select {\n  display: block;\n  padding: 10px;\n  width: 100%; }\n\n* {\n  background-repeat: no-repeat;\n  box-sizing: border-box;\n  position: relative; }\n\nimg {\n  height: auto;\n  max-width: 100%; }\n\na {\n  color: #00ccd2;\n  text-decoration: none; }\n\n.link--underlined {\n  text-decoration: underline; }\n\n.error-message {\n  color: red; }\n\nnav {\n  border-bottom: 1px solid #dadada;\n  margin-bottom: 22px;\n  margin-left: 6px;\n  padding-bottom: 20px;\n  padding-left: .5rem;\n  padding-right: .5rem;\n  text-align: center;\n  width: 100%; }\n  @media (min-width: 768px) {\n    nav {\n      margin-left: 0;\n      padding-left: 0;\n      padding-right: 0;\n      text-align: left; } }\n\nnav nav {\n  margin-bottom: 30px; }\n\nnav li, nav ul {\n  font-size: 0;\n  list-style: none;\n  margin: 0;\n  padding: 0; }\n\nnav li {\n  display: inline-block;\n  font-size: 18px;\n  margin-right: 12px; }\n  nav li:last-child {\n    margin-right: 0; }\n  nav li a {\n    color: #aaa;\n    display: block;\n    text-decoration: none; }\n    nav li a.active, nav li a:hover {\n      color: #000; }\n\n.text--bold {\n  font-weight: 700; }\n\n.text--right {\n  text-align: right; }\n\n.hat {\n  background-color: #333;\n  border-bottom: 2px solid #fff;\n  color: #fff;\n  height: 0;\n  overflow: hidden;\n  transition: all .5s ease; }\n\n.hat__title {\n  font-size: 42px;\n  margin-bottom: 12px; }\n\n.hat__inner {\n  margin: 0 auto;\n  padding: 0 30px; }\n  .hat__inner form {\n    border-top: 1px solid #aaa;\n    margin-top: 15px;\n    padding-top: 30px; }\n  @media (min-width: 768px) {\n    .hat__inner {\n      width: 50%; } }\n\n.hat--active {\n  height: auto;\n  overflow-y: auto;\n  padding-bottom: 20px; }\n  @media (min-width: 768px) {\n    .hat--active {\n      height: calc(100vh - 2px); } }\n\n.close {\n  color: #fff;\n  font-size: 32px;\n  font-weight: 300;\n  position: absolute;\n  right: 10px;\n  text-decoration: none;\n  top: 10px;\n  z-index: 2; }\n\nbody {\n  background-color: #fff;\n  color: #000;\n  font-family: proxima-nova,Helvetica,Arial,sans-serif;\n  margin: 0;\n  padding: 0; }\n\np {\n  font-size: 20px;\n  line-height: 28px; }\n\n.list {\n  list-style-position: inside;\n  margin-left: 0;\n  padding-left: 0; }\n\n.list__item {\n  margin: 0 0 8px; }\n\n.list--no-style, .list__item--no-style {\n  list-style: none; }\n\n#main-header {\n  background: #333;\n  color: #fff;\n  height: 65px;\n  line-height: 65px;\n  margin-bottom: 35px;\n  text-align: center; }\n  @media (min-width: 768px) {\n    #main-header {\n      text-align: left; } }\n  #main-header .col-sm-6:last-child {\n    display: none; }\n    @media (min-width: 768px) {\n      #main-header .col-sm-6:last-child {\n        display: initial; } }\n  #main-header a {\n    color: inherit; }\n\n.child-nav, .child-nav li {\n  list-style: none;\n  margin: 0;\n  padding: 0; }\n\n.child-nav {\n  border-bottom: 1px solid #00ccd2;\n  padding-bottom: 15px; }\n\n.child-nav li {\n  display: inline-block;\n  margin-right: 15px; }\n  .child-nav li.active {\n    font-weight: 700; }\n\n#logo {\n  font-size: 22px;\n  font-weight: 400;\n  margin: 0; }\n\n#main-content {\n  display: block; }\n  @media (min-width: 768px) {\n    #main-content {\n      padding-right: 30px; } }\n\npagination {\n  border-top: 1px solid #eaeaea;\n  display: flex;\n  margin-top: 20px;\n  padding-top: 20px; }\n\n.pagination__link {\n  margin-right: 10px; }\n\n#submission-iframe {\n  color: #000;\n  font-size: 22px;\n  height: 150vh;\n  width: 100%; }\n\n#main-footer {\n  border-top: 1px solid #eaeaea;\n  color: #333;\n  font-size: 12px;\n  margin-top: 60px;\n  padding-bottom: 20px;\n  padding-top: 20px; }\n\n.button {\n  background: none;\n  border: 1px solid #05babf;\n  color: #fff;\n  cursor: pointer;\n  display: inline-block;\n  font-size: 20px;\n  line-height: 1;\n  margin-right: 12px;\n  padding: 10px 20px;\n  transition: all .5s ease;\n  vertical-align: middle; }\n  .button:hover {\n    background-color: #05babf; }\n  .button:last-child {\n    margin-right: 0; }\n  .button:disabled {\n    cursor: not-allowed;\n    opacity: .3; }\n\n.button--dark {\n  color: #000; }\n  .button--dark:hover {\n    color: #fff; }\n\n.vote-buttons {\n  bottom: 0;\n  padding: 10px;\n  position: absolute;\n  right: 0;\n  z-index: 1; }\n  .vote-buttons a {\n    color: #e82887;\n    font-weight: 700;\n    transition: all 1s ease; }\n\n.vote--disabled {\n  cursor: not-allowed;\n  opacity: .3; }\n\n.fa-heart {\n  color: #e82887; }\n\n.form__row {\n  margin-bottom: 25px; }\n  .form__row p {\n    font-size: 12px;\n    line-height: 19px;\n    margin: 0 0 12px;\n    max-width: 350px; }\n    .form__row p label {\n      display: block;\n      font-size: 18px;\n      font-weight: 700;\n      line-height: 1;\n      margin-bottom: 5px; }\n      .form__row p label em {\n        color: red;\n        font-size: 11px;\n        font-style: inherit;\n        vertical-align: middle; }\n  .form__row input, .form__row select, .form__row textarea {\n    background: #fff;\n    border: none;\n    padding: 10px;\n    width: 100%; }\n    @media (min-width: 768px) {\n      .form__row input, .form__row select, .form__row textarea {\n        width: 375px; } }\n  .form__row textarea {\n    height: 150px; }\n\nmodal {\n  align-items: center;\n  background: rgba(0, 0, 0, 0.9);\n  display: flex;\n  justify-content: center;\n  height: 100vh;\n  left: 0;\n  position: fixed;\n  top: 0;\n  width: 100vw;\n  z-index: 3; }\n\n.modal__inner {\n  background: #fff;\n  padding: 20px;\n  width: 500px; }\n  .modal__inner h1, .modal__inner h2, .modal__inner h3, .modal__inner h4, .modal__inner h5, .modal__inner h6 {\n    font-weight: 400;\n    margin: 0 0 15px; }\n\n.bg--purple {\n  background-color: #646fc7; }\n\n.bg--grapefruit {\n  background-color: #e14840; }\n\n.bg--medium-blue {\n  background-color: #4e73aa; }\n\n.bg--bright-blue {\n  background-color: #00c3ff; }\n\n.bg--gentle-pink {\n  background-color: #ffc3cd; }\n\n.bg--teal {\n  background-color: #21ada4; }\n\n.bg--middle-blue {\n  background-color: #00a5c6; }\n\n.bg--light-cyan {\n  background-color: #1cd8e7; }\n\n.bg--brave-orange {\n  background-color: #ff794e; }\n\n.bg--yellow-its-me {\n  background-color: #fddc57; }\n\n.bg--green {\n  background-color: #6f9661; }\n\n.bg--pie {\n  background-color: #fdbe79; }\n\n.bg--dark {\n  background-color: #424242; }\n\n.bg--aurelia-pink {\n  background-color: #bc157a;\n  color: #fff; }\n"; });
define('text!home.html', ['module'], function(module) { module.exports = "<template><require from=resources/value-converters/object-keys></require><require from=partials/pagination.html></require><require from=partials/thumbnail></require><nav><ul><li repeat.for=\"category of categories | objectKeys\"><a href=javascript:void(0); class=\"${category == currentCategory ? 'active': ''}\" click.delegate=filterCategory(category)>${category.name}<span>(${category.count})</span></a></li></ul></nav><nav><ul><li><a href=javascript:void(0); class=\"${currentSortMode == 'popular' ? 'active' : ''}\" click.delegate=\"sortBy('popular')\">Popular</a></li><li><a href=javascript:void(0); class=\"${currentSortMode == 'new' ? 'active' : ''}\" click.delegate=\"sortBy('new')\">Newly Added</a></li></ul></nav><div class=\"blocks row\"><div id=no-results if.bind=\"!projects.length && !appService.loading\"><h2>Sorry, nothing was found :(</h2></div><template repeat.for=\"project of projects\"><template if.bind=\"$index == 1\"><div class=\"col-xs-12 col-sm-6 thumbnail blocks__block bg--dark\"><div class=thumbnail__inner><h1 class=thumbnail__heading>Built With Aurelia</h1><h2 class=thumbnail__subheading>A showcase of applications, plugins and resources developed for or using the Aurelia Javascript framework.<br><br><a href=javascript:void(0); click.delegate=submission() class=link--underlined>Make a Submission</a></h2></div></div></template><template if.bind=\"$index == 3\"><div class=\"col-xs-12 col-sm-6 thumbnail blocks__block bg--dark\"><div class=thumbnail__inner><h1 class=thumbnail__heading>Links</h1><ul class=list><li class=\"list__item list__item--no-style\"><a href=http://aurelia.io target=_blank>Aurelia Website</a></li><li class=\"list__item list__item--no-style\"><a href=http://aurelia.io/hub.html target=_blank>Aurelia Developer Hub</a></li><li class=\"list__item list__item--no-style\"><a href=https://github.com/aurelia target=_blank>Aurelia Github</a></li><li class=\"list__item list__item--no-style\"><a href=https://twitter.com/AureliaEffect target=_blank>Aurelia Twitter</a></li></ul></div></div></template><thumbnail class=\"blocks__block ${!$first ? getRandomBackgroundColour(project.name) : 'bg--aurelia-pink blocks__block--large'} ${$first ? 'col-xs-12 col-sm-12 thumbnail--large' : 'col-xs-12 col-sm-6'}\" project.bind=project vote-callback.call=\"vote(evt, name)\"></thumbnail></template></div></template>"; });
define('text!profile.html', ['module'], function(module) { module.exports = "<template><div class=row><div class=\"col-xs-12 col-sm-8\"><template if.bind=!editMode><h1>${user.name}</h1></template></div></div></template>"; });
define('text!view.html', ['module'], function(module) { module.exports = "<template><div class=row><div class=\"col-xs-12 col-sm-8\"><h1>${project.name}</h1><h4>Submitted: ${projectAdded}</h4><p innerhtml.bind=project.description></p></div></div></template>"; });
define('text!dashboard/dashboard.html', ['module'], function(module) { module.exports = "<template><ul class=child-nav><li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\"><a href.bind=row.href>${row.title}</a></li></ul><router-view></router-view></template>"; });
define('text!dashboard/home.html', ['module'], function(module) { module.exports = "<template><div class=row><div class=\"col-xs-12 col-sm-8\"><h1>Dashboard</h1><p>Manage your account and submissions here.</p></div></div></template>"; });
define('text!dashboard/submissions.html', ['module'], function(module) { module.exports = "<template><div class=row><div class=\"col-xs-12 col-sm-8\"><template if.bind=!editMode><h1>Your submissions</h1><p>Manage your Built With Aurelia submissions.</p><ul><li repeat.for=\"submission of submissions\"><a route-href=\"route: submissions; params.bind: {key: submission.objectKey}\">${submission.name & oneTime}</a></li></ul></template><template if.bind=editMode><h1>Edit ${submission.name}<a href=# click.delegate=cancelEdit()>cancel</a></h1></template></div></div></template>"; });
define('text!partials/app-footer.html', ['module'], function(module) { module.exports = "<template><footer id=main-footer><div class=container><div class=row><div class=col-sm-6>Built by&nbsp;<a href=http://ilikekillnerds.com target=_blank>Dwayne Charrington</a>&nbsp;&copy; 2017</div><div class=\"col-sm-6 text--right\"><small>Running on &nbsp;<a href=http://aurelia.io target=_blank>Aurelia</a></small></div></div></div></footer></template>"; });
define('text!partials/app-header.html', ['module'], function(module) { module.exports = "<template bindable=\"user, submissionCallback, loginCallback, logoutCallback\" containerless><header id=main-header><div class=container><div class=row><h1 id=logo class=\"col-xs-12 col-sm-6\"><a route-href=route:home>Built With Aurelia</a></h1><div class=\"col-sm-6 text--right\"><a href=javascript:void(0); class=text--bold click.delegate=submissionCallback()>Make a Submission</a><span>&nbsp;|&nbsp;</span><a href=javascript:void(0); if.bind=!user.isLoggedIn click.delegate=loginCallback()>Login/Register</a><a href=javascript:void(0); if.bind=user.isLoggedIn click.delegate=logoutCallback()>Logout</a><span>&nbsp;|&nbsp;</span><a route-href=\"route: about\">About</a><span>&nbsp;|&nbsp;</span><a href=mailto:dwaynecharrington@gmail.com>Contact</a></div></div></div></header></template>"; });
define('text!partials/loader.html', ['module'], function(module) { module.exports = "<template bindable=loading class=loader><div class=loader__inner><span class=loader__indicator></span><h2 class=ellipsis>Loading</h2></div></template>"; });
define('text!partials/modal.html', ['module'], function(module) { module.exports = "<template class=modal bindable=\"type, title, yesCallback, cancelCallback\"><div class=modal__inner><header class=modal__header><h1>${title}</h1></header><slot></slot><div class=modal__footer><a href=javascript:void(0); click.delegate=yesCallback() class=\"button button--dark\">Okay</a></div><template if.bind=\"type === 'confirm'\"><div class=modal__footer><a href=javascript:void(0); click.delegate=yesCallback() class=button>Okay</a><a href=javascript:void(0); click.delegate=cancelCallback() class=button>Cancel</a></div></template></div></template>"; });
define('text!partials/pagination.html', ['module'], function(module) { module.exports = "<template bindable=totalPages><a class=pagination__link route-href=\"route: home; params.bind: {page: i + 1}\" repeat.for=\"i of totalPages\">${i + 1}</a></template>"; });
define('text!partials/project.html', ['module'], function(module) { module.exports = "<template bindable=project><div class=\"project project--single\" with.bind=project><div class=row><div class=\"col-xs-12 col-sm-8\"><header><h1 class=\"project__name project__name--large\">${name}</h1><div class=\"project__border ${colour}\" if.bind=colour></div></header><div class=\"project__content project__content--black\"><p innerhtml.bind=description></p></div><a href=${url} class=button target=_blank>View</a><a if.bind=repoUrl href=${repoUrl} class=button target=_blank>Source Code</a></div></div></div></template>"; });
define('text!partials/thumbnail.html', ['module'], function(module) { module.exports = "<template class=thumbnail><template with.bind=project><div class=thumbnail__inner><h1 class=thumbnail__heading>${name}</h1><h2 class=thumbnail__subheading>${category}</h2></div><div class=thumbnail__pullover><div class=thumbnail__inner><p innerhtml.bind=description></p><a href=${url} class=button target=_blank click.delegate=\"handleClick(url, name)\">View</a><a if.bind=repoUrl href=${repoUrl} class=button target=_blank click.delegate=\"handleClick(repoUrl, name)\">Source Code</a></div><div class=vote-buttons><a href=javascript:void(0); class=\"vote ${!userService.isLoggedIn ? 'vote--disabled' : ''} fa ${currentUserHasVotedFor ? 'fa-heart': 'fa-heart-o'}\" aria-hidden=true click.delegate=\"callVoteCallback($event, name)\"></a><span>${votes}</span></div></div></template></template>"; });
//# sourceMappingURL=app-bundle.js.map