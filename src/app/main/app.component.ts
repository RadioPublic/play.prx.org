import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {MainPlayerComponent} from '../player/main_player.component';

@Component({
  directives: [ROUTER_DIRECTIVES],
  selector: 'embed-app',
  template: '<router-outlet></router-outlet>'
})
@RouteConfig([
  { component: MainPlayerComponent, name: 'Player', path: '/' }
])
export class AppComponent {
  constructor() {
    console.log("WAT");
  }
}
