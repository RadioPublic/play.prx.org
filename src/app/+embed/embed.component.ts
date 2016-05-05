import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

import {PlayerComponent} from '../+player/index.ts';

@Component({
  directives: [PlayerComponent],
  styleUrls: ['app/+embed/embed.component.css'],
  template: `<player [audioUrl]="audioUrl"></player>`
})
export class EmbedComponent {
  private audioUrl: string;

  constructor(router: Router, routeParams: RouteParams) {
    const audioUrlInput = routeParams.get('audioUrl');

    // TODO Remove in production
    if (!audioUrlInput) {
      router.navigate(['Embed', {
        artworkUrl: encodeURIComponent('https://media.www.bailey.dog/images/full/0003.jpg'),
        audioUrl: 'https%3A%2F%2Fdovetail.prxu.org%2Fserial%2Fb2e8cc39-1' +
          'bea-4246-9205-775f7c1152ad%2Fserial-s02-e09.mp3',
        subscribeUrl: encodeURIComponent('https://subscribe.do'),
        subtitle: 'Serial',
        title: 'Trade Secrets'
      }]);
    } else {
      this.audioUrl = decodeURIComponent(audioUrlInput);
    }
  }
}
