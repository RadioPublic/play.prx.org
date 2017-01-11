import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MergeAdapter } from './adapters/merge.adapter';
import { QSDAdapter } from './adapters/qsd.adapter';
import { FeedAdapter } from './adapters/feed.adapter';
import { AdapterProperties } from './adapters/adapter.properties';

@Component({
  selector: 'play-embed',
  styleUrls: ['embed.component.css'],
  providers: [MergeAdapter, QSDAdapter, FeedAdapter],
  template: `
    <play-share-modal *ngIf="showShareModal" (close)="hideModal()">
    </play-share-modal>
    <play-player [feedArtworkUrl]="feedArtworkUrl" [audioUrl]="audioUrl" [title]="title" [subtitle]="subtitle"
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
  feedArtworkUrl: string;

  constructor(private route: ActivatedRoute, private adapter: MergeAdapter) {}

  ngOnInit() {
    this.route.queryParams.forEach(params => {
      this.adapter.getProperties(params).subscribe(props => {
        this.assignEpisodePropertiesToPlayer(props);
      });
    });
  }

  showModal() {
    this.showShareModal = true;
  }

  hideModal() {
    this.showShareModal = false;
  }

  private assignEpisodePropertiesToPlayer(properties: AdapterProperties) {
    this.audioUrl = ( properties.audioUrl || this.audioUrl );
    this.title = ( properties.title || this.title );
    this.subtitle = ( properties.subtitle || this.subtitle );
    this.subscribeUrl = ( properties.subscribeUrl || this.subscribeUrl );
    this.subscribeTarget = ( properties.subscribeTarget || this.subscribeTarget || '_blank');
    this.artworkUrl = ( properties.artworkUrl || this.artworkUrl );
    this.feedArtworkUrl = ( properties.feedArtworkUrl || this.feedArtworkUrl );
  }

}
