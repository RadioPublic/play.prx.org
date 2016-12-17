import { Http } from '@angular/http';
import { EMBED_AUDIO_URL_PARAM, EMBED_TITLE_PARAM, EMBED_SUBTITLE_PARAM,
  EMBED_SUBSCRIBE_URL_PARAM, EMBED_SUBSCRIBE_TARGET, EMBED_IMAGE_URL_PARAM, EMBED_FEED_ID_PARAM, EMBED_EPISODE_GUID_PARAM } from './../embed.constants';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';

import { QSDAdapter } from './qsd.adapter'
import { FeedAdapter } from './feed.adapter'
import { AdapterProperties } from './adapter.properties'

export class MergeAdapter {
  private QSDAdapter: QSDAdapter
  private FeedAdapter: FeedAdapter
  // public playerProperties: Observable<AdapterProperties>

  constructor(
		private params: Object,
		http: Http
	) {
    this.QSDAdapter = new QSDAdapter(params);
    this.FeedAdapter = new FeedAdapter(params, http);
  }

  get getProperties(): Observable<Object> {
    return new Observable(obs => {
      this.FeedAdapter.getProperties.subscribe( properties => {
        obs.next(properties)
      })
      this.QSDAdapter.getProperties.subscribe( properties => {
        obs.next(properties)
      })
      return obs
    })
	}
}



