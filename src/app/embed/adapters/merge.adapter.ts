import { EMBED_AUDIO_URL_PARAM, EMBED_TITLE_PARAM, EMBED_SUBTITLE_PARAM,
  EMBED_SUBSCRIBE_URL_PARAM, EMBED_SUBSCRIBE_TARGET, EMBED_IMAGE_URL_PARAM, EMBED_FEED_ID_PARAM, EMBED_FEED_GUID_PARAM } from './../embed.constants';
import { QSDAdapter } from './qsd.adapter'

export class MergeAdapter {

  constructor(private params: Object) {
    this.QSDAdapter = new QSDAdapter(params);
  }

  get audioUrl(): string {
    return this.QSDAdapter.audioUrl
  }

  get title(): string {
    return this.QSDAdapter.title
  }

  get subtitle(): string {
    return this.QSDAdapter.subtitle
  }

  get subscribeUrl(): string {
    return this.QSDAdapter.subscribeUrl
  }

  get subscribeTarget(): string {
    return this.QSDAdapter.subscribeTarget
  }

  get artworkUrl(): string {
    return this.QSDAdapter.artworkUrl
  }
}



