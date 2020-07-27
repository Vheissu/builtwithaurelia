import Aurelia, { RouterConfiguration } from 'aurelia';
import { MyApp } from './my-app';

// Setup Firebase
import './common/firebase';

import './styles/global.css';

Aurelia
  .register(RouterConfiguration.customize({ useUrlFragmentHash: false }))
  .app(MyApp)
  .start();
