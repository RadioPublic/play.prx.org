import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

import {ShareModalComponent} from './shared/index';
import {PlayerComponent} from '../+player/index.ts';
import * as constants from './shared/index';

@Component({
  directives: [PlayerComponent, ShareModalComponent],
  styleUrls: ['app/+embed/embed.component.css'],
  template: `
    <share-modal *ngIf="showShareModal" (toggleShareModal)="toggleShareModal($event)"></share-modal>
    <player [audioUrl]="audioUrl" (toggleShareModal)="toggleShareModal($event)"></player>
  `
})
export class EmbedComponent {
  private audioUrl: string;
  private showShareModal: boolean;

  constructor(router: Router, routeParams: RouteParams) {
    this.showShareModal = false;

    const audioUrlInput = routeParams.get(constants.EMBED_AUDIO_URL_PARAM);

    if (audioUrlInput) {
      this.audioUrl = decodeURIComponent(audioUrlInput);
    }
  }

  toggleShareModal(show: boolean) {
    this.showShareModal = show;
  }
}
