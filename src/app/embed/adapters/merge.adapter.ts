import { EMBED_AUDIO_URL_PARAM, EMBED_TITLE_PARAM, EMBED_SUBTITLE_PARAM,
  EMBED_SUBSCRIBE_URL_PARAM, EMBED_SUBSCRIBE_TARGET, EMBED_IMAGE_URL_PARAM, EMBED_FEED_ID_PARAM, EMBED_EPISODE_GUID_PARAM } from './../embed.constants';
import { QSDAdapter } from './qsd.adapter'
import { FeedAdapter } from './feed.adapter'

import { Observable } from 'rxjs/Observable';

export class MergeAdapter {

  private QSDAdapter: QSDAdapter
  private FeedAdapter: FeedAdapter

  constructor(private params: Object) {
    this.QSDAdapter = new QSDAdapter(params);
    this.FeedAdapter = new FeedAdapter(params)
  }

  get getParams(): Observable<Object> {
    return this.FeedAdapter.getParams
      .mergeMap(
        query => this.QSDAdapter.getParams,
        (query, response) => Object.assign(response, query)
      );
	}
}



