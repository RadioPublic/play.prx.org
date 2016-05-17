import 'angular2/bundles/angular2-polyfills';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_BINDINGS} from 'angular2/http';
import 'rxjs/Rx';

import {AppComponent} from './app.component';

bootstrap(
  AppComponent,
  [
    ROUTER_PROVIDERS,
    HTTP_BINDINGS
  ]
);
