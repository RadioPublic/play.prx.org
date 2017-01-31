import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { EMBED_FEED_ID_PARAM, EMBED_EPISODE_GUID_PARAM } from './../embed.constants';
import { AdapterProperties } from './adapter.properties';
import { FeedAdapter } from './feed.adapter';

@Injectable()
export class DraperAdapter extends FeedAdapter {

  constructor(http: Http) {
    super(http);
  }

  getProperties(params): Observable<AdapterProperties> {
    let feedId = params[EMBED_FEED_ID_PARAM];
    let episodeGuid = params[EMBED_EPISODE_GUID_PARAM];
    if (feedId) {
      return this.processFeed(feedId, episodeGuid);
    } else {
      return Observable.of({});
    }
  }

  processFeed(feedUrl: string, episodeGuid?: string): Observable<AdapterProperties> {
    return super.processFeed(feedUrl, episodeGuid).map(props => {
      props.subscribeTarget = "_top";
      if (episodeGuid) {
        if (!this.isEncoded(episodeGuid)) {
          episodeGuid = this.encodeGuid(episodeGuid);
        }
        props.subscribeUrl = `${props.subscribeUrl}/ep/${episodeGuid}`;
      }
      return props;
    });
  }

  processDoc(doc: XMLDocument, props: AdapterProperties = {}): AdapterProperties {
    props = super.processDoc(doc, props);
    props.feedArtworkUrl = this.getTagAttributeNS(doc, 'rp', 'image', 'href')
                        || props.feedArtworkUrl;
    props.subscribeUrl = `https://play.radiopublic.com/${this.getTagTextNS(doc, 'rp', 'program-id')}`;
    return props;
  }

  processEpisode(item: Element, props: AdapterProperties = {}): AdapterProperties {
    props = super.processEpisode(item, props);
    props.artworkUrl = this.getTagAttributeNS(item, 'rp', 'image', 'href')
                    || props.artworkUrl;
    return props;
  }

  proxyUrl(feedId: string): string {
    return `https://draper.radiopublic.com/transform?program_id=${feedId}`;
  }

}
