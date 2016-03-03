import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {PlayerComponent} from '../player/player.component';

@Component({
  directives: [ROUTER_DIRECTIVES],
  selector: 'embed-app',
  template: '<router-outlet></router-outlet>'
})
@RouteConfig([
  { component: PlayerComponent, name: 'Player', path: '/' },
])
export class AppComponent {

}
