import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

import {PlayerComponent} from '../+player/index.ts';
import * as constants from './shared/index';

@Component({
  directives: [PlayerComponent],
  styleUrls: ['app/+embed/embed.component.css'],
  template: `<player [audioUrl]="audioUrl"></player>`
})
export class EmbedComponent {
  private audioUrl: string;

  constructor(router: Router, routeParams: RouteParams) {
    const audioUrlInput = routeParams.get(constants.EMBED_AUDIO_URL_PARAM);

    if (audioUrlInput) {
      this.audioUrl = decodeURIComponent(audioUrlInput);
    }
  }
}
