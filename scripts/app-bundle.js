define('about',["require", "exports"], function (require, exports) {
    "use strict";
    var About = (function () {
        function About() {
        }
        return About;
    }());
    exports.About = About;
});

define('services/application',["require", "exports"], function (require, exports) {
    "use strict";
    var ApplicationService = (function () {
        function ApplicationService() {
            this.loading = false;
        }
        return ApplicationService;
    }());
    exports.ApplicationService = ApplicationService;
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
define('api',["require", "exports", 'aurelia-framework', 'aurelia-fetch-client', './services/application'], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1, application_1) {
    "use strict";
    var Api = (function () {
        function Api(http, appService) {
            this.http = http;
            this.appService = appService;
        }
        Api.prototype.getProjectImage = function (slug) {
            var _this = this;
            this.appService.loading = true;
            return this.http.fetch("https://raw.githubusercontent.com/Vheissu/builtwithaurelia-projects/master/images/" + slug)
                .then(function (response) { return response.text(); })
                .then(function (image) {
                _this.appService.loading = false;
                return image;
            });
        };
        Api.prototype.getProjects = function () {
            var _this = this;
            this.appService.loading = true;
            return this.http.fetch('https://raw.githubusercontent.com/Vheissu/builtwithaurelia-projects/master/projects.json')
                .then(function (response) { return response.json(); })
                .then(function (projects) {
                _this.appService.loading = false;
                return projects;
            });
        };
        Api.prototype.getProject = function (slug) {
            var _this = this;
            this.appService.loading = true;
            var returnProject = null;
            return this.getProjects().then(function (projects) {
                projects.forEach(function (project) {
                    if (project.slug === slug) {
                        returnProject = project;
                    }
                });
                _this.appService.loading = false;
                return returnProject;
            });
        };
        Api = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [aurelia_fetch_client_1.HttpClient, application_1.ApplicationService])
        ], Api);
        return Api;
    }());
    exports.Api = Api;
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
define('app',["require", "exports", 'aurelia-framework', 'aurelia-event-aggregator', './services/application'], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, application_1) {
    "use strict";
    var App = (function () {
        function App(appService, ea) {
            this.showHat = false;
            this.appService = appService;
            this.ea = ea;
        }
        App.prototype.attached = function () {
            this.ea.subscribe('router:navigation:success', function (payload) {
                if ('clicky' in window) {
                    window.clicky.log(payload.instruction.fragment, payload.instruction.title || document.title);
                }
            });
        };
        App.prototype.configureRouter = function (config, router) {
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
        };
        App = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [application_1.ApplicationService, aurelia_event_aggregator_1.EventAggregator])
        ], App);
        return App;
    }());
    exports.App = App;
});

