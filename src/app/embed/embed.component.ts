import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { MergeAdapter } from './adapters/merge.adapter';

@Component({
  selector: 'play-embed',
  styleUrls: ['embed.component.css'],
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

  constructor(
		private route: ActivatedRoute,
		private http: Http
	) {}

	ngOnInit() {
		this.route.queryParams.forEach(params => {
			const adapter = new MergeAdapter(params, this.http)
			adapter.getProperties.subscribe(
				properties => {
          console.log(properties)
					this.audioUrl = ( properties.audioUrl || this.audioUrl ) 
					this.title = ( properties.title || this.title )
					this.subtitle = ( properties.subtitle || this.subtitle ) 
					this.subscribeUrl = ( properties.subscribeUrl || this.subscribeUrl )
					this.subscribeTarget = ( properties.subscribeTarget || this.subscribeTarget ) 
					this.artworkUrl = ( properties.artworkUrl || this.artworkUrl ) 
          this.feedArtworkUrl = ( properties.feedArtworkUrl || this.feedArtworkUrl ) 
				}
			)
		});
	}

	showModal() {
		this.showShareModal = true;
	}

	hideModal() {
		this.showShareModal = false;
	}

}
