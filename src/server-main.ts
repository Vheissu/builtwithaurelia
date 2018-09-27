if (!Object.entries) {
    Object.entries = function (obj) {
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];

        return resArray;
    };
}

import { Aurelia } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import bootstrapper from 'aurelia-ssr-bootstrapper-webpack';

(global as any).XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

async function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration();

    aurelia.use.plugin(PLATFORM.moduleName('aurelia-validation'));

    await aurelia.start();
    await aurelia.setRoot(PLATFORM.moduleName('app'));
}

module.exports = bootstrapper(configure);
