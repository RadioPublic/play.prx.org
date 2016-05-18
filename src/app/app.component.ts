import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {EmbedComponent} from './+embed/index.ts';
import {DemoComponent} from './+demo/index.ts';
import {BuilderComponent} from './+builder/index.ts';

@Component({
  directives: [ROUTER_DIRECTIVES],
  selector: 'app',
  template: '<router-outlet></router-outlet>'
})
@RouteConfig([
  { component: EmbedComponent, name: 'Embed', path: '/e' },
  { component: BuilderComponent, name: 'Builder', path: '/builder' },
  { component: DemoComponent, name: 'Demo', path: '/demo' }
])
export class AppComponent {}
