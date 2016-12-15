import { EMBED_AUDIO_URL_PARAM, EMBED_TITLE_PARAM, EMBED_SUBTITLE_PARAM,
  EMBED_SUBSCRIBE_URL_PARAM, EMBED_SUBSCRIBE_TARGET, EMBED_IMAGE_URL_PARAM, EMBED_FEED_ID_PARAM, EMBED_EPISODE_GUID_PARAM } from './../embed.constants';
import { QSDAdapter } from './qsd.adapter'
import { Observable } from 'rxjs/Observable';

export class MergeAdapter {

  private QSDAdapter: QSDAdapter

  constructor(private params: Object) {
    this.QSDAdapter = new QSDAdapter(params);
  }

  getParams(): Observable<QSDAdapter> {
		return Observable.create((observer => {
			observer.next(this.QSDAdapter);
			observer.complete();
		}));
	}
}