define('common',["require", "exports"], function (require, exports) {
    "use strict";
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
    function getColourFromHashedString(str) {
        var hash = hashString(str);
        var index = hash % exports.colours.length;
        return exports.colours[index];
    }
    exports.getColourFromHashedString = getColourFromHashedString;
    ;
    function hashString(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var charCode = str.charCodeAt(i);
            hash += charCode;
        }
        return hash;
    }
    exports.hashString = hashString;
    ;
    function paginate(page, maxPerPage, items) {
        var offset = (page - 1) * maxPerPage;
        var totalPages = Math.ceil(items.length / maxPerPage);
        return {
            items: (maxPerPage === -1) ? items : items.slice(offset, offset + maxPerPage),
            pages: totalPages
        };
    }
    exports.paginate = paginate;
    ;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
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
define('home',["require", "exports", 'aurelia-framework', 'aurelia-router', './api', './common'], function (require, exports, aurelia_framework_1, aurelia_router_1, api_1, common_1) {
    "use strict";
    var maxProjectsPerPage = 10;
    var Home = (function () {
        function Home(api, appService, ApplicationService, router) {
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
            this.api = api;
            this.appService = appService;
            this.router = router;
        }
        Home.prototype.canActivate = function (params) {
            var _this = this;
            this.currentPage = params.page || 1;
            this.api.getProjects().then(function (projects) {
                if (projects.length) {
                    _this.projects = projects;
                    _this.getProjectCounts();
                }
                else {
                    _this.router.navigate('/');
                }
            });
        };
        Home.prototype.activate = function () {
            this.currentCategory = this.categories.all;
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
            __metadata('design:paramtypes', [api_1.Api, Object, Object, aurelia_router_1.Router])
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
define('view',["require", "exports", 'aurelia-framework', './api', './common'], function (require, exports, aurelia_framework_1, api_1, common_1) {
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
                    _this.project.colour = common_1.getColourFromHashedString(_this.project.name);
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

define('resources/value-converters/object-keys',["require", "exports"], function (require, exports) {
    "use strict";
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

define('text!about.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"row\">\n        <div class=\"col-xs-12 col-sm-8\">\n            <h1>About Built With Aurelia</h1>\n            <p>Built With Aurelia is a simplistic showcase of all the great things the Aurelia community are doing. Whether it be a website, mobile application or a plugin, Built With Aurelia shows you what is possible with Aurelia.</p>\n            <p>The idea stemmed from there being no official source of who or what has been built with Aurelia. This site itself is built on Aurelia, it is using the Aurelia CLI and RequireJS, there are no 3rd party dependencies and the entire site is hosted on Github.</p>\n        </div>\n    </div>\n</template>\n"; });
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./app.css\"></require>\n    <require from=\"./partials/loader.html\"></require>\n    <require from=\"./partials/app-header.html\"></require>\n    <require from=\"./partials/app-footer.html\"></require>\n\n    <loader show.bind=\"router.isNavigating || appService.loading\"></loader>\n\n    <app-header></app-header>\n\n    <main id=\"content\">\n        <div class=\"container\">\n            <router-view id=\"main-content\" class=\"main-content\"></router-view>\n        </div>\n    </main>\n    \n    <app-footer></app-footer>\n</template>\n"; });
define('text!app.css', ['module'], function(module) { module.exports = ".container-fluid,\n.container {\n  margin-right: auto;\n  margin-left: auto; }\n\n.container-fluid {\n  padding-right: 2rem;\n  padding-left: 2rem; }\n\n.row {\n  box-sizing: border-box;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 1 auto;\n  -ms-flex: 0 1 auto;\n  flex: 0 1 auto;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: row;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  -webkit-flex-wrap: wrap;\n  -ms-flex-wrap: wrap;\n  flex-wrap: wrap;\n  margin-right: -0.5rem;\n  margin-left: -0.5rem; }\n\n.row.reverse {\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: reverse;\n  -webkit-flex-direction: row-reverse;\n  -ms-flex-direction: row-reverse;\n  flex-direction: row-reverse; }\n\n.col.reverse {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: reverse;\n  -webkit-flex-direction: column-reverse;\n  -ms-flex-direction: column-reverse;\n  flex-direction: column-reverse; }\n\n.col-xs,\n.col-xs-1,\n.col-xs-2,\n.col-xs-3,\n.col-xs-4,\n.col-xs-5,\n.col-xs-6,\n.col-xs-7,\n.col-xs-8,\n.col-xs-9,\n.col-xs-10,\n.col-xs-11,\n.col-xs-12,\n.col-xs-offset-1,\n.col-xs-offset-2,\n.col-xs-offset-3,\n.col-xs-offset-4,\n.col-xs-offset-5,\n.col-xs-offset-6,\n.col-xs-offset-7,\n.col-xs-offset-8,\n.col-xs-offset-9,\n.col-xs-offset-10,\n.col-xs-offset-11,\n.col-xs-offset-12 {\n  box-sizing: border-box;\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 auto;\n  -ms-flex: 0 0 auto;\n  flex: 0 0 auto;\n  padding-right: 0.5rem;\n  padding-left: 0.5rem; }\n\n.col-xs {\n  -webkit-box-flex: 1;\n  -webkit-flex-grow: 1;\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n  -webkit-flex-basis: 0;\n  -ms-flex-preferred-size: 0;\n  flex-basis: 0;\n  max-width: 100%; }\n\n.col-xs-1 {\n  -webkit-flex-basis: 8.333%;\n  -ms-flex-preferred-size: 8.333%;\n  flex-basis: 8.333%;\n  max-width: 8.333%; }\n\n.col-xs-2 {\n  -webkit-flex-basis: 16.667%;\n  -ms-flex-preferred-size: 16.667%;\n  flex-basis: 16.667%;\n  max-width: 16.667%; }\n\n.col-xs-3 {\n  -webkit-flex-basis: 25%;\n  -ms-flex-preferred-size: 25%;\n  flex-basis: 25%;\n  max-width: 25%; }\n\n.col-xs-4 {\n  -webkit-flex-basis: 33.333%;\n  -ms-flex-preferred-size: 33.333%;\n  flex-basis: 33.333%;\n  max-width: 33.333%; }\n\n.col-xs-5 {\n  -webkit-flex-basis: 41.667%;\n  -ms-flex-preferred-size: 41.667%;\n  flex-basis: 41.667%;\n  max-width: 41.667%; }\n\n.col-xs-6 {\n  -webkit-flex-basis: 50%;\n  -ms-flex-preferred-size: 50%;\n  flex-basis: 50%;\n  max-width: 50%; }\n\n.col-xs-7 {\n  -webkit-flex-basis: 58.333%;\n  -ms-flex-preferred-size: 58.333%;\n  flex-basis: 58.333%;\n  max-width: 58.333%; }\n\n.col-xs-8 {\n  -webkit-flex-basis: 66.667%;\n  -ms-flex-preferred-size: 66.667%;\n  flex-basis: 66.667%;\n  max-width: 66.667%; }\n\n.col-xs-9 {\n  -webkit-flex-basis: 75%;\n  -ms-flex-preferred-size: 75%;\n  flex-basis: 75%;\n  max-width: 75%; }\n\n.col-xs-10 {\n  -webkit-flex-basis: 83.333%;\n  -ms-flex-preferred-size: 83.333%;\n  flex-basis: 83.333%;\n  max-width: 83.333%; }\n\n.col-xs-11 {\n  -webkit-flex-basis: 91.667%;\n  -ms-flex-preferred-size: 91.667%;\n  flex-basis: 91.667%;\n  max-width: 91.667%; }\n\n.col-xs-12 {\n  -webkit-flex-basis: 100%;\n  -ms-flex-preferred-size: 100%;\n  flex-basis: 100%;\n  max-width: 100%; }\n\n.col-xs-offset-1 {\n  margin-left: 8.333%; }\n\n.col-xs-offset-2 {\n  margin-left: 16.667%; }\n\n.col-xs-offset-3 {\n  margin-left: 25%; }\n\n.col-xs-offset-4 {\n  margin-left: 33.333%; }\n\n.col-xs-offset-5 {\n  margin-left: 41.667%; }\n\n.col-xs-offset-6 {\n  margin-left: 50%; }\n\n.col-xs-offset-7 {\n  margin-left: 58.333%; }\n\n.col-xs-offset-8 {\n  margin-left: 66.667%; }\n\n.col-xs-offset-9 {\n  margin-left: 75%; }\n\n.col-xs-offset-10 {\n  margin-left: 83.333%; }\n\n.col-xs-offset-11 {\n  margin-left: 91.667%; }\n\n.start-xs {\n  -webkit-box-pack: start;\n  -webkit-justify-content: flex-start;\n  -ms-flex-pack: start;\n  justify-content: flex-start;\n  text-align: start; }\n\n.center-xs {\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  text-align: center; }\n\n.end-xs {\n  -webkit-box-pack: end;\n  -webkit-justify-content: flex-end;\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n  text-align: end; }\n\n.top-xs {\n  -webkit-box-align: start;\n  -webkit-align-items: flex-start;\n  -ms-flex-align: start;\n  align-items: flex-start; }\n\n.middle-xs {\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center; }\n\n.bottom-xs {\n  -webkit-box-align: end;\n  -webkit-align-items: flex-end;\n  -ms-flex-align: end;\n  align-items: flex-end; }\n\n.around-xs {\n  -webkit-justify-content: space-around;\n  -ms-flex-pack: distribute;\n  justify-content: space-around; }\n\n.between-xs {\n  -webkit-box-pack: justify;\n  -webkit-justify-content: space-between;\n  -ms-flex-pack: justify;\n  justify-content: space-between; }\n\n.first-xs {\n  -webkit-box-ordinal-group: 0;\n  -webkit-order: -1;\n  -ms-flex-order: -1;\n  order: -1; }\n\n.last-xs {\n  -webkit-box-ordinal-group: 2;\n  -webkit-order: 1;\n  -ms-flex-order: 1;\n  order: 1; }\n\n@media only screen and (min-width: 48em) {\n  .container {\n    width: 49rem; }\n  .col-sm,\n  .col-sm-1,\n  .col-sm-2,\n  .col-sm-3,\n  .col-sm-4,\n  .col-sm-5,\n  .col-sm-6,\n  .col-sm-7,\n  .col-sm-8,\n  .col-sm-9,\n  .col-sm-10,\n  .col-sm-11,\n  .col-sm-12,\n  .col-sm-offset-1,\n  .col-sm-offset-2,\n  .col-sm-offset-3,\n  .col-sm-offset-4,\n  .col-sm-offset-5,\n  .col-sm-offset-6,\n  .col-sm-offset-7,\n  .col-sm-offset-8,\n  .col-sm-offset-9,\n  .col-sm-offset-10,\n  .col-sm-offset-11,\n  .col-sm-offset-12 {\n    box-sizing: border-box;\n    -webkit-box-flex: 0;\n    -webkit-flex: 0 0 auto;\n    -ms-flex: 0 0 auto;\n    flex: 0 0 auto;\n    padding-right: 0.5rem;\n    padding-left: 0.5rem; }\n  .col-sm {\n    -webkit-box-flex: 1;\n    -webkit-flex-grow: 1;\n    -ms-flex-positive: 1;\n    flex-grow: 1;\n    -webkit-flex-basis: 0;\n    -ms-flex-preferred-size: 0;\n    flex-basis: 0;\n    max-width: 100%; }\n  .col-sm-1 {\n    -webkit-flex-basis: 8.333%;\n    -ms-flex-preferred-size: 8.333%;\n    flex-basis: 8.333%;\n    max-width: 8.333%; }\n  .col-sm-2 {\n    -webkit-flex-basis: 16.667%;\n    -ms-flex-preferred-size: 16.667%;\n    flex-basis: 16.667%;\n    max-width: 16.667%; }\n  .col-sm-3 {\n    -webkit-flex-basis: 25%;\n    -ms-flex-preferred-size: 25%;\n    flex-basis: 25%;\n    max-width: 25%; }\n  .col-sm-4 {\n    -webkit-flex-basis: 33.333%;\n    -ms-flex-preferred-size: 33.333%;\n    flex-basis: 33.333%;\n    max-width: 33.333%; }\n  .col-sm-5 {\n    -webkit-flex-basis: 41.667%;\n    -ms-flex-preferred-size: 41.667%;\n    flex-basis: 41.667%;\n    max-width: 41.667%; }\n  .col-sm-6 {\n    -webkit-flex-basis: 50%;\n    -ms-flex-preferred-size: 50%;\n    flex-basis: 50%;\n    max-width: 50%; }\n  .col-sm-7 {\n    -webkit-flex-basis: 58.333%;\n    -ms-flex-preferred-size: 58.333%;\n    flex-basis: 58.333%;\n    max-width: 58.333%; }\n  .col-sm-8 {\n    -webkit-flex-basis: 66.667%;\n    -ms-flex-preferred-size: 66.667%;\n    flex-basis: 66.667%;\n    max-width: 66.667%; }\n  .col-sm-9 {\n    -webkit-flex-basis: 75%;\n    -ms-flex-preferred-size: 75%;\n    flex-basis: 75%;\n    max-width: 75%; }\n  .col-sm-10 {\n    -webkit-flex-basis: 83.333%;\n    -ms-flex-preferred-size: 83.333%;\n    flex-basis: 83.333%;\n    max-width: 83.333%; }\n  .col-sm-11 {\n    -webkit-flex-basis: 91.667%;\n    -ms-flex-preferred-size: 91.667%;\n    flex-basis: 91.667%;\n    max-width: 91.667%; }\n  .col-sm-12 {\n    -webkit-flex-basis: 100%;\n    -ms-flex-preferred-size: 100%;\n    flex-basis: 100%;\n    max-width: 100%; }\n  .col-sm-offset-1 {\n    margin-left: 8.333%; }\n  .col-sm-offset-2 {\n    margin-left: 16.667%; }\n  .col-sm-offset-3 {\n    margin-left: 25%; }\n  .col-sm-offset-4 {\n    margin-left: 33.333%; }\n  .col-sm-offset-5 {\n    margin-left: 41.667%; }\n  .col-sm-offset-6 {\n    margin-left: 50%; }\n  .col-sm-offset-7 {\n    margin-left: 58.333%; }\n  .col-sm-offset-8 {\n    margin-left: 66.667%; }\n  .col-sm-offset-9 {\n    margin-left: 75%; }\n  .col-sm-offset-10 {\n    margin-left: 83.333%; }\n  .col-sm-offset-11 {\n    margin-left: 91.667%; }\n  .start-sm {\n    -webkit-box-pack: start;\n    -webkit-justify-content: flex-start;\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n    text-align: start; }\n  .center-sm {\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n    -ms-flex-pack: center;\n    justify-content: center;\n    text-align: center; }\n  .end-sm {\n    -webkit-box-pack: end;\n    -webkit-justify-content: flex-end;\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n    text-align: end; }\n  .top-sm {\n    -webkit-box-align: start;\n    -webkit-align-items: flex-start;\n    -ms-flex-align: start;\n    align-items: flex-start; }\n  .middle-sm {\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n    -ms-flex-align: center;\n    align-items: center; }\n  .bottom-sm {\n    -webkit-box-align: end;\n    -webkit-align-items: flex-end;\n    -ms-flex-align: end;\n    align-items: flex-end; }\n  .around-sm {\n    -webkit-justify-content: space-around;\n    -ms-flex-pack: distribute;\n    justify-content: space-around; }\n  .between-sm {\n    -webkit-box-pack: justify;\n    -webkit-justify-content: space-between;\n    -ms-flex-pack: justify;\n    justify-content: space-between; }\n  .first-sm {\n    -webkit-box-ordinal-group: 0;\n    -webkit-order: -1;\n    -ms-flex-order: -1;\n    order: -1; }\n  .last-sm {\n    -webkit-box-ordinal-group: 2;\n    -webkit-order: 1;\n    -ms-flex-order: 1;\n    order: 1; } }\n\n@media only screen and (min-width: 64em) {\n  .container {\n    width: 65rem; }\n  .col-md,\n  .col-md-1,\n  .col-md-2,\n  .col-md-3,\n  .col-md-4,\n  .col-md-5,\n  .col-md-6,\n  .col-md-7,\n  .col-md-8,\n  .col-md-9,\n  .col-md-10,\n  .col-md-11,\n  .col-md-12,\n  .col-md-offset-1,\n  .col-md-offset-2,\n  .col-md-offset-3,\n  .col-md-offset-4,\n  .col-md-offset-5,\n  .col-md-offset-6,\n  .col-md-offset-7,\n  .col-md-offset-8,\n  .col-md-offset-9,\n  .col-md-offset-10,\n  .col-md-offset-11,\n  .col-md-offset-12 {\n    box-sizing: border-box;\n    -webkit-box-flex: 0;\n    -webkit-flex: 0 0 auto;\n    -ms-flex: 0 0 auto;\n    flex: 0 0 auto;\n    padding-right: 0.5rem;\n    padding-left: 0.5rem; }\n  .col-md {\n    -webkit-box-flex: 1;\n    -webkit-flex-grow: 1;\n    -ms-flex-positive: 1;\n    flex-grow: 1;\n    -webkit-flex-basis: 0;\n    -ms-flex-preferred-size: 0;\n    flex-basis: 0;\n    max-width: 100%; }\n  .col-md-1 {\n    -webkit-flex-basis: 8.333%;\n    -ms-flex-preferred-size: 8.333%;\n    flex-basis: 8.333%;\n    max-width: 8.333%; }\n  .col-md-2 {\n    -webkit-flex-basis: 16.667%;\n    -ms-flex-preferred-size: 16.667%;\n    flex-basis: 16.667%;\n    max-width: 16.667%; }\n  .col-md-3 {\n    -webkit-flex-basis: 25%;\n    -ms-flex-preferred-size: 25%;\n    flex-basis: 25%;\n    max-width: 25%; }\n  .col-md-4 {\n    -webkit-flex-basis: 33.333%;\n    -ms-flex-preferred-size: 33.333%;\n    flex-basis: 33.333%;\n    max-width: 33.333%; }\n  .col-md-5 {\n    -webkit-flex-basis: 41.667%;\n    -ms-flex-preferred-size: 41.667%;\n    flex-basis: 41.667%;\n    max-width: 41.667%; }\n  .col-md-6 {\n    -webkit-flex-basis: 50%;\n    -ms-flex-preferred-size: 50%;\n    flex-basis: 50%;\n    max-width: 50%; }\n  .col-md-7 {\n    -webkit-flex-basis: 58.333%;\n    -ms-flex-preferred-size: 58.333%;\n    flex-basis: 58.333%;\n    max-width: 58.333%; }\n  .col-md-8 {\n    -webkit-flex-basis: 66.667%;\n    -ms-flex-preferred-size: 66.667%;\n    flex-basis: 66.667%;\n    max-width: 66.667%; }\n  .col-md-9 {\n    -webkit-flex-basis: 75%;\n    -ms-flex-preferred-size: 75%;\n    flex-basis: 75%;\n    max-width: 75%; }\n  .col-md-10 {\n    -webkit-flex-basis: 83.333%;\n    -ms-flex-preferred-size: 83.333%;\n    flex-basis: 83.333%;\n    max-width: 83.333%; }\n  .col-md-11 {\n    -webkit-flex-basis: 91.667%;\n    -ms-flex-preferred-size: 91.667%;\n    flex-basis: 91.667%;\n    max-width: 91.667%; }\n  .col-md-12 {\n    -webkit-flex-basis: 100%;\n    -ms-flex-preferred-size: 100%;\n    flex-basis: 100%;\n    max-width: 100%; }\n  .col-md-offset-1 {\n    margin-left: 8.333%; }\n  .col-md-offset-2 {\n    margin-left: 16.667%; }\n  .col-md-offset-3 {\n    margin-left: 25%; }\n  .col-md-offset-4 {\n    margin-left: 33.333%; }\n  .col-md-offset-5 {\n    margin-left: 41.667%; }\n  .col-md-offset-6 {\n    margin-left: 50%; }\n  .col-md-offset-7 {\n    margin-left: 58.333%; }\n  .col-md-offset-8 {\n    margin-left: 66.667%; }\n  .col-md-offset-9 {\n    margin-left: 75%; }\n  .col-md-offset-10 {\n    margin-left: 83.333%; }\n  .col-md-offset-11 {\n    margin-left: 91.667%; }\n  .start-md {\n    -webkit-box-pack: start;\n    -webkit-justify-content: flex-start;\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n    text-align: start; }\n  .center-md {\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n    -ms-flex-pack: center;\n    justify-content: center;\n    text-align: center; }\n  .end-md {\n    -webkit-box-pack: end;\n    -webkit-justify-content: flex-end;\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n    text-align: end; }\n  .top-md {\n    -webkit-box-align: start;\n    -webkit-align-items: flex-start;\n    -ms-flex-align: start;\n    align-items: flex-start; }\n  .middle-md {\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n    -ms-flex-align: center;\n    align-items: center; }\n  .bottom-md {\n    -webkit-box-align: end;\n    -webkit-align-items: flex-end;\n    -ms-flex-align: end;\n    align-items: flex-end; }\n  .around-md {\n    -webkit-justify-content: space-around;\n    -ms-flex-pack: distribute;\n    justify-content: space-around; }\n  .between-md {\n    -webkit-box-pack: justify;\n    -webkit-justify-content: space-between;\n    -ms-flex-pack: justify;\n    justify-content: space-between; }\n  .first-md {\n    -webkit-box-ordinal-group: 0;\n    -webkit-order: -1;\n    -ms-flex-order: -1;\n    order: -1; }\n  .last-md {\n    -webkit-box-ordinal-group: 2;\n    -webkit-order: 1;\n    -ms-flex-order: 1;\n    order: 1; } }\n\n@media only screen and (min-width: 75em) {\n  .container {\n    width: 76rem; }\n  .col-lg,\n  .col-lg-1,\n  .col-lg-2,\n  .col-lg-3,\n  .col-lg-4,\n  .col-lg-5,\n  .col-lg-6,\n  .col-lg-7,\n  .col-lg-8,\n  .col-lg-9,\n  .col-lg-10,\n  .col-lg-11,\n  .col-lg-12,\n  .col-lg-offset-1,\n  .col-lg-offset-2,\n  .col-lg-offset-3,\n  .col-lg-offset-4,\n  .col-lg-offset-5,\n  .col-lg-offset-6,\n  .col-lg-offset-7,\n  .col-lg-offset-8,\n  .col-lg-offset-9,\n  .col-lg-offset-10,\n  .col-lg-offset-11,\n  .col-lg-offset-12 {\n    box-sizing: border-box;\n    -webkit-box-flex: 0;\n    -webkit-flex: 0 0 auto;\n    -ms-flex: 0 0 auto;\n    flex: 0 0 auto;\n    padding-right: 0.5rem;\n    padding-left: 0.5rem; }\n  .col-lg {\n    -webkit-box-flex: 1;\n    -webkit-flex-grow: 1;\n    -ms-flex-positive: 1;\n    flex-grow: 1;\n    -webkit-flex-basis: 0;\n    -ms-flex-preferred-size: 0;\n    flex-basis: 0;\n    max-width: 100%; }\n  .col-lg-1 {\n    -webkit-flex-basis: 8.333%;\n    -ms-flex-preferred-size: 8.333%;\n    flex-basis: 8.333%;\n    max-width: 8.333%; }\n  .col-lg-2 {\n    -webkit-flex-basis: 16.667%;\n    -ms-flex-preferred-size: 16.667%;\n    flex-basis: 16.667%;\n    max-width: 16.667%; }\n  .col-lg-3 {\n    -webkit-flex-basis: 25%;\n    -ms-flex-preferred-size: 25%;\n    flex-basis: 25%;\n    max-width: 25%; }\n  .col-lg-4 {\n    -webkit-flex-basis: 33.333%;\n    -ms-flex-preferred-size: 33.333%;\n    flex-basis: 33.333%;\n    max-width: 33.333%; }\n  .col-lg-5 {\n    -webkit-flex-basis: 41.667%;\n    -ms-flex-preferred-size: 41.667%;\n    flex-basis: 41.667%;\n    max-width: 41.667%; }\n  .col-lg-6 {\n    -webkit-flex-basis: 50%;\n    -ms-flex-preferred-size: 50%;\n    flex-basis: 50%;\n    max-width: 50%; }\n  .col-lg-7 {\n    -webkit-flex-basis: 58.333%;\n    -ms-flex-preferred-size: 58.333%;\n    flex-basis: 58.333%;\n    max-width: 58.333%; }\n  .col-lg-8 {\n    -webkit-flex-basis: 66.667%;\n    -ms-flex-preferred-size: 66.667%;\n    flex-basis: 66.667%;\n    max-width: 66.667%; }\n  .col-lg-9 {\n    -webkit-flex-basis: 75%;\n    -ms-flex-preferred-size: 75%;\n    flex-basis: 75%;\n    max-width: 75%; }\n  .col-lg-10 {\n    -webkit-flex-basis: 83.333%;\n    -ms-flex-preferred-size: 83.333%;\n    flex-basis: 83.333%;\n    max-width: 83.333%; }\n  .col-lg-11 {\n    -webkit-flex-basis: 91.667%;\n    -ms-flex-preferred-size: 91.667%;\n    flex-basis: 91.667%;\n    max-width: 91.667%; }\n  .col-lg-12 {\n    -webkit-flex-basis: 100%;\n    -ms-flex-preferred-size: 100%;\n    flex-basis: 100%;\n    max-width: 100%; }\n  .col-lg-offset-1 {\n    margin-left: 8.333%; }\n  .col-lg-offset-2 {\n    margin-left: 16.667%; }\n  .col-lg-offset-3 {\n    margin-left: 25%; }\n  .col-lg-offset-4 {\n    margin-left: 33.333%; }\n  .col-lg-offset-5 {\n    margin-left: 41.667%; }\n  .col-lg-offset-6 {\n    margin-left: 50%; }\n  .col-lg-offset-7 {\n    margin-left: 58.333%; }\n  .col-lg-offset-8 {\n    margin-left: 66.667%; }\n  .col-lg-offset-9 {\n    margin-left: 75%; }\n  .col-lg-offset-10 {\n    margin-left: 83.333%; }\n  .col-lg-offset-11 {\n    margin-left: 91.667%; }\n  .start-lg {\n    -webkit-box-pack: start;\n    -webkit-justify-content: flex-start;\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n    text-align: start; }\n  .center-lg {\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n    -ms-flex-pack: center;\n    justify-content: center;\n    text-align: center; }\n  .end-lg {\n    -webkit-box-pack: end;\n    -webkit-justify-content: flex-end;\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n    text-align: end; }\n  .top-lg {\n    -webkit-box-align: start;\n    -webkit-align-items: flex-start;\n    -ms-flex-align: start;\n    align-items: flex-start; }\n  .middle-lg {\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n    -ms-flex-align: center;\n    align-items: center; }\n  .bottom-lg {\n    -webkit-box-align: end;\n    -webkit-align-items: flex-end;\n    -ms-flex-align: end;\n    align-items: flex-end; }\n  .around-lg {\n    -webkit-justify-content: space-around;\n    -ms-flex-pack: distribute;\n    justify-content: space-around; }\n  .between-lg {\n    -webkit-box-pack: justify;\n    -webkit-justify-content: space-between;\n    -ms-flex-pack: justify;\n    justify-content: space-between; }\n  .first-lg {\n    -webkit-box-ordinal-group: 0;\n    -webkit-order: -1;\n    -ms-flex-order: -1;\n    order: -1; }\n  .last-lg {\n    -webkit-box-ordinal-group: 2;\n    -webkit-order: 1;\n    -ms-flex-order: 1;\n    order: 1; } }\n\n.blocks {\n  align-items: flex-start; }\n\n@media all and (min-width: 768px) {\n  .blocks__block {\n    margin-bottom: 15px; } }\n\n.thumbnail {\n  height: 320px; }\n  @media all and (min-width: 768px) {\n    .thumbnail {\n      border-left: 12px solid #FFF; } }\n  .thumbnail:hover > .thumbnail__pullover {\n    height: 100%; }\n  .thumbnail > a {\n    display: block;\n    height: 100%;\n    left: 0;\n    position: absolute;\n    top: 0;\n    width: 100%;\n    z-index: 100; }\n\n.thumbnail__pullover {\n  background: rgba(0, 0, 0, 0.8);\n  bottom: 0;\n  color: #FFF;\n  height: 0;\n  left: 0;\n  overflow: hidden;\n  position: absolute;\n  text-align: left;\n  transition: all 0.4s ease;\n  width: 100%;\n  z-index: 1000; }\n  .thumbnail__pullover .thumbnail__inner {\n    max-width: 80%;\n    text-align: left; }\n\n.blocks__block--large .thumbnail__pullover p {\n  font-size: 20px;\n  line-height: 26px; }\n\n.thumbnail--large {\n  height: 320px; }\n  @media all and (min-width: 768px) {\n    .thumbnail--large {\n      height: 460px; }\n      .thumbnail--large .thumbnail__heading {\n        font-size: 46px; } }\n\n.thumbnail__inner {\n  color: #FFF;\n  left: 50%;\n  max-width: 50%;\n  position: absolute;\n  text-align: center;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  width: 100%; }\n  .thumbnail__inner p {\n    font-size: 14px;\n    line-height: 20px; }\n  .thumbnail__inner a {\n    color: #FFF; }\n\n.thumbnail__heading {\n  border-bottom: 2px solid rgba(255, 255, 255, 0.5);\n  font-size: 32px;\n  font-weight: bold;\n  margin: 0 0 12px 0;\n  padding-bottom: 8px; }\n\n.thumbnail__subheading {\n  font-size: 18px;\n  font-weight: 400;\n  margin: 0; }\n\n@media all and (min-width: 768px) {\n  #sidebar {\n    padding-top: 50px; } }\n\n.sidebar__section {\n  margin-bottom: 40px;\n  padding-left: 0.5rem;\n  padding-right: 0.5rem; }\n  @media all and (min-width: 768px) {\n    .sidebar__section {\n      padding-left: 0;\n      padding-right: 0; } }\n  .sidebar__section:last-child {\n    margin-bottom: 0; }\n\n.form-row {\n  margin-bottom: 15px; }\n\n.form-row__label {\n  display: block;\n  font-weight: bold;\n  margin-bottom: 8px; }\n\n.form-row input,\n.form-row textarea,\n.form-row select {\n  display: block;\n  padding: 10px;\n  width: 100%; }\n\n* {\n  background-repeat: no-repeat;\n  box-sizing: border-box;\n  position: relative; }\n\nimg {\n  height: auto;\n  max-width: 100%; }\n\na {\n  color: #00ccd2;\n  text-decoration: none; }\n\n.link--underlined {\n  text-decoration: underline; }\n\nnav {\n  border-bottom: 1px solid #dadada;\n  margin-bottom: 30px;\n  margin-left: 6px;\n  padding-bottom: 20px;\n  padding-left: .5rem;\n  padding-right: .5rem;\n  text-align: center;\n  width: 100%; }\n  @media all and (min-width: 768px) {\n    nav {\n      margin-left: 0;\n      padding-left: 0;\n      padding-right: 0;\n      text-align: left; } }\n\nnav li, nav ul {\n  font-size: 0;\n  list-style: none;\n  margin: 0;\n  padding: 0; }\n\nnav li {\n  display: inline-block;\n  font-size: 18px;\n  margin-right: 12px; }\n  nav li:last-child {\n    margin-right: 0; }\n  nav li a {\n    color: #aaa;\n    display: block;\n    text-decoration: none; }\n    nav li a.active, nav li a:hover {\n      color: #000; }\n\n.text--bold {\n  font-weight: 700; }\n\n.text--right {\n  text-align: right; }\n\n.hat {\n  background-color: #333;\n  color: #fff;\n  height: 0;\n  overflow: hidden;\n  transition: all .5s linear; }\n\n.hat__title {\n  font-size: 42px;\n  margin-bottom: 12px; }\n\n.hat__inner {\n  margin: 0 auto;\n  padding: 0 30px; }\n  @media all and (min-width: 768px) {\n    .hat__inner {\n      width: 50%; } }\n\n.hat--active {\n  height: 550px; }\n\nbody {\n  background-color: #fff;\n  color: #000;\n  font-family: proxima-nova,Helvetica,Arial,sans-serif;\n  margin: 0;\n  padding: 0; }\n\np {\n  font-size: 20px;\n  line-height: 28px; }\n\n.list {\n  list-style-position: inside;\n  margin-left: 0;\n  padding-left: 0; }\n\n.list__item {\n  margin: 0 0 8px; }\n\n.list--no-style, .list__item--no-style {\n  list-style: none; }\n\n#main-header {\n  background: #333;\n  color: #fff;\n  height: 65px;\n  line-height: 65px;\n  margin-bottom: 50px;\n  text-align: center; }\n  @media all and (min-width: 768px) {\n    #main-header {\n      text-align: left; } }\n  #main-header .col-sm-6:last-child {\n    display: none; }\n    @media all and (min-width: 768px) {\n      #main-header .col-sm-6:last-child {\n        display: initial; } }\n  #main-header a {\n    color: inherit; }\n\n#logo {\n  font-size: 22px;\n  font-weight: 400;\n  margin: 0; }\n\n#main-content {\n  display: block; }\n  @media all and (min-width: 768px) {\n    #main-content {\n      padding-right: 30px; } }\n\npagination {\n  border-top: 1px solid #eaeaea;\n  display: flex;\n  margin-top: 20px;\n  padding-top: 20px; }\n\n.pagination__link {\n  margin-right: 10px; }\n\n#submission-iframe {\n  color: #000;\n  font-size: 22px;\n  height: 150vh;\n  width: 100%; }\n\n#main-footer {\n  border-top: 1px solid #eaeaea;\n  color: #333;\n  font-size: 12px;\n  margin-top: 60px;\n  padding-bottom: 20px;\n  padding-top: 20px; }\n\n.button {\n  border: 1px solid #05babf;\n  cursor: pointer;\n  display: inline-block;\n  font-size: 20px;\n  line-height: 1;\n  margin-right: 12px;\n  padding: 10px 20px;\n  transition: background .5s ease;\n  vertical-align: middle; }\n  .button:hover {\n    background-color: #05babf; }\n  .button:last-child {\n    margin-right: 0; }\n\n.bg--purple {\n  background-color: #646fc7; }\n\n.bg--grapefruit {\n  background-color: #e14840; }\n\n.bg--medium-blue {\n  background-color: #4e73aa; }\n\n.bg--bright-blue {\n  background-color: #00c3ff; }\n\n.bg--gentle-pink {\n  background-color: #ffc3cd; }\n\n.bg--teal {\n  background-color: #21ada4; }\n\n.bg--middle-blue {\n  background-color: #00a5c6; }\n\n.bg--light-cyan {\n  background-color: #1cd8e7; }\n\n.bg--brave-orange {\n  background-color: #ff794e; }\n\n.bg--yellow-its-me {\n  background-color: #fddc57; }\n\n.bg--green {\n  background-color: #6f9661; }\n\n.bg--pie {\n  background-color: #fdbe79; }\n\n.bg--dark {\n  background-color: #424242; }\n\n.bg--aurelia-pink {\n  background-color: #bc157a;\n  color: #fff; }\n"; });
define('text!home.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"resources/value-converters/object-keys\"></require>\n    <require from=\"partials/pagination.html\"></require>\n    <require from=\"partials/thumbnail.html\"></require>\n    \n    <nav>\n        <ul>\n            <li repeat.for=\"category of categories | objectKeys\"><a href=\"javascript:void(0);\" class=\"${category == currentCategory ? 'active': ''}\" click.delegate=\"filterCategory(category)\">${category.name} <span>(${category.count})</span></a></li>\n        </ul>\n    </nav>\n\n    <div class=\"blocks row\">\n        <div id=\"no-results\" if.bind=\"!projects.length && !appService.loading\"><h2>Sorry, nothing was found :(</h2></div>\n        <template repeat.for=\"project of projects\">\n            <template if.bind=\"$index == 1\">\n                <div class=\"col-xs-12 col-sm-6 thumbnail blocks__block bg--dark\">\n                    <div class=\"thumbnail__inner\">\n                        <h1 class=\"thumbnail__heading\">Built With Aurelia</h1>\n                        <h2 class=\"thumbnail__subheading\">A showcase of applications, plugins and resources developed for or using the Aurelia Javascript framework.<br><br><a route-href=\"route: submission\" class=\"link--underlined\">Make a Submission</a></h2>\n                    </div>\n                </div>\n            </template>\n            <template if.bind=\"$index == 3\">\n                <div class=\"col-xs-12 col-sm-6 thumbnail blocks__block bg--dark\">\n                    <div class=\"thumbnail__inner\">\n                        <h1 class=\"thumbnail__heading\">Links</h1>\n                        <ul class=\"list\">\n                            <li class=\"list__item list__item--no-style\"><a href=\"http://aurelia.io\" target=\"_blank\">Aurelia Website</a></li>\n                            <li class=\"list__item list__item--no-style\"><a href=\"http://aurelia.io/hub.html\" target=\"_blank\">Aurelia Developer Hub</a></li>\n                            <li class=\"list__item list__item--no-style\"><a href=\"https://github.com/aurelia\" target=\"_blank\">Aurelia Github</a></li>\n                            <li class=\"list__item list__item--no-style\"><a href=\"https://twitter.com/AureliaEffect\" target=\"_blank\">Aurelia Twitter</a></li>\n                        </ul>\n                    </div>\n                </div>\n            </template>\n            <thumbnail class=\"blocks__block ${!$first ? getRandomBackgroundColour(project.name) : 'bg--aurelia-pink blocks__block--large'} ${$first ? 'col-xs-12 col-sm-12 thumbnail--large' : 'col-xs-12 col-sm-6'}\" project.bind=\"project\"></thumbnail>\n        </template>\n    </div>\n\n    <pagination total-pages.bind=\"totalNumberOfPages\" if.bind=\"totalNumberOfPages > 1\"></pagination>\n</template>\n"; });
define('text!submission.html', ['module'], function(module) { module.exports = "<template>\n    <h1>Contribute to Built With Aurelia</h1>\n    <p>Whether it be a plugin or a cool site that you built, tell the world about it.</p>\n    \n    <iframe src=\"https://docs.google.com/forms/d/e/1FAIpQLScKJzv82LP6Yb3DCJrg6vHiyTZwitzxv9R3m-V2d6wFY5S-bQ/viewform?embedded=true\" id=\"submission-iframe\" width=\"760\" height=\"500\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\">Loading...</iframe>\n</template>\n"; });
define('text!view.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./partials/project.html\"></require>\n    <project if.bind=\"project\" project.bind=\"project\"></project>\n</template>\n"; });
define('text!partials/app-footer.html', ['module'], function(module) { module.exports = "<template containerless>\n    <footer id=\"main-footer\">\n        <div class=\"container\">\n            <div class=\"row\">\n                <div class=\"col-sm-6\">Built by <a href=\"http://ilikekillnerds.com\" target=\"_blank\">Dwayne Charrington</a> &copy; 2016</div>\n                <div class=\"col-sm-6 text--right\"><small>Running on Aurelia <3 </small></div>\n            </div>\n        </div>\n    </footer>\n</template>\n"; });
define('text!styles/loader.css', ['module'], function(module) { module.exports = ".loader {\n  background: rgba(255, 255, 255, 0.95);\n  height: 100%;\n  left: 0;\n  top: 0;\n  width: 100%;\n  position: fixed;\n  z-index: 1; }\n\n.loader__inner {\n  height: 250px;\n  left: 50%;\n  position: fixed;\n  text-align: center;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  width: 250px;\n  z-index: 2; }\n  .loader__inner h2 {\n    color: #000;\n    font-size: 16px;\n    margin: 15px 0 0;\n    padding: 0;\n    width: 100%; }\n\n.loader__indicator {\n  animation: a 1.5s linear infinite;\n  background: transparent url(/images/aurelia-logo-mark.svg) no-repeat 0 0;\n  display: block;\n  height: 80px;\n  margin: 0 auto;\n  width: 80px; }\n\n.ellipsis {\n  font-size: 16px; }\n  .ellipsis:after {\n    animation: b steps(4) 0.9s infinite;\n    content: \"\\2026\";\n    display: inline-block;\n    overflow: hidden;\n    vertical-align: bottom;\n    width: 0; }\n\n@keyframes a {\n  0% {\n    transform: rotate(0deg); }\n  to {\n    transform: rotate(220deg); } }\n\n@keyframes b {\n  to {\n    width: 1.25em; } }\n"; });
define('text!partials/app-header.html', ['module'], function(module) { module.exports = "<template containerless>\n\n    <header id=\"main-header\">\n        <div class=\"container\">\n            <div class=\"row\">\n                <h1 id=\"logo\" class=\"col-xs-12 col-sm-6\"><a route-href=\"route:home_nopagination\">Built With Aurelia</a></h1>\n                <div class=\"col-sm-6 text--right\">\n                    <a route-href=\"route: submission\" class=\"text--bold\">Make a Submission</a>\n                    <span>&nbsp;|&nbsp;</span>\n                    <a route-href=\"route: about\">About</a>\n                    <span>&nbsp;|&nbsp;</span>\n                    <a href=\"mailto:dwaynecharrington@gmail.com\">Contact</a>\n                </div>\n            </div>\n        </div>\n    </header>\n\n</template>\n"; });
define('text!partials/loader.html', ['module'], function(module) { module.exports = "<template bindable=\"loading\" class=\"loader\">\n    <require from=\"../styles/loader.css\"></require>\n\n    <div class=\"loader__inner\">\n        <span class=\"loader__indicator\"></span>\n        <h2 class=\"ellipsis\">Loading</h2>\n    </div>\n</template>\n"; });
define('text!partials/pagination.html', ['module'], function(module) { module.exports = "<template bindable=\"totalPages\">\n    <a class=\"pagination__link\" route-href=\"route: home; params.bind: {page: i + 1}\" repeat.for=\"i of totalPages\">${i + 1}</a>\n</template>\n"; });
define('text!partials/project.html', ['module'], function(module) { module.exports = "<template bindable=\"project\">\n    <div class=\"project project--single\" with.bind=\"project\">\n        <div class=\"row\">\n            <div class=\"col-xs-12 col-sm-8\">\n                <header>\n                    <h1 class=\"project__name project__name--large\">${name}</h1>\n                    <div class=\"project__border ${colour}\" if.bind=\"colour\"></div>\n                </header>\n\n                <div class=\"project__content project__content--black\">\n                    <p innerhtml.bind=\"description\"></p>\n                </div>\n\n                <a href=\"${url}\" class=\"button\" target=\"_blank\">View</a>\n                <a if.bind=\"repoUrl\" href=\"${repoUrl}\" class=\"button\" target=\"_blank\">Source Code</a>\n            </div>\n        </div>\n    </div>\n</template>\n\n"; });
define('text!partials/thumbnail.html', ['module'], function(module) { module.exports = "<template bindable=\"project, fullView\" class=\"thumbnail\">\n    <template with.bind=\"project\">\n        <div class=\"thumbnail__inner\">\n            <h1 class=\"thumbnail__heading\">${name}</h1>\n            <h2 class=\"thumbnail__subheading\">${category}</h2>\n        </div>\n        <div class=\"thumbnail__pullover\">\n            <div class=\"thumbnail__inner\">\n                <p innerhtml.bind=\"description\"></p>\n                <a href=\"${url}\" class=\"button\" target=\"_blank\">View</a>\n                <a if.bind=\"repoUrl\" href=\"${repoUrl}\" class=\"button\" target=\"_blank\">Source Code</a>\n            </div>\n        </div>\n    </template>\n</template>\n\n"; });
//# sourceMappingURL=app-bundle.js.map