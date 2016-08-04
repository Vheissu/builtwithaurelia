var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('api',["require", "exports", 'aurelia-framework', 'aurelia-fetch-client'], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1) {
    "use strict";
    var Api = (function () {
        function Api(http) {
            this.http = http;
        }
        Api.prototype.getProjectImage = function (slug) {
            return this.http.fetch("https://raw.githubusercontent.com/Vheissu/builtwithaurelia-projects/master/images/" + slug)
                .then(function (response) { return response.text(); })
                .then(function (image) {
                return image;
            });
        };
        Api.prototype.paginate = function (page, maxPerPage, items) {
            var offset = (page - 1) * maxPerPage;
            var totalPages = Math.ceil(items.length / maxPerPage);
            return {
                items: (maxPerPage === -1) ? items : items.slice(offset, offset + maxPerPage),
                pages: totalPages
            };
        };
        Api.prototype.getProjects = function () {
            return this.http.fetch('https://raw.githubusercontent.com/Vheissu/builtwithaurelia-projects/master/projects.json')
                .then(function (response) { return response.json(); })
                .then(function (projects) {
                return projects;
            });
        };
        Api.prototype.getProject = function (slug) {
            var returnProject = null;
            return this.getProjects().then(function (projects) {
                projects.forEach(function (project) {
                    if (project.slug === slug) {
                        returnProject = project;
                    }
                });
                return returnProject;
            });
        };
        Api = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [aurelia_fetch_client_1.HttpClient])
        ], Api);
        return Api;
    }());
    exports.Api = Api;
});

