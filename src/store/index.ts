import { Container } from 'aurelia-dependency-injection';
import { Store } from 'aurelia-store';
import { State } from './state';

export default Container.instance.get(Store) as Store<State>;
