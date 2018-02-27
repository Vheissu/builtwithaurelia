import { PLATFORM } from 'aurelia-pal';
import {FrameworkConfiguration} from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
    config.globalResources([
        PLATFORM.moduleName('./value-converters/async-binding-behavior'),
        PLATFORM.moduleName('./value-converters/object-keys'),
        PLATFORM.moduleName('./value-converters/prettify')
    ]);
}
