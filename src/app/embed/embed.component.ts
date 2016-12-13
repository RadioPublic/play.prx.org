import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMBED_AUDIO_URL_PARAM, EMBED_TITLE_PARAM, EMBED_SUBTITLE_PARAM,
  EMBED_SUBSCRIBE_URL_PARAM, EMBED_SUBSCRIBE_TARGET, EMBED_IMAGE_URL_PARAM } from './embed.constants';

@Component({
  selector: 'play-embed',
  styleUrls: ['embed.component.css'],
  template: `
    <play-share-modal *ngIf="showShareModal" (close)="hideModal()">
    </play-share-modal>
    <play-player [audioUrl]="audioUrl" [title]="title" [subtitle]="subtitle"
      [subscribeUrl]="subscribeUrl" [subscribeTarget]="subscribeTarget"
      [artworkUrl]="artworkUrl" (share)="showModal()">
    </play-player>
  `
})

export class EmbedComponent implements OnInit {

  showShareModal = false;

  // player params
  audioUrl: string;
  title: string;
  subtitle: string;
  subscribeUrl: string;
  subscribeTarget: string;
  artworkUrl: string;

  constructor(private route: ActivatedRoute) {
    this.showShareModal = false;
  }

  ngOnInit() {
    this.route.queryParams.forEach(params => {
      if (params[EMBED_AUDIO_URL_PARAM]) {
        this.audioUrl = decodeURIComponent(params[EMBED_AUDIO_URL_PARAM]);
        this.title = decodeURIComponent(params[EMBED_TITLE_PARAM]);
        this.subtitle = decodeURIComponent(params[EMBED_SUBTITLE_PARAM]);
        this.subscribeUrl = decodeURIComponent(params[EMBED_SUBSCRIBE_URL_PARAM]);
        this.subscribeTarget = decodeURIComponent(params[EMBED_SUBSCRIBE_TARGET]);
        this.artworkUrl = 'url(' + decodeURIComponent(params[EMBED_IMAGE_URL_PARAM]) + ')';
      }
   });
  }

  showModal() {
    this.showShareModal = true;
  }

  hideModal() {
    this.showShareModal = false;
  }

}
