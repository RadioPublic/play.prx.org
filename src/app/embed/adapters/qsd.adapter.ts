import {Injectable} from '@angular/core';
import { EMBED_AUDIO_URL_PARAM, EMBED_TITLE_PARAM, EMBED_SUBTITLE_PARAM,
  EMBED_SUBSCRIBE_URL_PARAM, EMBED_SUBSCRIBE_TARGET, EMBED_IMAGE_URL_PARAM } from './../embed.constants';
import { Observable } from 'rxjs/Observable';
import { AdapterProperties } from './adapter.properties'

@Injectable()
export class QSDAdapter {
  public getProperties(params: Object): Observable<AdapterProperties> {
    return Observable.of(this.playerProperties(params));
  }

  private playerProperties(params): AdapterProperties {
    return  {
      audioUrl:         params[EMBED_AUDIO_URL_PARAM],
      title:            params[EMBED_TITLE_PARAM],
      subtitle:         params[EMBED_SUBTITLE_PARAM],
      subscribeUrl:     params[EMBED_SUBSCRIBE_URL_PARAM],
      subscribeTarget:  params[EMBED_SUBSCRIBE_TARGET],
      artworkUrl:       params[EMBED_IMAGE_URL_PARAM]
    };
  }
}



