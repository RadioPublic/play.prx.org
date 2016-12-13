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

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.forEach(params => {
      if (params[EMBED_AUDIO_URL_PARAM]) {
        this.audioUrl        = params[EMBED_AUDIO_URL_PARAM];
        this.title           = params[EMBED_TITLE_PARAM];
        this.subtitle        = params[EMBED_SUBTITLE_PARAM];
        this.subscribeUrl    = params[EMBED_SUBSCRIBE_URL_PARAM];
        this.subscribeTarget = params[EMBED_SUBSCRIBE_TARGET];
        this.artworkUrl      = params[EMBED_IMAGE_URL_PARAM];
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
