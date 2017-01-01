import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MergeAdapter } from './adapters/merge.adapter';
import { QSDAdapter } from './adapters/qsd.adapter'
import { FeedAdapter } from './adapters/feed.adapter'
import { AdapterProperties } from './adapters/adapter.properties'

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
    <playlist *ngIf="showPlaylist" [duration]="duration" [length]="length" [episodes]="episodes" [feedDescription]="feedDescription">
    </playlist>
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
  feedDescription: string;
  duration:  string;
  length:  number;
  showPlaylist:  boolean;
  episodes:  Array<AdapterProperties>;

  constructor(
		private route: ActivatedRoute,
    private adapter: MergeAdapter
	) {}

  ngOnInit() {
    this.route.queryParams.forEach(params => {
      this.adapter.getProperties(params).subscribe(this.assignEpisodePropertiesToPlayer.bind(this))
    });
  }

	showModal() {
		this.showShareModal = true;
	}

	hideModal() {
		this.showShareModal = false;
	}

  private assignEpisodePropertiesToPlayer(properties: AdapterProperties) { 
    console.log(properties)
    this.audioUrl = ( properties.audioUrl || this.audioUrl ) 
    this.title = ( properties.title || this.title )
    this.subtitle = ( properties.subtitle || this.subtitle ) 
    this.subscribeUrl = ( properties.subscribeUrl || this.subscribeUrl )
    this.subscribeTarget = ( properties.subscribeTarget || this.subscribeTarget || "_blank") 
    this.artworkUrl = ( properties.artworkUrl || this.artworkUrl ) 
    this.feedArtworkUrl = ( properties.feedArtworkUrl || this.feedArtworkUrl ) 
    this.feedDescription = (properties.feedDescription || this.feedDescription)
    this.episodes = (properties.episodes || this.episodes || [])

    this.showPlaylist = (properties.showPlaylist || false)
    this.length = this.episodes.length
    this.duration = "45 min"
  }

}