define('app',["require", "exports"], function (require, exports) {
    "use strict";
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            config.title = 'Built With Aurelia';
            config.map([
                {
                    route: 'page/:page',
                    name: 'home',
                    nav: false,
                    title: 'Home',
                    viewPorts: {
                        default: { moduleId: './home' },
                        sidebar: { moduleId: './home-sidebar' }
                    }
                },
                {
                    route: '',
                    name: 'home_nopagination',
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
        };
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('home-sidebar',["require", "exports"], function (require, exports) {
    "use strict";
    var HomeSidebar = (function () {
        function HomeSidebar() {
        }
        return HomeSidebar;
    }());
    exports.HomeSidebar = HomeSidebar;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('home',["require", "exports", 'aurelia-framework', 'aurelia-router', './api'], function (require, exports, aurelia_framework_1, aurelia_router_1, api_1) {
    "use strict";
    var maxProjectsPerPage = 10;
    var Home = (function () {
        function Home(api, router) {
            this.currentCategory = null;
            this.categories = [
                { name: 'All', value: '' },
                { name: 'Plugins', value: 'plugin' },
                { name: 'Websites', value: 'website' }
            ];
            this.projects = [];
            this.backupProjects = [];
            this.currentPage = 1;
            this.totalNumberOfPages = -1;
            this.api = api;
            this.router = router;
        }
        Home.prototype.canActivate = function (params) {
            var _this = this;
            this.currentPage = params.page || 1;
            this.api.getProjects().then(function (projects) {
                if (projects.length) {
                    var paginated = _this.api.paginate(_this.currentPage, maxProjectsPerPage, projects);
                    _this.projects = paginated.items;
                    _this.totalNumberOfPages = paginated.pages;
                }
                else {
                    _this.router.navigate('/');
                }
            });
        };
        Home.prototype.activate = function () {
            this.currentCategory = this.categories[0];
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
        Home = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [api_1.Api, aurelia_router_1.Router])
        ], Home);
        return Home;
    }());
    exports.Home = Home;
});

define('main',["require", "exports", './environment'], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
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

define('submission',["require", "exports"], function (require, exports) {
    "use strict";
    var categories = [
        'website',
        'mobile',
        'plugin',
        'theme'
    ];
    var Submission = (function () {
        function Submission() {
            this.formValid = true;
            this.fields = {
                name: {
                    label: 'Submission Name:',
                    required: true,
                    isValid: true,
                    errorMessage: 'A project name is required',
                    value: ''
                },
                category: {
                    label: 'Category',
                    required: true,
                    isValid: true,
                    errorMessage: 'A category is required',
                    value: ''
                },
                description: {
                    label: 'Description',
                    required: true,
                    isValid: true,
                    errorMessage: 'Please enter a brief description',
                    value: ''
                },
                url: {
                    label: 'Url',
                    required: true,
                    rules: 'repoUrl == empty',
                    isValid: true,
                    errorMessage: 'Please enter a URL or fill the repository URL if this has no URL.',
                    value: ''
                },
                repoUrl: {
                    label: 'Repo Url',
                    required: true,
                    rules: 'url == empty',
                    isValid: true,
                    errorMessage: 'A repository URL is required if the Url field is not filled out.',
                    value: ''
                }
            };
        }
        Submission.prototype.handleSubmit = function () {
            var formValid = true;
            for (var field in this.fields) {
                var actualField = this.fields[field];
                var validField = this.validateFieldWithReturnBoolean(actualField);
                if (!validField) {
                    actualField.isValid = false;
                }
                if (formValid && !validField) {
                    formValid = false;
                }
            }
            this.formValid = formValid;
        };
        Submission.prototype.validateField = function (field) {
            field.isValid = this.validateFieldWithReturnBoolean(field);
        };
        Submission.prototype.validateFieldWithReturnBoolean = function (field) {
            var fieldIsValid = true;
            if (field.required) {
                if (!field.rules) {
                    if (fieldIsEmpty(field.value)) {
                        fieldIsValid = false;
                    }
                    else {
                        fieldIsValid = true;
                    }
                }
                else {
                    var rules = field.rules.split(' ');
                    if (rules[2] === 'empty') {
                        if (fieldIsEmpty(field.value) && fieldIsEmpty(this.fields[rules[0]].value)) {
                            fieldIsValid = false;
                        }
                        else {
                            fieldIsValid = true;
                        }
                    }
                }
            }
            return fieldIsValid;
        };
        return Submission;
    }());
    exports.Submission = Submission;
    function validCategorySupplied(category) {
        return categories.indexOf(category) !== -1;
    }
    function fieldIsEmpty(field) {
        return field.trim() === '';
    }
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('view',["require", "exports", 'aurelia-framework', './api'], function (require, exports, aurelia_framework_1, api_1) {
    "use strict";
    var View = (function () {
        function View(api) {
            this.api = api;
        }
        View.prototype.attached = function () {
            document.body.classList.add('single-view');
        };
        View.prototype.detached = function () {
            document.body.classList.remove('single-view');
        };
        View.prototype.activate = function (params, currentRoute) {
            var _this = this;
            if (params.slug) {
                this.api.getProject(params.slug).then(function (project) {
                    _this.project = project;
                    currentRoute.navModel.title = project.name;
                }).catch(function (e) {
                    console.error(e);
                });
            }
        };
        View = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [api_1.Api])
        ], View);
        return View;
    }());
    exports.View = View;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('text!app-footer.html', ['module'], function(module) { module.exports = "<template containerless>\n    <footer id=\"main-footer\">\n        <div class=\"container\">\n            <div class=\"row\">\n                <div class=\"col-sm-6\">Built by <a href=\"http://ilikekillnerds.com\" target=\"_blank\">Dwayne Charrington</a></div>\n                <div class=\"col-sm-6 text--right\"><small>Running on Aurelia <3 </small></div>\n            </div>\n        </div>\n    </footer>\n</template>\n"; });
define('text!app-header.html', ['module'], function(module) { module.exports = "<template containerless>\r\n\r\n    <header id=\"main-header\">\r\n        <div class=\"container\">\r\n            <div class=\"row\">\r\n                <h1 id=\"logo\" class=\"col-xs-12 col-sm-6\"><a route-href=\"route:home_nopagination\">Built With Aurelia</a></h1>\r\n                <div class=\"col-sm-6 text--right\">\r\n                    <a route-href=\"route: submission\">Make a Submission</a>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </header>\r\n\r\n</template>\r\n"; });
define('text!app.css', ['module'], function(module) { module.exports = ".container-fluid,\n.container {\n  margin-right: auto;\n  margin-left: auto; }\n\n.container-fluid {\n  padding-right: 2rem;\n  padding-left: 2rem; }\n\n.row {\n  box-sizing: border-box;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 1 auto;\n  -ms-flex: 0 1 auto;\n  flex: 0 1 auto;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: row;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  -webkit-flex-wrap: wrap;\n  -ms-flex-wrap: wrap;\n  flex-wrap: wrap;\n  margin-right: -0.5rem;\n  margin-left: -0.5rem; }\n\n.row.reverse {\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: reverse;\n  -webkit-flex-direction: row-reverse;\n  -ms-flex-direction: row-reverse;\n  flex-direction: row-reverse; }\n\n.col.reverse {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: reverse;\n  -webkit-flex-direction: column-reverse;\n  -ms-flex-direction: column-reverse;\n  flex-direction: column-reverse; }\n\n.col-xs,\n.col-xs-1,\n.col-xs-2,\n.col-xs-3,\n.col-xs-4,\n.col-xs-5,\n.col-xs-6,\n.col-xs-7,\n.col-xs-8,\n.col-xs-9,\n.col-xs-10,\n.col-xs-11,\n.col-xs-12,\n.col-xs-offset-1,\n.col-xs-offset-2,\n.col-xs-offset-3,\n.col-xs-offset-4,\n.col-xs-offset-5,\n.col-xs-offset-6,\n.col-xs-offset-7,\n.col-xs-offset-8,\n.col-xs-offset-9,\n.col-xs-offset-10,\n.col-xs-offset-11,\n.col-xs-offset-12 {\n  box-sizing: border-box;\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 auto;\n  -ms-flex: 0 0 auto;\n  flex: 0 0 auto;\n  padding-right: 0.5rem;\n  padding-left: 0.5rem; }\n\n.col-xs {\n  -webkit-box-flex: 1;\n  -webkit-flex-grow: 1;\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n  -webkit-flex-basis: 0;\n  -ms-flex-preferred-size: 0;\n  flex-basis: 0;\n  max-width: 100%; }\n\n.col-xs-1 {\n  -webkit-flex-basis: 8.333%;\n  -ms-flex-preferred-size: 8.333%;\n  flex-basis: 8.333%;\n  max-width: 8.333%; }\n\n.col-xs-2 {\n  -webkit-flex-basis: 16.667%;\n  -ms-flex-preferred-size: 16.667%;\n  flex-basis: 16.667%;\n  max-width: 16.667%; }\n\n.col-xs-3 {\n  -webkit-flex-basis: 25%;\n  -ms-flex-preferred-size: 25%;\n  flex-basis: 25%;\n  max-width: 25%; }\n\n.col-xs-4 {\n  -webkit-flex-basis: 33.333%;\n  -ms-flex-preferred-size: 33.333%;\n  flex-basis: 33.333%;\n  max-width: 33.333%; }\n\n.col-xs-5 {\n  -webkit-flex-basis: 41.667%;\n  -ms-flex-preferred-size: 41.667%;\n  flex-basis: 41.667%;\n  max-width: 41.667%; }\n\n.col-xs-6 {\n  -webkit-flex-basis: 50%;\n  -ms-flex-preferred-size: 50%;\n  flex-basis: 50%;\n  max-width: 50%; }\n\n.col-xs-7 {\n  -webkit-flex-basis: 58.333%;\n  -ms-flex-preferred-size: 58.333%;\n  flex-basis: 58.333%;\n  max-width: 58.333%; }\n\n.col-xs-8 {\n  -webkit-flex-basis: 66.667%;\n  -ms-flex-preferred-size: 66.667%;\n  flex-basis: 66.667%;\n  max-width: 66.667%; }\n\n.col-xs-9 {\n  -webkit-flex-basis: 75%;\n  -ms-flex-preferred-size: 75%;\n  flex-basis: 75%;\n  max-width: 75%; }\n\n.col-xs-10 {\n  -webkit-flex-basis: 83.333%;\n  -ms-flex-preferred-size: 83.333%;\n  flex-basis: 83.333%;\n  max-width: 83.333%; }\n\n.col-xs-11 {\n  -webkit-flex-basis: 91.667%;\n  -ms-flex-preferred-size: 91.667%;\n  flex-basis: 91.667%;\n  max-width: 91.667%; }\n\n.col-xs-12 {\n  -webkit-flex-basis: 100%;\n  -ms-flex-preferred-size: 100%;\n  flex-basis: 100%;\n  max-width: 100%; }\n\n.col-xs-offset-1 {\n  margin-left: 8.333%; }\n\n.col-xs-offset-2 {\n  margin-left: 16.667%; }\n\n.col-xs-offset-3 {\n  margin-left: 25%; }\n\n.col-xs-offset-4 {\n  margin-left: 33.333%; }\n\n.col-xs-offset-5 {\n  margin-left: 41.667%; }\n\n.col-xs-offset-6 {\n  margin-left: 50%; }\n\n.col-xs-offset-7 {\n  margin-left: 58.333%; }\n\n.col-xs-offset-8 {\n  margin-left: 66.667%; }\n\n.col-xs-offset-9 {\n  margin-left: 75%; }\n\n.col-xs-offset-10 {\n  margin-left: 83.333%; }\n\n.col-xs-offset-11 {\n  margin-left: 91.667%; }\n\n.start-xs {\n  -webkit-box-pack: start;\n  -webkit-justify-content: flex-start;\n  -ms-flex-pack: start;\n  justify-content: flex-start;\n  text-align: start; }\n\n.center-xs {\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  text-align: center; }\n\n.end-xs {\n  -webkit-box-pack: end;\n  -webkit-justify-content: flex-end;\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n  text-align: end; }\n\n.top-xs {\n  -webkit-box-align: start;\n  -webkit-align-items: flex-start;\n  -ms-flex-align: start;\n  align-items: flex-start; }\n\n.middle-xs {\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center; }\n\n.bottom-xs {\n  -webkit-box-align: end;\n  -webkit-align-items: flex-end;\n  -ms-flex-align: end;\n  align-items: flex-end; }\n\n.around-xs {\n  -webkit-justify-content: space-around;\n  -ms-flex-pack: distribute;\n  justify-content: space-around; }\n\n.between-xs {\n  -webkit-box-pack: justify;\n  -webkit-justify-content: space-between;\n  -ms-flex-pack: justify;\n  justify-content: space-between; }\n\n.first-xs {\n  -webkit-box-ordinal-group: 0;\n  -webkit-order: -1;\n  -ms-flex-order: -1;\n  order: -1; }\n\n.last-xs {\n  -webkit-box-ordinal-group: 2;\n  -webkit-order: 1;\n  -ms-flex-order: 1;\n  order: 1; }\n\n@media only screen and (min-width: 48em) {\n  .container {\n    width: 49rem; }\n  .col-sm,\n  .col-sm-1,\n  .col-sm-2,\n  .col-sm-3,\n  .col-sm-4,\n  .col-sm-5,\n  .col-sm-6,\n  .col-sm-7,\n  .col-sm-8,\n  .col-sm-9,\n  .col-sm-10,\n  .col-sm-11,\n  .col-sm-12,\n  .col-sm-offset-1,\n  .col-sm-offset-2,\n  .col-sm-offset-3,\n  .col-sm-offset-4,\n  .col-sm-offset-5,\n  .col-sm-offset-6,\n  .col-sm-offset-7,\n  .col-sm-offset-8,\n  .col-sm-offset-9,\n  .col-sm-offset-10,\n  .col-sm-offset-11,\n  .col-sm-offset-12 {\n    box-sizing: border-box;\n    -webkit-box-flex: 0;\n    -webkit-flex: 0 0 auto;\n    -ms-flex: 0 0 auto;\n    flex: 0 0 auto;\n    padding-right: 0.5rem;\n    padding-left: 0.5rem; }\n  .col-sm {\n    -webkit-box-flex: 1;\n    -webkit-flex-grow: 1;\n    -ms-flex-positive: 1;\n    flex-grow: 1;\n    -webkit-flex-basis: 0;\n    -ms-flex-preferred-size: 0;\n    flex-basis: 0;\n    max-width: 100%; }\n  .col-sm-1 {\n    -webkit-flex-basis: 8.333%;\n    -ms-flex-preferred-size: 8.333%;\n    flex-basis: 8.333%;\n    max-width: 8.333%; }\n  .col-sm-2 {\n    -webkit-flex-basis: 16.667%;\n    -ms-flex-preferred-size: 16.667%;\n    flex-basis: 16.667%;\n    max-width: 16.667%; }\n  .col-sm-3 {\n    -webkit-flex-basis: 25%;\n    -ms-flex-preferred-size: 25%;\n    flex-basis: 25%;\n    max-width: 25%; }\n  .col-sm-4 {\n    -webkit-flex-basis: 33.333%;\n    -ms-flex-preferred-size: 33.333%;\n    flex-basis: 33.333%;\n    max-width: 33.333%; }\n  .col-sm-5 {\n    -webkit-flex-basis: 41.667%;\n    -ms-flex-preferred-size: 41.667%;\n    flex-basis: 41.667%;\n    max-width: 41.667%; }\n  .col-sm-6 {\n    -webkit-flex-basis: 50%;\n    -ms-flex-preferred-size: 50%;\n    flex-basis: 50%;\n    max-width: 50%; }\n  .col-sm-7 {\n    -webkit-flex-basis: 58.333%;\n    -ms-flex-preferred-size: 58.333%;\n    flex-basis: 58.333%;\n    max-width: 58.333%; }\n  .col-sm-8 {\n    -webkit-flex-basis: 66.667%;\n    -ms-flex-preferred-size: 66.667%;\n    flex-basis: 66.667%;\n    max-width: 66.667%; }\n  .col-sm-9 {\n    -webkit-flex-basis: 75%;\n    -ms-flex-preferred-size: 75%;\n    flex-basis: 75%;\n    max-width: 75%; }\n  .col-sm-10 {\n    -webkit-flex-basis: 83.333%;\n    -ms-flex-preferred-size: 83.333%;\n    flex-basis: 83.333%;\n    max-width: 83.333%; }\n  .col-sm-11 {\n    -webkit-flex-basis: 91.667%;\n    -ms-flex-preferred-size: 91.667%;\n    flex-basis: 91.667%;\n    max-width: 91.667%; }\n  .col-sm-12 {\n    -webkit-flex-basis: 100%;\n    -ms-flex-preferred-size: 100%;\n    flex-basis: 100%;\n    max-width: 100%; }\n  .col-sm-offset-1 {\n    margin-left: 8.333%; }\n  .col-sm-offset-2 {\n    margin-left: 16.667%; }\n  .col-sm-offset-3 {\n    margin-left: 25%; }\n  .col-sm-offset-4 {\n    margin-left: 33.333%; }\n  .col-sm-offset-5 {\n    margin-left: 41.667%; }\n  .col-sm-offset-6 {\n    margin-left: 50%; }\n  .col-sm-offset-7 {\n    margin-left: 58.333%; }\n  .col-sm-offset-8 {\n    margin-left: 66.667%; }\n  .col-sm-offset-9 {\n    margin-left: 75%; }\n  .col-sm-offset-10 {\n    margin-left: 83.333%; }\n  .col-sm-offset-11 {\n    margin-left: 91.667%; }\n  .start-sm {\n    -webkit-box-pack: start;\n    -webkit-justify-content: flex-start;\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n    text-align: start; }\n  .center-sm {\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n    -ms-flex-pack: center;\n    justify-content: center;\n    text-align: center; }\n  .end-sm {\n    -webkit-box-pack: end;\n    -webkit-justify-content: flex-end;\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n    text-align: end; }\n  .top-sm {\n    -webkit-box-align: start;\n    -webkit-align-items: flex-start;\n    -ms-flex-align: start;\n    align-items: flex-start; }\n  .middle-sm {\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n    -ms-flex-align: center;\n    align-items: center; }\n  .bottom-sm {\n    -webkit-box-align: end;\n    -webkit-align-items: flex-end;\n    -ms-flex-align: end;\n    align-items: flex-end; }\n  .around-sm {\n    -webkit-justify-content: space-around;\n    -ms-flex-pack: distribute;\n    justify-content: space-around; }\n  .between-sm {\n    -webkit-box-pack: justify;\n    -webkit-justify-content: space-between;\n    -ms-flex-pack: justify;\n    justify-content: space-between; }\n  .first-sm {\n    -webkit-box-ordinal-group: 0;\n    -webkit-order: -1;\n    -ms-flex-order: -1;\n    order: -1; }\n  .last-sm {\n    -webkit-box-ordinal-group: 2;\n    -webkit-order: 1;\n    -ms-flex-order: 1;\n    order: 1; } }\n\n@media only screen and (min-width: 64em) {\n  .container {\n    width: 65rem; }\n  .col-md,\n  .col-md-1,\n  .col-md-2,\n  .col-md-3,\n  .col-md-4,\n  .col-md-5,\n  .col-md-6,\n  .col-md-7,\n  .col-md-8,\n  .col-md-9,\n  .col-md-10,\n  .col-md-11,\n  .col-md-12,\n  .col-md-offset-1,\n  .col-md-offset-2,\n  .col-md-offset-3,\n  .col-md-offset-4,\n  .col-md-offset-5,\n  .col-md-offset-6,\n  .col-md-offset-7,\n  .col-md-offset-8,\n  .col-md-offset-9,\n  .col-md-offset-10,\n  .col-md-offset-11,\n  .col-md-offset-12 {\n    box-sizing: border-box;\n    -webkit-box-flex: 0;\n    -webkit-flex: 0 0 auto;\n    -ms-flex: 0 0 auto;\n    flex: 0 0 auto;\n    padding-right: 0.5rem;\n    padding-left: 0.5rem; }\n  .col-md {\n    -webkit-box-flex: 1;\n    -webkit-flex-grow: 1;\n    -ms-flex-positive: 1;\n    flex-grow: 1;\n    -webkit-flex-basis: 0;\n    -ms-flex-preferred-size: 0;\n    flex-basis: 0;\n    max-width: 100%; }\n  .col-md-1 {\n    -webkit-flex-basis: 8.333%;\n    -ms-flex-preferred-size: 8.333%;\n    flex-basis: 8.333%;\n    max-width: 8.333%; }\n  .col-md-2 {\n    -webkit-flex-basis: 16.667%;\n    -ms-flex-preferred-size: 16.667%;\n    flex-basis: 16.667%;\n    max-width: 16.667%; }\n  .col-md-3 {\n    -webkit-flex-basis: 25%;\n    -ms-flex-preferred-size: 25%;\n    flex-basis: 25%;\n    max-width: 25%; }\n  .col-md-4 {\n    -webkit-flex-basis: 33.333%;\n    -ms-flex-preferred-size: 33.333%;\n    flex-basis: 33.333%;\n    max-width: 33.333%; }\n  .col-md-5 {\n    -webkit-flex-basis: 41.667%;\n    -ms-flex-preferred-size: 41.667%;\n    flex-basis: 41.667%;\n    max-width: 41.667%; }\n  .col-md-6 {\n    -webkit-flex-basis: 50%;\n    -ms-flex-preferred-size: 50%;\n    flex-basis: 50%;\n    max-width: 50%; }\n  .col-md-7 {\n    -webkit-flex-basis: 58.333%;\n    -ms-flex-preferred-size: 58.333%;\n    flex-basis: 58.333%;\n    max-width: 58.333%; }\n  .col-md-8 {\n    -webkit-flex-basis: 66.667%;\n    -ms-flex-preferred-size: 66.667%;\n    flex-basis: 66.667%;\n    max-width: 66.667%; }\n  .col-md-9 {\n    -webkit-flex-basis: 75%;\n    -ms-flex-preferred-size: 75%;\n    flex-basis: 75%;\n    max-width: 75%; }\n  .col-md-10 {\n    -webkit-flex-basis: 83.333%;\n    -ms-flex-preferred-size: 83.333%;\n    flex-basis: 83.333%;\n    max-width: 83.333%; }\n  .col-md-11 {\n    -webkit-flex-basis: 91.667%;\n    -ms-flex-preferred-size: 91.667%;\n    flex-basis: 91.667%;\n    max-width: 91.667%; }\n  .col-md-12 {\n    -webkit-flex-basis: 100%;\n    -ms-flex-preferred-size: 100%;\n    flex-basis: 100%;\n    max-width: 100%; }\n  .col-md-offset-1 {\n    margin-left: 8.333%; }\n  .col-md-offset-2 {\n    margin-left: 16.667%; }\n  .col-md-offset-3 {\n    margin-left: 25%; }\n  .col-md-offset-4 {\n    margin-left: 33.333%; }\n  .col-md-offset-5 {\n    margin-left: 41.667%; }\n  .col-md-offset-6 {\n    margin-left: 50%; }\n  .col-md-offset-7 {\n    margin-left: 58.333%; }\n  .col-md-offset-8 {\n    margin-left: 66.667%; }\n  .col-md-offset-9 {\n    margin-left: 75%; }\n  .col-md-offset-10 {\n    margin-left: 83.333%; }\n  .col-md-offset-11 {\n    margin-left: 91.667%; }\n  .start-md {\n    -webkit-box-pack: start;\n    -webkit-justify-content: flex-start;\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n    text-align: start; }\n  .center-md {\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n    -ms-flex-pack: center;\n    justify-content: center;\n    text-align: center; }\n  .end-md {\n    -webkit-box-pack: end;\n    -webkit-justify-content: flex-end;\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n    text-align: end; }\n  .top-md {\n    -webkit-box-align: start;\n    -webkit-align-items: flex-start;\n    -ms-flex-align: start;\n    align-items: flex-start; }\n  .middle-md {\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n    -ms-flex-align: center;\n    align-items: center; }\n  .bottom-md {\n    -webkit-box-align: end;\n    -webkit-align-items: flex-end;\n    -ms-flex-align: end;\n    align-items: flex-end; }\n  .around-md {\n    -webkit-justify-content: space-around;\n    -ms-flex-pack: distribute;\n    justify-content: space-around; }\n  .between-md {\n    -webkit-box-pack: justify;\n    -webkit-justify-content: space-between;\n    -ms-flex-pack: justify;\n    justify-content: space-between; }\n  .first-md {\n    -webkit-box-ordinal-group: 0;\n    -webkit-order: -1;\n    -ms-flex-order: -1;\n    order: -1; }\n  .last-md {\n    -webkit-box-ordinal-group: 2;\n    -webkit-order: 1;\n    -ms-flex-order: 1;\n    order: 1; } }\n\n@media only screen and (min-width: 75em) {\n  .container {\n    width: 76rem; }\n  .col-lg,\n  .col-lg-1,\n  .col-lg-2,\n  .col-lg-3,\n  .col-lg-4,\n  .col-lg-5,\n  .col-lg-6,\n  .col-lg-7,\n  .col-lg-8,\n  .col-lg-9,\n  .col-lg-10,\n  .col-lg-11,\n  .col-lg-12,\n  .col-lg-offset-1,\n  .col-lg-offset-2,\n  .col-lg-offset-3,\n  .col-lg-offset-4,\n  .col-lg-offset-5,\n  .col-lg-offset-6,\n  .col-lg-offset-7,\n  .col-lg-offset-8,\n  .col-lg-offset-9,\n  .col-lg-offset-10,\n  .col-lg-offset-11,\n  .col-lg-offset-12 {\n    box-sizing: border-box;\n    -webkit-box-flex: 0;\n    -webkit-flex: 0 0 auto;\n    -ms-flex: 0 0 auto;\n    flex: 0 0 auto;\n    padding-right: 0.5rem;\n    padding-left: 0.5rem; }\n  .col-lg {\n    -webkit-box-flex: 1;\n    -webkit-flex-grow: 1;\n    -ms-flex-positive: 1;\n    flex-grow: 1;\n    -webkit-flex-basis: 0;\n    -ms-flex-preferred-size: 0;\n    flex-basis: 0;\n    max-width: 100%; }\n  .col-lg-1 {\n    -webkit-flex-basis: 8.333%;\n    -ms-flex-preferred-size: 8.333%;\n    flex-basis: 8.333%;\n    max-width: 8.333%; }\n  .col-lg-2 {\n    -webkit-flex-basis: 16.667%;\n    -ms-flex-preferred-size: 16.667%;\n    flex-basis: 16.667%;\n    max-width: 16.667%; }\n  .col-lg-3 {\n    -webkit-flex-basis: 25%;\n    -ms-flex-preferred-size: 25%;\n    flex-basis: 25%;\n    max-width: 25%; }\n  .col-lg-4 {\n    -webkit-flex-basis: 33.333%;\n    -ms-flex-preferred-size: 33.333%;\n    flex-basis: 33.333%;\n    max-width: 33.333%; }\n  .col-lg-5 {\n    -webkit-flex-basis: 41.667%;\n    -ms-flex-preferred-size: 41.667%;\n    flex-basis: 41.667%;\n    max-width: 41.667%; }\n  .col-lg-6 {\n    -webkit-flex-basis: 50%;\n    -ms-flex-preferred-size: 50%;\n    flex-basis: 50%;\n    max-width: 50%; }\n  .col-lg-7 {\n    -webkit-flex-basis: 58.333%;\n    -ms-flex-preferred-size: 58.333%;\n    flex-basis: 58.333%;\n    max-width: 58.333%; }\n  .col-lg-8 {\n    -webkit-flex-basis: 66.667%;\n    -ms-flex-preferred-size: 66.667%;\n    flex-basis: 66.667%;\n    max-width: 66.667%; }\n  .col-lg-9 {\n    -webkit-flex-basis: 75%;\n    -ms-flex-preferred-size: 75%;\n    flex-basis: 75%;\n    max-width: 75%; }\n  .col-lg-10 {\n    -webkit-flex-basis: 83.333%;\n    -ms-flex-preferred-size: 83.333%;\n    flex-basis: 83.333%;\n    max-width: 83.333%; }\n  .col-lg-11 {\n    -webkit-flex-basis: 91.667%;\n    -ms-flex-preferred-size: 91.667%;\n    flex-basis: 91.667%;\n    max-width: 91.667%; }\n  .col-lg-12 {\n    -webkit-flex-basis: 100%;\n    -ms-flex-preferred-size: 100%;\n    flex-basis: 100%;\n    max-width: 100%; }\n  .col-lg-offset-1 {\n    margin-left: 8.333%; }\n  .col-lg-offset-2 {\n    margin-left: 16.667%; }\n  .col-lg-offset-3 {\n    margin-left: 25%; }\n  .col-lg-offset-4 {\n    margin-left: 33.333%; }\n  .col-lg-offset-5 {\n    margin-left: 41.667%; }\n  .col-lg-offset-6 {\n    margin-left: 50%; }\n  .col-lg-offset-7 {\n    margin-left: 58.333%; }\n  .col-lg-offset-8 {\n    margin-left: 66.667%; }\n  .col-lg-offset-9 {\n    margin-left: 75%; }\n  .col-lg-offset-10 {\n    margin-left: 83.333%; }\n  .col-lg-offset-11 {\n    margin-left: 91.667%; }\n  .start-lg {\n    -webkit-box-pack: start;\n    -webkit-justify-content: flex-start;\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n    text-align: start; }\n  .center-lg {\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n    -ms-flex-pack: center;\n    justify-content: center;\n    text-align: center; }\n  .end-lg {\n    -webkit-box-pack: end;\n    -webkit-justify-content: flex-end;\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n    text-align: end; }\n  .top-lg {\n    -webkit-box-align: start;\n    -webkit-align-items: flex-start;\n    -ms-flex-align: start;\n    align-items: flex-start; }\n  .middle-lg {\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n    -ms-flex-align: center;\n    align-items: center; }\n  .bottom-lg {\n    -webkit-box-align: end;\n    -webkit-align-items: flex-end;\n    -ms-flex-align: end;\n    align-items: flex-end; }\n  .around-lg {\n    -webkit-justify-content: space-around;\n    -ms-flex-pack: distribute;\n    justify-content: space-around; }\n  .between-lg {\n    -webkit-box-pack: justify;\n    -webkit-justify-content: space-between;\n    -ms-flex-pack: justify;\n    justify-content: space-between; }\n  .first-lg {\n    -webkit-box-ordinal-group: 0;\n    -webkit-order: -1;\n    -ms-flex-order: -1;\n    order: -1; }\n  .last-lg {\n    -webkit-box-ordinal-group: 2;\n    -webkit-order: 1;\n    -ms-flex-order: 1;\n    order: 1; } }\n\n.blocks {\n  align-items: flex-start; }\n\n.blocks__block {\n  margin-bottom: 15px;\n  padding: 0 1.5rem; }\n  @media all and (min-width: 768px) {\n    .blocks__block {\n      padding: 0 0.5rem; } }\n\n.project--single {\n  box-shadow: none; }\n\n.project__name {\n  color: #000;\n  font-size: 18px;\n  font-weight: 400;\n  margin-bottom: 5px;\n  margin-top: 0;\n  text-transform: uppercase; }\n  .project__name a {\n    color: inherit; }\n\n.project__name--large {\n  font-size: 32px;\n  margin-bottom: 15px;\n  text-transform: capitalize; }\n\n.project__image {\n  background-position: center center;\n  background-size: cover;\n  border: 1px solid #DADADA;\n  border-radius: 3px;\n  margin-bottom: 10px;\n  overflow: hidden;\n  padding-bottom: 75%; }\n  .project__image a {\n    display: block;\n    height: 100%;\n    position: absolute;\n    text-decoration: none;\n    width: 100%; }\n\n.project__content {\n  color: #626b6b;\n  display: block;\n  font-size: 16px;\n  text-align: left; }\n\n.project__content--black {\n  color: #000; }\n\n@media all and (min-width: 768px) {\n  #sidebar {\n    padding-top: 75px; } }\n\n.sidebar__section {\n  margin-bottom: 40px;\n  padding-left: 0.5rem;\n  padding-right: 0.5rem; }\n  @media all and (min-width: 768px) {\n    .sidebar__section {\n      padding-left: 0;\n      padding-right: 0; } }\n  .sidebar__section:last-child {\n    margin-bottom: 0; }\n\n.form-row {\n  margin-bottom: 15px; }\n\n.form-row__label {\n  display: block;\n  font-weight: bold;\n  margin-bottom: 8px; }\n\n.form-row input,\n.form-row textarea,\n.form-row select {\n  display: block;\n  padding: 10px;\n  width: 100%; }\n\n* {\n  background-repeat: no-repeat;\n  box-sizing: border-box;\n  position: relative; }\n\nimg {\n  height: auto;\n  max-width: 100%; }\n\na {\n  color: #00ccd2;\n  text-decoration: none; }\n\nnav {\n  border-bottom: 1px solid #dadada;\n  margin-bottom: 30px;\n  padding-bottom: 20px;\n  text-align: center; }\n  @media all and (min-width: 768px) {\n    nav {\n      text-align: left; } }\n\nnav li, nav ul {\n  font-size: 0;\n  list-style: none;\n  margin: 0;\n  padding: 0; }\n\nnav li {\n  display: inline-block;\n  font-size: 18px;\n  margin-right: 12px; }\n  nav li:last-child {\n    margin-right: 0; }\n  nav li a {\n    color: #333;\n    display: block;\n    text-decoration: none; }\n    nav li a.active, nav li a:hover {\n      text-decoration: underline; }\n\n.text--right {\n  text-align: right; }\n\nbody {\n  background-color: #fff;\n  color: #000;\n  font-family: proxima-nova,Helvetica,Arial,sans-serif;\n  margin: 0;\n  padding: 0; }\n\np {\n  font-size: 20px;\n  line-height: 28px; }\n\n.list {\n  list-style-position: inside;\n  margin-left: 0;\n  padding-left: 0; }\n\n.list__item {\n  margin: 0 0 8px 15px; }\n\n.list__item--no-style {\n  list-style: none; }\n\n#main-header {\n  background: #727bc5;\n  color: #fff;\n  height: 65px;\n  line-height: 65px;\n  margin-bottom: 50px;\n  text-align: center; }\n  @media all and (min-width: 768px) {\n    #main-header {\n      text-align: left; } }\n  #main-header .col-sm-6:last-child {\n    display: none; }\n    @media all and (min-width: 768px) {\n      #main-header .col-sm-6:last-child {\n        display: initial; } }\n  #main-header a {\n    color: inherit; }\n\n#logo {\n  font-size: 22px;\n  font-weight: 400;\n  margin: 0; }\n\n@media all and (min-width: 768px) {\n  #main-content {\n    padding-right: 30px; } }\n\npagination {\n  border-top: 1px solid #eaeaea;\n  display: flex;\n  margin-top: 20px;\n  padding-top: 20px; }\n\n.pagination__link {\n  margin-right: 10px; }\n\n#submission-iframe {\n  height: 150vh; }\n\n#main-footer {\n  border-top: 1px solid #eaeaea;\n  color: #333;\n  font-size: 12px;\n  margin-top: 60px;\n  padding-bottom: 20px;\n  padding-top: 20px; }\n"; });
define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./app.css\"></require>\r\n    <require from=\"./app-header.html\"></require>\r\n    <require from=\"./app-footer.html\"></require>\r\n\r\n    <app-header></app-header>\r\n\r\n    <main id=\"content\">\r\n        <div class=\"container\">\r\n            <div class=\"row\">\r\n                <router-view id=\"main-content\" class=\"col-xs-12 col-sm-8 main-content\"></router-view>\r\n                <router-view id=\"sidebar\" class=\"col-xs-12 col-sm-4 sidebar\" name=\"sidebar\"></router-view>\r\n            </div>\r\n        </div>\r\n    </main>\r\n    \r\n    <app-footer></app-footer>\r\n</template>\r\n"; });
define('text!home-sidebar.html', ['module'], function(module) { module.exports = "<template>\n    <section class=\"sidebar__section\">\n        <h3 class=\"sidebar__section__heading\">Built with Aurelia</h3>\n        <p>A showcase of applications, plugins and resources developed for or using Aurelia.<br><a route-href=\"route: submission\">Make a Submission</a></p>\n    </section>\n\n    <section class=\"sidebar__section\">\n        <h3 class=\"sidebar__section__heading\">What is Aurelia?</h3>\n        <p><a href=\"http://aurelia.io\" target=\"_blank\">Aurelia</a> is a JavaScript client framework for mobile, desktop and web leveraging simple conventions and empowering creativity.</p>\n    </section>\n\n    <section class=\"sidebar__section\">\n        <h3 class=\"sidebar__section__heading\">Links</h3>\n        <ul class=\"list\">\n            <li class=\"list__item list__item--no-style\"><a href=\"http://aurelia.io\" target=\"_blank\">Official Website</a></li>\n            <li class=\"list__item list__item--no-style\"><a href=http://aurelia.io/hub.html\" target=\"_blank\">Official Hub</a></li>\n            <li class=\"list__item list__item--no-style\"><a href=https://github.com/aurelia\" target=\"_blank\">Official Github</a></li>\n            <li class=\"list__item list__item--no-style\"><a href=https://twitter.com/AureliaEffect\" target=\"_blank\">Official Twitter</a></li>\n        </ul>\n    </section>\n</template>\n"; });
define('text!home.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"partials/pagination.html\"></require>\r\n    <require from=\"partials/project.html\"></require>\r\n\r\n    <nav>\r\n        <ul>\r\n            <li repeat.for=\"category of categories\"><a href=\"javascript:void(0);\" class=\"${category == currentCategory ? 'active': ''}\" click.delegate=\"filterCategory(category)\">${category.name}</a></li>\r\n        </ul>\r\n    </nav>\r\n\r\n    <div class=\"blocks row\">\r\n        <project class=\"blocks__block col-xs-12 col-sm-6\" repeat.for=\"project of projects\" project.bind=\"project\"></block>\r\n    </div>\r\n\r\n    <pagination total-pages.bind=\"totalNumberOfPages\" if.bind=\"totalNumberOfPages > 1\"></pagination>\r\n</template>\r\n"; });
define('text!submission.html', ['module'], function(module) { module.exports = "<template>\n    <h1>Contribute to Built With Aurelia</h1>\n    <p>Whether it be a plugin or a cool site that you built, tell the world about it.</p>\n    \n    <iframe src=\"https://docs.google.com/forms/d/e/1FAIpQLScKJzv82LP6Yb3DCJrg6vHiyTZwitzxv9R3m-V2d6wFY5S-bQ/viewform?embedded=true\" id=\"submission-iframe\" width=\"760\" height=\"500\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\">Loading...</iframe>\n</template>\n"; });
define('text!view.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./partials/project.html\"></require>\r\n    <project if.bind=\"project\" project.bind=\"project\" full-view=\"true\"></project>\r\n</template>\r\n"; });
define('text!partials/pagination.html', ['module'], function(module) { module.exports = "<template bindable=\"totalPages\">\n    <a class=\"pagination__link\" route-href=\"route: home; params.bind: {page: i + 1}\" repeat.for=\"i of totalPages\">${i + 1}</a>\n</template>\n"; });
define('text!partials/project.html', ['module'], function(module) { module.exports = "<template bindable=\"project, fullView\">\n    <div class=\"project ${fullView ? 'project--single': ''}\" with.bind=\"project\">\n        <header>\n            <h1 class=\"project__name ${fullView ? 'project__name--large': ''}\"><a route-href=\"route: view; params.bind: {slug: slug}\">${name}</a></h1>\n        </header>\n        \n        <div class=\"project__image\" if.bind=\"image\" style=\"background-image: url(https://raw.githubusercontent.com/Vheissu/builtwithaurelia-projects/master/images/${image})\">\n            <a route-href=\"route: view; params.bind: {slug: slug}\"></a>\n        </div>\n\n        <div class=\"project__image\" if.bind=\"!image\" style=\"background-image: url(/images/curlies.svg); background-size: 50%;\">\n            <a route-href=\"route: view; params.bind: {slug: slug}\"></a>\n        </div>\n\n        <div class=\"project__content ${fullView ? 'project__content--black': ''}\" if.bind=\"fullView\">\n            <p innerhtml.bind=\"description\"></p>\n            <p><a href=\"${url}\">View</a> <template if.bind=\"repoUrl\">| <a href=\"${repoUrl}\">Source Code</a></template></p>\n        </div>\n    </div>\n</template>\n\n"; });
//# sourceMappingURL=app-bundle.js.map