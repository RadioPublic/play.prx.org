import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {PlayerComponent} from './player.component';

@Component({
  directives: [PlayerComponent],
  template: `
    <player [audioUrl]="audioUrl"></player>
  `
})
export class MainPlayerComponent {
  private audioUrl: string;

  constructor(router: Router, routeParams: RouteParams) {
    let audioUrlInput = routeParams.get('audioUrl');
    if (!audioUrlInput) {
      router.navigate(['Player', {
        audioUrl: 'https%3A%2F%2Fdovetail.prxu.org%2Fserial%2Fb2e8cc39-1' +
          'bea-4246-9205-775f7c1152ad%2Fserial-s02-e09.mp3'
      }]);
    } else {
      this.audioUrl = decodeURIComponent(audioUrlInput);
    }
  }
}
