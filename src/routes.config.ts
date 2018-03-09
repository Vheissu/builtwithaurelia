import { PLATFORM } from 'aurelia-pal';

export const ApplicationRoutes = [
    {
        route: [ '', ':category?'],
        moduleId: PLATFORM.moduleName('./routes/home', 'home'),
        name: 'home',
        nav: false,
        title: 'Home'
    },
    {
        route: 'about',
        moduleId: PLATFORM.moduleName('./routes/about', 'about'),
        name: 'about',
        nav: true,
        title: 'About'
    },
    {
        route: 'dashboard',
        moduleId: PLATFORM.moduleName('./routes/dashboard/dashboard', 'dashboard'),
        name: 'dashboard',
        nav: true,
        auth: true,
        title: 'Dashboard'
    },
    {
        route: 'view/:slug',
        moduleId: PLATFORM.moduleName('./routes/view', 'view'),
        name: 'view',
        nav: false,
        title: 'View'
    },
    {
        route: 'admin',
        moduleId: PLATFORM.moduleName('./routes/admin/admin', 'admin'),
        name: 'admin',
        nav: true,
        auth: true,
        title: 'Admin',
        settings: {
            admin: true
        }
    },
];
