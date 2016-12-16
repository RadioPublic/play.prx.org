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

  constructor(
		private route: ActivatedRoute,
		private http: Http
	) {}

	ngOnInit() {
		this.route.queryParams.forEach(params => {
			const adapter = new MergeAdapter(params, this.http)
			adapter.getParams.subscribe(
				parameters => {
					this.audioUrl = parameters['audioUrl']
					this.title = parameters['title']
					this.subtitle = parameters['subtitle']
					this.subscribeUrl = parameters['subscribeUrl']
					this.subscribeTarget = parameters['subscribeTarget']
					this.artworkUrl = parameters['artworkUrl']
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
