import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QSDAdapter } from './adapters/qsd.adapter';

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
      const adapter = new QSDAdapter(params)
      this.audioUrl = adapter.audioUrl
      this.title = adapter.title
      this.subtitle = adapter.subtitle
      this.subscribeUrl = adapter.subscribeUrl
      this.subscribeTarget = adapter.subscribeTarget
      this.artworkUrl = adapter.artworkUrl
   });
  }

  showModal() {
    this.showShareModal = true;
  }

  hideModal() {
    this.showShareModal = false;
  }

}
