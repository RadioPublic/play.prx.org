import {enableProdMode} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_BINDINGS} from 'angular2/http';

import {AppComponent} from './app/main/app.component';

import 'rxjs/Rx';

if (window.location.host !== 'localhost') {
  enableProdMode();
}

bootstrap(
  AppComponent,
  [
    ROUTER_PROVIDERS,
    HTTP_BINDINGS,
  ]);
