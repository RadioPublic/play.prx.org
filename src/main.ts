// <reference path="../typings/browser.d.ts">

import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_BINDINGS} from 'angular2/http';
import 'rxjs/Rx';

import {AppComponent} from './app/app.component';

bootstrap(
  AppComponent,
  [
    ROUTER_PROVIDERS,
    HTTP_BINDINGS
  ]
);
