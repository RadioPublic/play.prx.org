import { EMBED_AUDIO_URL_PARAM, EMBED_TITLE_PARAM, EMBED_SUBTITLE_PARAM,
  EMBED_SUBSCRIBE_URL_PARAM, EMBED_SUBSCRIBE_TARGET, EMBED_IMAGE_URL_PARAM } from './../embed.constants';
import { Observable } from 'rxjs/Observable';
import { AdapterProperties } from './adapter.properties'

export class QSDAdapter {
  constructor(private params: Object) {
    this.params = params
  }

  get hasFullInformation(): boolean {
    return (
      (this.audioUrl != undefined) &&
        (this.title != undefined) &&
        (this.subtitle != undefined) &&
        (this.subscribeUrl != undefined) &&
        (this.subscribeTarget != undefined) &&
        (this.artworkUrl != undefined)
    );
  }

  get getProperties(): Observable<AdapterProperties> {
    return Observable.of(this.playerProperties);
  }


  get playerProperties(): AdapterProperties {
    // Could I pass 'this' to decode? Hrm.
    //
    return  AdapterProperties.decode({
      audioUrl:         this.audioUrl,
      title:            this.title,
      subtitle:         this.subtitle,
      subscribeUrl:     this.subscribeUrl,
      subscribeTarget:  this.subscribeTarget,
      artworkUrl:       this.artworkUrl
    });
  }

  get audioUrl(): string {
    return this.params[EMBED_AUDIO_URL_PARAM]
  }

  get title(): string {
    return this.params[EMBED_TITLE_PARAM]
  }

  get subtitle(): string {
    return this.params[EMBED_SUBTITLE_PARAM]
  }

  get subscribeUrl(): string {
    return this.params[EMBED_SUBSCRIBE_URL_PARAM]
  }

  get subscribeTarget(): string {
    return this.params[EMBED_SUBSCRIBE_TARGET]
  }

  get artworkUrl(): string {
    return this.params[EMBED_IMAGE_URL_PARAM]
  }
}



