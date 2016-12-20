import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MergeAdapter } from './adapters/merge.adapter';
import { QSDAdapter } from './adapters/qsd.adapter'
import { FeedAdapter } from './adapters/feed.adapter'

@Component({
  selector: 'play-embed',
  styleUrls: ['embed.component.css'],
  providers: [FeedAdapter, QSDAdapter],
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
  // private operativeAdapters: Array<any>
  // private priorityAdapter: any;

  constructor(
		private route: ActivatedRoute,
    private FeedAdapter: FeedAdapter,
    private QSDAdapter:  QSDAdapter
	) {
    // if(window['ENV']['DATA_SOURCES'] == "rp"){
    //   this.operativeAdapters = [this.FeedAdapter]
    //   this.priorityAdapter = this.QSDAdapter
    // }
  }

	ngOnInit() {
		this.route.queryParams.forEach(params => {
			const adapter = new MergeAdapter(
        params, 
        this.QSDAdapter, 
        this.FeedAdapter
      )
			adapter.getProperties.subscribe(
				properties => {
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
