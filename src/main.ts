/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>
import '../font-awesome.min.css';
import './styles/app.scss';
import { Aurelia } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

export async function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging();

    aurelia.use.feature(PLATFORM.moduleName('resources/index'));

    aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));

    await aurelia.start();
    await aurelia.setRoot(PLATFORM.moduleName('app'));
}
