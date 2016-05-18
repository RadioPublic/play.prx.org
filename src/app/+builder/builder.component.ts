import {Component} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {Router, RouteParams} from 'angular2/router';

import {EpisodePickerComponent, Episode} from './shared/index';
import * as constants from '../+embed/shared/embed-constants/embed-constants';

export class BuilderSpecs {
  constructor(
    public title?: string,
    public subtitle?: string,
    public ctaTitle?: string,
    public audioUrl?: string,
    public imageUrl?: string,
    public feedUrl?: string,
    public ctaUrl?: string,
    public subscribeUrl?: string
  ) {}

  get paramString() {
    let str: string[] = [];

    str.push(`${constants.EMBED_TITLE_PARAM}=${encodeURIComponent(this.title)}`);
    str.push(`${constants.EMBED_SUBTITLE_PARAM}=${encodeURIComponent(this.subtitle)}`);
    str.push(`${constants.EMBED_CTA_TITLE_PARAM}=${encodeURIComponent(this.ctaTitle)}`);
    str.push(`${constants.EMBED_AUDIO_URL_PARAM}=${encodeURIComponent(this.audioUrl)}`);
    str.push(`${constants.EMBED_IMAGE_URL_PARAM}=${encodeURIComponent(this.imageUrl)}`);
    str.push(`${constants.EMBED_FEED_URL_PARAM}=${encodeURIComponent(this.feedUrl)}`);
    str.push(`${constants.EMBED_CTA_URL_PARAM}=${encodeURIComponent(this.ctaUrl)}`);
    str.push(`${constants.EMBED_SUBSCRIBE_URL_PARAM}=${encodeURIComponent(this.subscribeUrl)}`);

    return str.join('&');
  }

  get embeddableUrl() {
    return `https://play.prx.org/e?${this.paramString}`;
  }
}

@Component({
  directives: [NgForm, EpisodePickerComponent],
  selector: 'player',
  styleUrls: ['src/app/+builder/builder.component.css'],
  templateUrl: 'src/app/+builder/builder.component.html'
})
export class BuilderComponent {
  private feedUrl: string;
  private specs: BuilderSpecs;

  constructor(
    private router: Router,
    private routeParams: RouteParams
  ) {
    if (this.routeParams.get('feedUrl')) {
      this.feedUrl = decodeURIComponent(this.routeParams.get('feedUrl'));
    }
  }

  onSubmit(url: string): void {
    let encodedUrl = encodeURIComponent(url);
    this.router.navigate(['Builder', { feedUrl: encodedUrl }]);
  }

  private onEpisodeSelect(episode: Episode) {
    this.specs = new BuilderSpecs(
      episode.title,
      episode.artist,
      '',
      episode.url,
      episode.imageUrl,
      this.feedUrl,
      '',
      ''
    );
  }
};
