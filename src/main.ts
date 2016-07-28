import {Aurelia} from 'aurelia-framework'
import environment from './environment';

import {AIEvent} from 'aurelia-interface';
import 'aurelia-interface-grid/ai-grid.css!';

//Configure Bluebird Promises.
//Note: You may want to use environment-specific configuration.
(<any>Promise).config({
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin('aurelia-interface', ai => {
        ai.setViewPort();
        au.webAppCapable();
    })
    .feature('resources');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
