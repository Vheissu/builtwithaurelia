/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>
import '../font-awesome.min.css';
import './styles/app.scss';
import '../bootstrap-social.css';
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

    await aurelia.start();
    await aurelia.setRoot(PLATFORM.moduleName('app'));
}
