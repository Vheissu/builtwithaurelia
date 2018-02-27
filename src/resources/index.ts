import {FrameworkConfiguration} from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
    config.globalResources([
        './value-converters/async-binding-behavior',
        './value-converters/object-keys',
        './value-converters/prettify'
    ]);
}
