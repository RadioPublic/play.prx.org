import {bootstrap, ELEMENT_PROBE_PROVIDERS} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_BINDINGS} from 'angular2/http';

import {AppComponent} from './app/main/app.component';

import 'rxjs/Rx';

bootstrap(
  AppComponent,
  [
    ROUTER_PROVIDERS,
    HTTP_BINDINGS,
    ELEMENT_PROBE_PROVIDERS
  ]
);
