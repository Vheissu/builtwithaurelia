﻿import './assets/styles/app.scss';

import { Aurelia } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import { initialState as clientInitialState } from './store/state';

let initialState = clientInitialState;

if (PLATFORM.global.__PRELOADED_STATE__) {
    initialState = Object.assign({}, PLATFORM.global.__PRELOADED_STATE__, clientInitialState);
}

export async function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging();

    aurelia.use.feature(PLATFORM.moduleName('resources/index'));

    aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-store'), { initialState });
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-validation'));

    await aurelia.start();
    await aurelia.setRoot(PLATFORM.moduleName('app'));
}
