import { EMBED_AUDIO_URL_PARAM, EMBED_TITLE_PARAM, EMBED_SUBTITLE_PARAM,
  EMBED_SUBSCRIBE_URL_PARAM, EMBED_SUBSCRIBE_TARGET, EMBED_IMAGE_URL_PARAM } from './../embed.constants';

export class QSDAdapter {

  constructor(private params: Object) {}

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



